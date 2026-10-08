const { bookingError } = require('./bookingAvailability');

async function activeAccount(db, accountId) {
  const account = await db.tAIKHOAN.findUnique({ where: { MATK: accountId } });
  if (!account || account.TRANGTHAI?.trim().toLowerCase() !== 'hoạt động')
    throw bookingError('Tài khoản không còn hoạt động.', 401);
  return account;
}

function formatReview(review) {
  return { rating: review.SOSAO, comment: review.NHANXET, createdAt: review.TAOLUC };
}

// Kiểm tra chủ sở hữu ở server; khóa lịch và khóa chính chặn hai yêu cầu gửi cùng lúc.
async function createReview(db, accountId, bookingId, input) {
  if (typeof bookingId !== 'string' || !bookingId.trim() || bookingId.trim().length > 20)
    throw bookingError('Mã lịch không hợp lệ.');
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    throw bookingError('Vui lòng chọn từ 1 đến 5 sao.');
  if (input.comment !== undefined && typeof input.comment !== 'string')
    throw bookingError('Nhận xét không hợp lệ.');
  const comment = (input.comment || '').trim();
  if (comment.length > 500) throw bookingError('Nhận xét tối đa 500 ký tự.');
  await activeAccount(db, accountId);
  try {
    return await db.$transaction(async (tx) => {
      const customer = await tx.kHACHHANG.findUnique({ where: { MATK: accountId } });
      if (!customer) throw bookingError('Không tìm thấy khách hàng.', 403);
      const id = bookingId.trim();
      await tx.$queryRaw`SELECT MALICH FROM LICHHEN WHERE MALICH = ${id} AND MAKH = ${customer.MAKH} FOR UPDATE`;
      const booking = await tx.lICHHEN.findFirst({
        where: { MALICH: id, MAKH: customer.MAKH },
        include: { DANHGIA: true },
      });
      if (!booking) throw bookingError('Không tìm thấy lịch hẹn của bạn.', 404);
      if (!['Hoàn thành', 'Đã hoàn thành'].includes(booking.TRANGTHAI?.trim()))
        throw bookingError('Chỉ đánh giá lịch đã hoàn thành.', 409);
      if (booking.DANHGIA)
        throw bookingError('Bạn đã đánh giá lịch này. Hãy tải lại lịch sử.', 409);
      const review = await tx.dANHGIALICH.create({
        data: { MALICH: id, SOSAO: input.rating, NHANXET: comment },
      });
      return formatReview(review);
    });
  } catch (error) {
    if (error.code === 'P2002')
      throw bookingError('Bạn đã đánh giá lịch này. Hãy tải lại lịch sử.', 409);
    throw error;
  }
}

function dateBound(value, end = false) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw bookingError('Ngày không hợp lệ.');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    throw bookingError('Ngày không hợp lệ.');
  // Lọc theo ngày gửi đánh giá tại Việt Nam, dùng cận trên loại trừ để bao trọn ngày cuối.
  return new Date(date.getTime() - 7 * 3600000 + (end ? 86400000 : 0));
}

async function listReviews(db, accountId, input) {
  const account = await activeAccount(db, accountId);
  if (![1, 2].includes(account.PHANQUYEN))
    throw bookingError('Chỉ quản lý được xem phản hồi.', 403);
  const where = {};
  if (input.branchId) {
    if (typeof input.branchId !== 'string' || input.branchId.length > 20)
      throw bookingError('Chi nhánh không hợp lệ.');
    where.LICHHEN = { MACHINHANH: input.branchId.trim() };
  }
  if (input.rating) {
    const rating = Number(input.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      throw bookingError('Số sao không hợp lệ.');
    where.SOSAO = rating;
  }
  if (input.start || input.end) {
    where.TAOLUC = {};
    if (input.start) where.TAOLUC.gte = dateBound(input.start);
    if (input.end) where.TAOLUC.lt = dateBound(input.end, true);
    if (input.start && input.end && input.start > input.end)
      throw bookingError('Khoảng ngày không hợp lệ.');
  }
  const page = Number(input.page || 1);
  if (!Number.isSafeInteger(page) || page < 1) throw bookingError('Trang không hợp lệ.');
  return db.$transaction(
    async (tx) => {
      const groups = await tx.dANHGIALICH.groupBy({ by: ['SOSAO'], where, _count: { _all: true } });
      const total = groups.reduce((sum, group) => sum + group._count._all, 0);
      const points = groups.reduce((sum, group) => sum + group.SOSAO * group._count._all, 0);
      const positive = groups
        .filter((group) => group.SOSAO >= 4)
        .reduce((sum, group) => sum + group._count._all, 0);
      const totalPages = Math.max(1, Math.ceil(total / 10));
      const currentPage = Math.min(page, totalPages);
      const items = await tx.dANHGIALICH.findMany({
        where,
        orderBy: [{ TAOLUC: 'desc' }, { MALICH: 'asc' }],
        skip: (currentPage - 1) * 10,
        take: 10,
        include: {
          LICHHEN: {
            include: {
              CHINHANH: { select: { TENCHINHANH: true } },
              KHACHHANG: { select: { HOTEN: true } },
              CHITIETLICHHEN: {
                include: {
                  DICHVU: { select: { TENDV: true } },
                  NHANVIEN: { select: { HOTEN: true } },
                },
              },
            },
          },
        },
      });
      const branches = await tx.cHINHANH.findMany({
        select: { MACHINHANH: true, TENCHINHANH: true },
      });
      return {
        items,
        branches,
        total,
        page: currentPage,
        totalPages,
        average: total ? points / total : null,
        positiveRate: total ? (positive * 100) / total : null,
      };
    },
    { isolationLevel: 'RepeatableRead' },
  );
}

module.exports = { createReview, listReviews, formatReview, dateBound };

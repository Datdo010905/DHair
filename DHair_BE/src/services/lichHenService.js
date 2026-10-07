const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//LỊCH HẸN
const getAllLichHen = async () => await prisma.lICHHEN.findMany();

const getLichHenByID = async (ma) => await prisma.lICHHEN.findUnique({ where: { MALICH: ma } });

const getLichHenByIDKH = async (ma) =>
  await prisma.lICHHEN.findMany({
    where: { MAKH: ma },
    orderBy: [{ NGAYHEN: 'desc' }, { GIOHEN: 'desc' }],
  });

const getLichHenTheoNhanVien = async (matk) => {
  const cleanMatk = matk.trim();

  //TÌM MÃ NHÂN VIÊN TỪ TÀI KHOẢN
  const nhanVien = await prisma.nHANVIEN.findFirst({
    where: {
      MATK: cleanMatk,
    },
  });
  if (!nhanVien) {
    console.log('Tài khoản này chưa được liên kết với nhân viên nào!');
    return [];
  }

  const manvThucTe = nhanVien.MANV;

  return await prisma.lICHHEN.findMany({
    where: {
      // Lọc những Lịch hẹn mà có ít nhất một chi tiết chứa MANV này
      CHITIETLICHHEN: {
        some: {
          MANV: manvThucTe,
        },
      },
    },
    // lấy thông tin liên quan
    include: {
      KHACHHANG: true,
      CHITIETLICHHEN: {
        where: { MANV: manvThucTe }, //lấy đúng phần việc của ông stylist này
      },
    },
    orderBy: {
      NGAYHEN: 'desc', // Lịch mới nhất hiện lên đầu
    },
  });
};

const createLichHen = async (model) => {
  const gioGoc = model.GIOHEN || model.giohen;

  // tạo thành chuỗi chuẩn ISO
  const gioHenChuanISO = new Date(`1970-01-01T${gioGoc}:00.000Z`);

  const maKH = (model.MAKH || model.makh).trim();

  return await prisma.lICHHEN.create({
    data: {
      MALICH: model.MALICH || model.malich,
      NGAYHEN: new Date(model.NGAYHEN || model.ngayhen),
      GIOHEN: gioHenChuanISO,
      TRANGTHAI: model.TRANGTHAI || model.trangthai,
      MACHINHANH: model.MACHINHANH || model.machinhanh,
      MAKH: maKH, // Đã được gọt sạch khoảng trắng
    },
  });
};
const updateTrangThai = async (ma, trangthai) => {
  const booking = await prisma.lICHHEN.findUnique({ where: { MALICH: ma } });
  if (!booking) throw Object.assign(new Error('Không tìm thấy lịch hẹn.'), { status: 404 });
  const nextStatus = typeof trangthai === 'string' ? trangthai.trim() : '';
  const transitions = {
    'Đã đặt': ['Đang chờ', 'Đã đến', 'Đã huỷ'],
    'Đang chờ': ['Đã đến', 'Đang thực hiện', 'Đã huỷ'],
    'Đã đến': ['Đang thực hiện', 'Đã huỷ'],
    'Đang thực hiện': ['Hoàn thành'],
  };
  if (!transitions[booking.TRANGTHAI?.trim()]?.includes(nextStatus)) {
    throw Object.assign(
      new Error('Trạng thái lịch đã thay đổi hoặc không đúng quy trình. Vui lòng tải lại.'),
      { status: 409 },
    );
  }
  // Không để yêu cầu cũ từ admin ghi đè lịch vừa được khách hủy.
  const result = await prisma.lICHHEN.updateMany({
    where: { MALICH: ma, TRANGTHAI: booking.TRANGTHAI },
    data: { TRANGTHAI: nextStatus },
  });
  if (result.count !== 1)
    throw Object.assign(new Error('Lịch vừa thay đổi. Vui lòng tải lại.'), { status: 409 });
  return { ...booking, TRANGTHAI: nextStatus };
};

const deleteLichHen = async (ma) => await prisma.lICHHEN.delete({ where: { MALICH: ma } });

const getLichHenTheoNgay = async (ngaybd, ngaykt) => {
  const start = new Date(ngaybd);
  const end = new Date(ngaykt);
  end.setHours(23, 59, 59, 999); // Lấy đến tận 23:59:59 của ngày kết thúc

  return await prisma.lICHHEN.findMany({
    where: {
      NGAYHEN: {
        gte: start, // Lớn hơn hoặc bằng ngày bắt đầu
        lte: end, // Nhỏ hơn hoặc bằng ngày kết thúc
      },
    },
    orderBy: {
      NGAYHEN: 'desc', // Sắp xếp giảm dần y hệt C#
    },
  });
};

// Nhớ ném getLichHenTheoNgay vào module.exports nhé bro!

//CHI TIẾT LỊCH HẸN
const getAllCT = async () => await prisma.cHITIETLICHHEN.findMany();

const getCTByID = async (ma) => {
  // Dùng findMany thay unique
  return await prisma.cHITIETLICHHEN.findMany({ where: { MALICH: ma } });
};

const createCT = async (model) => {
  return await prisma.cHITIETLICHHEN.create({
    data: {
      MALICH: model.MALICH || model.malich,
      MADV: model.MADV || model.madv,
      MANV: model.MANV || model.manv,
      SOLUONG: Number(model.SOLUONG || model.soluong),
      GIA_DUKIEN: Number(model.GIA_DUKIEN || model.giA_DUKIEN || 0),
      GHICHU: model.GHICHU || model.ghichu || 'Không có ghi chú',
    },
  });
};
const updateCT = async (ma, ghichu) => {
  return await prisma.cHITIETLICHHEN.updateMany({
    where: { MALICH: ma },
    data: { GHICHU: ghichu },
  });
};

// Nhớ ném updateCT vào module.exports ở cuối file nhé!
const deleteCT = async (ma) => {
  //deleteMany xoá những lịch liên quan "ma"
  return await prisma.cHITIETLICHHEN.deleteMany({ where: { MALICH: ma } });
};

const { getDateWindow, bookingError } = require('./bookingAvailability');
const adminStatuses = ['Đã đặt', 'Đang chờ', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ', 'Đã đến'];

function parseAdminDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw bookingError('Ngày không hợp lệ.');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    throw bookingError('Ngày không hợp lệ.');
  return date;
}

async function getAdminBookings(input, auth, db = prisma, now = new Date()) {
  if (!auth || ![1, 2, 3, 4, 5].includes(auth.role))
    throw bookingError('Không có quyền xem lịch hẹn.', 403);
  if (auth.role === 3 && (typeof auth.accountId !== 'string' || !auth.accountId.trim()))
    throw bookingError('Phiên đăng nhập không hợp lệ.', 401);
  const window = getDateWindow(now);
  const mode = input.mode ?? 'days';
  if (!['days', 'archive'].includes(mode)) throw bookingError('Chế độ xem không hợp lệ.');
  const start = input.start || window.today;
  const end = mode === 'days' ? start : input.end || start;
  const startDate = parseAdminDate(start);
  const endDate = parseAdminDate(end);
  if (start > end) throw bookingError('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
  if (mode === 'days' && (start < window.today || start > window.lastDay))
    throw bookingError('Hãy chọn trong 5 ngày được phép đặt lịch.');
  const page = Number(input.page ?? 1);
  const pageSize = Number(input.pageSize ?? 10);
  if (!Number.isSafeInteger(page) || page < 1 || ![10, 20, 50].includes(pageSize))
    throw bookingError('Phân trang không hợp lệ.');
  for (const key of ['status', 'branchId', 'staffId', 'search']) {
    if (
      input[key] !== undefined &&
      (typeof input[key] !== 'string' || input[key].length > (key === 'search' ? 100 : 50))
    )
      throw bookingError('Bộ lọc không hợp lệ.');
  }
  const status = input.status === 'Đã hủy' ? 'Đã huỷ' : input.status;
  if (status && !adminStatuses.includes(status)) throw bookingError('Trạng thái không hợp lệ.');
  const base = {};
  if (input.branchId) base.MACHINHANH = input.branchId.trim();
  // Bộ lọc stylist không được thay thế phạm vi quyền của người đang đăng nhập.
  const detailWhere = {};
  if (auth.role === 3) detailWhere.NHANVIEN = { MATK: auth.accountId };
  if (input.staffId) detailWhere.MANV = input.staffId.trim();
  if (Object.keys(detailWhere).length) base.CHITIETLICHHEN = { some: detailWhere };
  const search = input.search?.trim();
  if (search)
    base.OR = [
      { MALICH: { contains: search } },
      { KHACHHANG: { HOTEN: { contains: search } } },
      { KHACHHANG: { SDT: { contains: search } } },
    ];
  const dateWhere = { ...base, NGAYHEN: { gte: startDate, lte: endDate } };
  const where = { ...dateWhere };
  if (status) where.TRANGTHAI = status === 'Đã huỷ' ? { in: ['Đã huỷ', 'Đã hủy'] } : status;
  return db.$transaction(
    async (tx) => {
      const total = await tx.lICHHEN.count({ where });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const currentPage = Math.min(page, totalPages);
      const items = await tx.lICHHEN.findMany({
        where,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        orderBy: [{ NGAYHEN: 'asc' }, { GIOHEN: 'asc' }, { MALICH: 'asc' }],
        include: {
          KHACHHANG: { select: { HOTEN: true, SDT: true } },
          CHINHANH: { select: { TENCHINHANH: true } },
          CHITIETLICHHEN: {
            where: auth.role === 3 ? { NHANVIEN: { MATK: auth.accountId } } : {},
            include: { DICHVU: { select: { TENDV: true } }, NHANVIEN: { select: { HOTEN: true } } },
            orderBy: { MADV: 'asc' },
          },
        },
      });
      // Bộ đếm bỏ riêng trạng thái để người dùng bấm chuyển nhóm được.
      const groups = await tx.lICHHEN.groupBy({
        by: ['TRANGTHAI'],
        where: dateWhere,
        _count: { _all: true },
      });
      const statusCounts = Object.fromEntries(adminStatuses.map((name) => [name, 0]));
      for (const group of groups) {
        const name = group.TRANGTHAI?.trim() === 'Đã hủy' ? 'Đã huỷ' : group.TRANGTHAI?.trim();
        statusCounts[name] = (statusCounts[name] || 0) + group._count._all;
      }
      const dayGroups = await tx.lICHHEN.groupBy({
        by: ['NGAYHEN'],
        _count: { _all: true },
        where: {
          ...base,
          NGAYHEN: { gte: parseAdminDate(window.today), lte: parseAdminDate(window.lastDay) },
        },
      });
      const days = [];
      for (
        let date = parseAdminDate(window.today);
        date <= parseAdminDate(window.lastDay);
        date.setUTCDate(date.getUTCDate() + 1)
      ) {
        const value = date.toISOString().slice(0, 10);
        const group = dayGroups.find((item) => item.NGAYHEN.toISOString().slice(0, 10) === value);
        days.push({ date: value, count: group?._count._all || 0 });
      }
      const branches = await tx.cHINHANH.findMany({
        select: { MACHINHANH: true, TENCHINHANH: true },
        orderBy: { MACHINHANH: 'asc' },
      });
      const stylists = await tx.nHANVIEN.findMany({
        where: { CHUCVU: 'Stylist', ...(auth.role === 3 ? { MATK: auth.accountId } : {}) },
        select: { MANV: true, HOTEN: true, MACHINHANH: true },
        orderBy: { HOTEN: 'asc' },
      });
      return {
        items,
        total,
        page: currentPage,
        pageSize,
        totalPages,
        statusCounts,
        days,
        branches,
        stylists,
        ...window,
        start,
        end,
      };
    },
    { isolationLevel: 'RepeatableRead' },
  );
}

module.exports = {
  getAdminBookings,
  getAllLichHen,
  getLichHenByID,
  getLichHenByIDKH,
  getLichHenTheoNhanVien,
  createLichHen,
  updateTrangThai,
  deleteLichHen,
  getLichHenTheoNgay,
  getAllCT,
  getCTByID,
  createCT,
  updateCT,
  deleteCT,
};

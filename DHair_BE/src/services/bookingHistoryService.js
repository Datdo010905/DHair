const { bookingError } = require('./bookingAvailability');

const cancellationReasons = [
    'Bận việc đột xuất',
    'Muốn đổi ngày/giờ hẹn',
    'Muốn đổi chi nhánh hoặc stylist',
    'Đặt nhầm lịch',
    'Không còn nhu cầu',
    'Khác',
];

const historyInclude = {
    CHINHANH: { select: { TENCHINHANH: true, DIACHI: true } },
    CHITIETLICHHEN: {
        include: {
            DICHVU: { select: { TENDV: true, THOIGIAN: true } },
            NHANVIEN: { select: { HOTEN: true } },
        },
        orderBy: { MADV: 'asc' },
    },
};

async function getCustomer(db, accountId) {
    if (typeof accountId !== 'string' || !accountId.trim()) throw bookingError('Vui lòng đăng nhập lại.', 401);
    const customer = await db.kHACHHANG.findUnique({
        where: { MATK: accountId.trim() },
        select: { MAKH: true },
    });
    if (!customer) throw bookingError('Không tìm thấy thông tin khách hàng.', 403);
    return customer;
}

function formatAppointment(booking) {
    const details = booking.CHITIETLICHHEN.map(detail => ({
        id: detail.MADV.trim(),
        service: detail.DICHVU?.TENDV?.trim() || detail.MADV.trim(),
        stylist: detail.NHANVIEN?.HOTEN?.trim() || 'Chưa phân công',
        quantity: detail.SOLUONG ?? 1,
        duration: (detail.DICHVU?.THOIGIAN || 0) * (detail.SOLUONG ?? 1),
        // GIA_DUKIEN đã là giá của cả số lượng, không nhân thêm lần nữa.
        price: detail.GIA_DUKIEN ?? 0,
        note: detail.GHICHU?.trim() || '',
    }));
    let status = booking.TRANGTHAI?.trim() || 'Chưa xác định';
    if (status === 'Đã hủy') status = 'Đã huỷ';
    if (status === 'Đã hoàn thành') status = 'Hoàn thành';
    return {
        id: booking.MALICH.trim(),
        date: booking.NGAYHEN.toISOString().slice(0, 10),
        // MySQL TIME được Prisma trả dưới dạng Date UTC, không đổi thêm múi giờ.
        time: booking.GIOHEN.toISOString().slice(11, 16),
        status,
        salon: booking.CHINHANH?.TENCHINHANH?.trim() || booking.MACHINHANH?.trim() || 'Chưa có chi nhánh',
        address: booking.CHINHANH?.DIACHI?.trim() || 'Chưa có địa chỉ',
        service: details.map(detail => detail.service).join(', ') || 'Chưa có dịch vụ',
        duration: details.reduce((sum, detail) => sum + detail.duration, 0),
        price: details.reduce((sum, detail) => sum + detail.price, 0),
        details,
    };
}

async function getHistory(db, accountId) {
    const customer = await getCustomer(db, accountId);
    const bookings = await db.lICHHEN.findMany({
        where: { MAKH: customer.MAKH },
        include: historyInclude,
        orderBy: [{ NGAYHEN: 'desc' }, { GIOHEN: 'desc' }, { MALICH: 'desc' }],
    });
    return { appointments: bookings.map(formatAppointment), cancellationReasons };
}

async function cancelBooking(db, accountId, bookingId, input) {
    if (typeof bookingId !== 'string' || !bookingId.trim() || bookingId.trim().length > 20) {
        throw bookingError('Mã lịch hẹn không hợp lệ.');
    }
    const reason = typeof input.reason === 'string' ? input.reason.trim() : '';
    if (!cancellationReasons.includes(reason)) throw bookingError('Vui lòng chọn lý do hủy hợp lệ.');
    const otherReason = typeof input.otherReason === 'string' ? input.otherReason.trim() : '';
    if (reason === 'Khác' && !otherReason) throw bookingError('Vui lòng nhập lý do hủy.');
    const note = reason === 'Khác' ? `Khác: ${otherReason}` : reason;
    if (note.length > 200) throw bookingError('Lý do hủy tối đa 200 ký tự.');

    return db.$transaction(async tx => {
        const customer = await getCustomer(tx, accountId);
        const where = { MALICH: bookingId.trim(), MAKH: customer.MAKH };
        // Điều kiện nằm ngay trong UPDATE: lịch đổi trạng thái thì không được hủy.
        const updated = await tx.lICHHEN.updateMany({
            where: { ...where, TRANGTHAI: 'Đã đặt' },
            data: { TRANGTHAI: 'Đã huỷ' },
        });
        if (updated.count !== 1) {
            const existing = await tx.lICHHEN.findFirst({ where, select: { MALICH: true } });
            if (!existing) throw bookingError('Không tìm thấy lịch hẹn của bạn.', 404);
            throw bookingError('Chỉ được hủy lịch ở trạng thái Đã đặt. Vui lòng tải lại danh sách.', 409);
        }
        // Ghi đè ghi chú của tất cả dịch vụ theo yêu cầu; lỗi sẽ hoàn tác cả trạng thái.
        const details = await tx.cHITIETLICHHEN.updateMany({
            where: { MALICH: bookingId.trim() }, data: { GHICHU: note },
        });
        if (details.count === 0) throw bookingError('Lịch chưa có chi tiết để lưu lý do hủy. Vui lòng liên hệ salon.', 409);
        const booking = await tx.lICHHEN.findFirst({ where, include: historyInclude });
        return formatAppointment(booking);
    });
}

module.exports = { getHistory, cancelBooking, formatAppointment, cancellationReasons };

const { randomUUID } = require('node:crypto');
const { bookingError, getDateWindow, validateDate, calculateSlots } = require('./bookingAvailability');
const { MINUTE, overlaps, LEAVE_BUFFER_MS, leaveInterval } = require('./salonTime');

function requiredId(value, label) {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 20) {
        throw bookingError(`Thiếu hoặc sai ${label}.`);
    }
    return value.trim();
}

async function getOptions(db, branchId) {
    const branches = await db.cHINHANH.findMany({
        select: { MACHINHANH: true, TENCHINHANH: true, DIACHI: true },
    });
    const staff = branchId ? await db.nHANVIEN.findMany({
        where: { MACHINHANH: requiredId(branchId, 'chi nhánh') },
        select: { MANV: true, HOTEN: true, CHUCVU: true },
    }) : [];
    return {
        branches,
        stylists: staff.filter(item => item.CHUCVU?.trim().toLowerCase() === 'stylist'),
        ...getDateWindow(),
    };
}

async function getAvailability(db, input) {
    const branchId = requiredId(input.branchId, 'chi nhánh');
    const staffId = requiredId(input.staffId, 'stylist');
    const serviceId = requiredId(input.serviceId, 'dịch vụ');
    validateDate(input.date);
    const quantity = Number(input.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1) throw bookingError('Số lượng dịch vụ không hợp lệ.');
    const staff = await db.nHANVIEN.findUnique({ where: { MANV: staffId } });
    if (!staff || staff.MACHINHANH?.trim() !== branchId || staff.CHUCVU?.trim().toLowerCase() !== 'stylist') {
        throw bookingError('Stylist không thuộc chi nhánh đã chọn.');
    }
    const service = await db.dICHVU.findUnique({ where: { MADV: serviceId } });
    if (!service || service.TRANGTHAI?.trim() !== 'Đang cung cấp') {
        throw bookingError('Dịch vụ hiện không được cung cấp.');
    }
    const bookings = await db.lICHHEN.findMany({
        where: {
            OR: [{ NGAYHEN: new Date(`${input.date}T00:00:00Z`) }, { TRANGTHAI: 'Đang thực hiện' }],
            CHITIETLICHHEN: { some: { MANV: staffId } },
        },
        include: { CHITIETLICHHEN: { include: { DICHVU: true } }, HANGDOI: true },
    });
    const duration = service.THOIGIAN * quantity;
    const leaves = await db.lICHNGHI.findMany({ where: { MANV: staffId,
        BATDAU: { lt: new Date(`${input.date}T22:00:00+07:00`) },
        KETTHUC: { gt: new Date(new Date(`${input.date}T08:00:00+07:00`).getTime() - LEAVE_BUFFER_MS) } } });
    return {
        duration,
        price: Math.round(service.GIADV * quantity),
        slots: calculateSlots(input.date, duration, bookings, staffId).filter(slot => {
            const start = new Date(`${input.date}T${slot.time}:00+07:00`);
            const end = new Date(start.getTime() + duration * MINUTE);
            return !leaves.some(leave => overlaps({ start, end }, leaveInterval(leave)));
        }),
    };
}

async function createBooking(db, input) {
    const staffId = requiredId(input.staffId, 'stylist');
    const customerId = requiredId(input.customerId || input.accountId, 'khách hàng');
    const note = typeof input.note === 'string' ? input.note.trim() : '';
    if (note.length > 200) throw bookingError('Ghi chú tối đa 200 ký tự.');
    return db.$transaction(async tx => {
        // Chung khóa chi nhánh với tiếp nhận khách, đổi lịch và ghi nhận nghỉ.
        await tx.$queryRaw`SELECT MACHINHANH FROM CHINHANH WHERE MACHINHANH = ${input.branchId} FOR UPDATE`;
        // Khóa hàng nhân viên để hai yêu cầu đồng thời không cùng chiếm một giờ.
        await tx.$queryRaw`SELECT MANV FROM NHANVIEN WHERE MANV = ${staffId} FOR UPDATE`;
        const availability = await getAvailability(tx, input);
        if (!availability.slots.some(slot => slot.time === input.time)) {
            throw bookingError('Giờ này không còn trống. Vui lòng chọn lại giờ hẹn.', 409);
        }
        const customer = input.accountId
            ? await tx.kHACHHANG.findUnique({ where: { MATK: customerId } })
            : await tx.kHACHHANG.findUnique({ where: { MAKH: customerId } });
        if (!customer) throw bookingError('Không tìm thấy thông tin khách hàng.');
        const bookingId = input.bookingId || `LH${randomUUID().replace(/-/g, '').slice(0, 18)}`;
        const booking = await tx.lICHHEN.create({ data: {
            MALICH: requiredId(bookingId, 'mã lịch'),
            NGAYHEN: new Date(`${input.date}T00:00:00Z`),
            GIOHEN: new Date(`1970-01-01T${input.time}:00Z`),
            MACHINHANH: input.branchId.trim(), MAKH: customer.MAKH, TRANGTHAI: 'Đã đặt',
            KETTHUCDUKIEN: new Date(new Date(`${input.date}T${input.time}:00+07:00`).getTime() + availability.duration * MINUTE),
        } });
        await tx.cHITIETLICHHEN.create({ data: {
            MALICH: booking.MALICH, MADV: input.serviceId.trim(), MANV: staffId,
            SOLUONG: Number(input.quantity ?? 1), GIA_DUKIEN: availability.price, GHICHU: note,
            THOILUONG: availability.duration / Number(input.quantity ?? 1),
        } });
        return booking;
    }, { isolationLevel: 'ReadCommitted' });
}

module.exports = { getOptions, getAvailability, createBooking };

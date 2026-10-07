const { randomUUID } = require('node:crypto');
const { bookingError, validateDate } = require('./bookingAvailability');
const { MINUTE, LEAVE_BUFFER_MS, leaveInterval, localDate, appointmentStart, duration, interval, overlaps, inQueue, terminal, workingHours } = require('./salonTime');

const include = {
    CHITIETLICHHEN: { include: { DICHVU: true, NHANVIEN: { select: { HOTEN: true } } } },
    KHACHHANG: { select: { HOTEN: true, SDT: true } }, HANGDOI: true,
};
const id = prefix => prefix + randomUUID().replace(/-/g, '').slice(0, 18);
function required(value, label, max = 20) {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw bookingError(`${label} không hợp lệ.`);
    return value.trim();
}
function quantity(value = 1) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 20) throw bookingError('Số lượng từ 1 đến 20.');
    return number;
}
async function log(tx, bookingId, actor, content) {
    await tx.lICHSULICH.create({ data: { ID: id('LS'), MALICH: bookingId, NGUOISUA: actor, NOIDUNG: content } });
}
async function lockBranch(tx, branchId) {
    const rows = await tx.$queryRaw`SELECT MACHINHANH FROM CHINHANH WHERE MACHINHANH = ${branchId} FOR UPDATE`;
    if (!rows.length) throw bookingError('Không tìm thấy chi nhánh.', 404);
}
async function staff(tx, staffId, branchId) {
    const result = await tx.nHANVIEN.findUnique({ where: { MANV: required(staffId, 'Stylist') } });
    if (!result || result.MACHINHANH?.trim() !== branchId.trim() || result.CHUCVU?.trim().toLowerCase() !== 'stylist') {
        throw bookingError('Stylist không thuộc chi nhánh.');
    }
    return result;
}
async function service(tx, serviceId) {
    const result = await tx.dICHVU.findUnique({ where: { MADV: required(serviceId, 'Dịch vụ') } });
    if (!result || result.TRANGTHAI?.trim() !== 'Đang cung cấp' || result.THOIGIAN <= 0 || result.GIADV < 0) {
        throw bookingError('Dịch vụ không còn được cung cấp hoặc thiếu thời lượng/giá.');
    }
    return result;
}

async function conflicts(tx, branchId, staffIds, start, end, excludeId, now) {
    const bookings = await tx.lICHHEN.findMany({
        where: { MACHINHANH: branchId, MALICH: { not: excludeId || '' }, TRANGTHAI: { notIn: terminal },
            CHITIETLICHHEN: { some: { MANV: { in: staffIds } } } }, include,
    });
    const affected = bookings.filter(item => !inQueue(item) && overlaps({ start, end }, interval(item, now)))
        .map(item => ({ id: item.MALICH, customer: item.KHACHHANG?.HOTEN, type: 'booking' }));
    // Lịch nghỉ vừa kết thúc vẫn chặn nhận khách trong 30 phút tiếp theo.
    const leaves = await tx.lICHNGHI.findMany({ where: { MANV: { in: staffIds }, BATDAU: { lt: end }, KETTHUC: { gt: new Date(start.getTime() - LEAVE_BUFFER_MS) } } });
    return affected.concat(leaves.map(item => ({ id: item.ID, type: 'leave', customer: 'Nhân viên nghỉ' })));
}
function rejectConflicts(items) {
    if (items.length) throw Object.assign(bookingError(`Trùng lịch/nghỉ: ${items.map(item => item.id).join(', ')}. Hãy đổi thợ hoặc giờ trước.`, 409), { conflicts: items });
}

async function mutate(db, bookingId, actor, callback) {
    return db.$transaction(async tx => {
        const initial = await tx.lICHHEN.findUnique({ where: { MALICH: required(bookingId, 'Mã lịch') } });
        if (!initial?.MACHINHANH) throw bookingError('Không tìm thấy lịch hoặc chi nhánh.', 404);
        // Cùng thứ tự khóa với đặt lịch: chi nhánh trước, rồi lịch hẹn.
        // Hai lễ tân không thể nhận cùng khách hoặc cùng chiếm một stylist.
        await lockBranch(tx, initial.MACHINHANH);
        await tx.$queryRaw`SELECT MALICH FROM LICHHEN WHERE MALICH = ${bookingId} FOR UPDATE`;
        const booking = await tx.lICHHEN.findUnique({ where: { MALICH: bookingId }, include });
        if (terminal.includes(booking.TRANGTHAI)) throw bookingError('Lịch đã kết thúc/hủy. Hãy tạo lượt mới nếu khách quay lại.', 409);
        const result = await callback(tx, booking);
        await log(tx, bookingId, actor, result.message);
        return result;
    }, { isolationLevel: 'ReadCommitted', timeout: 15000 });
}

async function changeStatus(db, bookingId, status, actor, reason, now = new Date()) {
    return mutate(db, bookingId, actor, async (tx, booking) => {
        const allowed = {
            'Đã đặt': ['Đang chờ', 'Đã đến', 'Đã huỷ'],
            'Đang chờ': ['Đã đến', 'Đang thực hiện', 'Đã huỷ'],
            'Đã đến': ['Đang thực hiện', 'Đã huỷ'], 'Đang thực hiện': ['Hoàn thành'],
        };
        if (!allowed[booking.TRANGTHAI]?.includes(status)) throw bookingError('Trạng thái đã đổi hoặc không đúng quy trình.', 409);
        const data = { TRANGTHAI: status };
        if (['Đã đến', 'Đang thực hiện'].includes(status)) {
            if (!booking.THOIGIANDEN && booking.TRANGTHAI !== 'Đã đến' && now > new Date(appointmentStart(booking).getTime() + 10 * MINUTE)) {
                throw bookingError('Khách đã quá hạn 10 phút. Hủy lịch cũ và nhận lượt khách trực tiếp mới.', 409);
            }
            if (localDate(now) !== localDate(appointmentStart(booking))) throw bookingError('Chỉ nhận khách trong ngày hẹn.');
            data.THOIGIANDEN = booking.THOIGIANDEN || now;
        }
        if (status === 'Đang thực hiện') {
            const minutes = duration(booking.CHITIETLICHHEN);
            const end = new Date(now.getTime() + minutes * MINUTE);
            if (!workingHours(now, end)) throw bookingError('Không đủ thời gian phục vụ trong giờ mở cửa (08:00–22:00).');
            const staffIds = [...new Set(booking.CHITIETLICHHEN.map(item => item.MANV))];
            if (!staffIds.length || staffIds.some(value => !value)) throw bookingError('Hãy phân công stylist trước khi bắt đầu.');
            rejectConflicts(await conflicts(tx, booking.MACHINHANH, staffIds, now, end, bookingId, now));
            data.BATDAUTHUCTE = now;
            data.KETTHUCDUKIEN = end;
            await tx.hANGDOI.updateMany({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'DA_PHUC_VU' } });
        }
        if (status === 'Hoàn thành') data.KETTHUCTHUCTE = now;
        if (status === 'Đã huỷ') {
            data.LYDOHUY = reason ? required(reason, 'Lý do hủy', 200) : 'Salon hủy';
            await tx.hANGDOI.updateMany({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'DA_ROI' } });
        }
        const updated = await tx.lICHHEN.update({ where: { MALICH: bookingId }, data });
        return { booking: updated, message: `${booking.TRANGTHAI} → ${status}` };
    });
}

async function walkIn(db, input, actor, now = new Date()) {
    const branchId = required(input.branchId, 'Chi nhánh');
    return db.$transaction(async tx => {
        await lockBranch(tx, branchId);
        let customer;
        if (input.customerId) customer = await tx.kHACHHANG.findUnique({ where: { MAKH: required(input.customerId, 'Khách hàng') } });
        else {
            const phone = required(input.phone, 'Số điện thoại', 10);
            if (!/^0\d{9}$/.test(phone)) throw bookingError('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
            customer = await tx.kHACHHANG.findUnique({ where: { SDT: phone } });
            if (!customer) customer = await tx.kHACHHANG.create({ data: { MAKH: id('KH'), SDT: phone, HOTEN: required(input.name, 'Họ tên', 100) } });
        }
        if (!customer) throw bookingError('Không tìm thấy khách hàng.');
        const selected = await service(tx, input.serviceId);
        const count = quantity(input.quantity);
        const stylist = input.staffId ? await staff(tx, input.staffId, branchId) : null;
        const end = new Date(now.getTime() + selected.THOIGIAN * count * MINUTE);
        const busy = stylist ? await conflicts(tx, branchId, [stylist.MANV], now, end, '', now) : [];
        const canStart = !!stylist && !busy.length && workingHours(now, end) && !input.queue;
        const local = new Date(now.getTime() + 7 * 60 * MINUTE).toISOString();
        const booking = await tx.lICHHEN.create({ data: {
            MALICH: id('LH'), MAKH: customer.MAKH, MACHINHANH: branchId,
            NGAYHEN: new Date(`${local.slice(0, 10)}T00:00:00Z`), GIOHEN: new Date(`1970-01-01T${local.slice(11)}`),
            LOAILICH: 'WALK_IN', TRANGTHAI: canStart ? 'Đang thực hiện' : 'Đã đến', THOIGIANDEN: now,
            BATDAUTHUCTE: canStart ? now : null, KETTHUCDUKIEN: canStart ? end : null,
        } });
        await tx.cHITIETLICHHEN.create({ data: { MALICH: booking.MALICH, MADV: selected.MADV, MANV: stylist?.MANV || null,
            SOLUONG: count, THOILUONG: selected.THOIGIAN, GIA_DUKIEN: Math.round(selected.GIADV * count) } });
        if (!canStart) await tx.hANGDOI.create({ data: { MALICH: booking.MALICH, VAOLUC: now } });
        const message = canStart ? 'Đã nhận khách trực tiếp và bắt đầu phục vụ.' : 'Đã nhận khách vào hàng đợi.';
        await log(tx, booking.MALICH, actor, message);
        return { booking, message };
    }, { isolationLevel: 'ReadCommitted', timeout: 15000 });
}

async function queueAction(db, bookingId, input, actor, now = new Date()) {
    return mutate(db, bookingId, actor, async (tx, booking) => {
        if (booking.TRANGTHAI !== 'Đã đến') throw bookingError('Hãy xác nhận khách đã đến trước khi xếp hàng.', 409);
        if (input.action === 'join') {
            if (inQueue(booking)) throw bookingError('Khách đã ở trong hàng đợi.', 409);
            await tx.hANGDOI.upsert({ where: { MALICH: bookingId }, create: { MALICH: bookingId, VAOLUC: now },
                update: { TRANGTHAI: 'CHO', VAOLUC: now, GOILUC: null } });
        } else if (input.action === 'call') {
            const result = await tx.hANGDOI.updateMany({ where: { MALICH: bookingId, TRANGTHAI: 'CHO' }, data: { TRANGTHAI: 'DA_GOI', GOILUC: now } });
            if (result.count !== 1) throw bookingError('Khách đã được gọi hoặc không còn chờ.', 409);
        } else if (input.action === 'assign') {
            if (!inQueue(booking)) throw bookingError('Khách không còn trong hàng đợi.', 409);
            const stylist = await staff(tx, input.staffId, booking.MACHINHANH);
            const end = new Date(now.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
            if (!workingHours(now, end)) throw bookingError('Không đủ thời gian phục vụ trong giờ mở cửa.');
            rejectConflicts(await conflicts(tx, booking.MACHINHANH, [stylist.MANV], now, end, bookingId, now));
            await tx.cHITIETLICHHEN.updateMany({ where: { MALICH: bookingId }, data: { MANV: stylist.MANV } });
            await tx.lICHHEN.update({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'Đang thực hiện', BATDAUTHUCTE: now, KETTHUCDUKIEN: end } });
            await tx.hANGDOI.update({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'DA_PHUC_VU' } });
        } else if (input.action === 'leave') {
            if (!inQueue(booking)) throw bookingError('Khách không còn trong hàng đợi.', 409);
            await tx.hANGDOI.update({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'DA_ROI' } });
            await tx.lICHHEN.update({ where: { MALICH: bookingId }, data: { TRANGTHAI: 'Đã huỷ', LYDOHUY: 'Khách rời hàng đợi' } });
        } else throw bookingError('Thao tác hàng đợi không hợp lệ.');
        return { message: { join: 'Đã đưa vào hàng đợi', call: 'Đã gọi khách', assign: 'Đã bắt đầu phục vụ', leave: 'Khách đã rời hàng đợi' }[input.action] };
    });
}

async function addService(db, bookingId, input, actor, now = new Date()) {
    return mutate(db, bookingId, actor, async (tx, booking) => {
        const selected = await service(tx, input.serviceId);
        if (booking.CHITIETLICHHEN.some(item => item.MADV === selected.MADV)) throw bookingError('Dịch vụ đã có trong lịch.');
        const stylist = await staff(tx, input.staffId, booking.MACHINHANH);
        const count = quantity(input.quantity);
        const running = booking.TRANGTHAI === 'Đang thực hiện';
        const start = running ? new Date(booking.BATDAUTHUCTE || appointmentStart(booking)) : appointmentStart(booking);
        const currentEnd = booking.KETTHUCDUKIEN ? new Date(booking.KETTHUCDUKIEN) : new Date(start.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
        const end = new Date(Math.max(currentEnd.getTime(), running ? now.getTime() : currentEnd.getTime()) + selected.THOIGIAN * count * MINUTE);
        if (!inQueue(booking)) {
            if (!workingHours(start, end)) throw bookingError('Dịch vụ phát sinh vượt giờ đóng cửa.');
            const staffIds = [...new Set([...booking.CHITIETLICHHEN.map(item => item.MANV).filter(Boolean), stylist.MANV])];
            rejectConflicts(await conflicts(tx, booking.MACHINHANH, staffIds, start, end, bookingId, now));
        }
        await tx.cHITIETLICHHEN.create({ data: { MALICH: bookingId, MADV: selected.MADV, MANV: stylist.MANV,
            SOLUONG: count, GIA_DUKIEN: Math.round(selected.GIADV * count), THOILUONG: selected.THOIGIAN, PHATSINH: true,
            GHICHU: input.note ? required(input.note, 'Ghi chú', 200) : '' } });
        if (!inQueue(booking)) await tx.lICHHEN.update({ where: { MALICH: bookingId }, data: { KETTHUCDUKIEN: end } });
        return { message: `Thêm dịch vụ ${selected.TENDV} × ${count}` };
    });
}

async function extend(db, bookingId, input, actor, now = new Date()) {
    return mutate(db, bookingId, actor, async (tx, booking) => {
        if (booking.TRANGTHAI !== 'Đang thực hiện') throw bookingError('Chỉ gia hạn lịch đang thực hiện.');
        const minutes = Number(input.minutes);
        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 240) throw bookingError('Số phút cần thêm từ 1 đến 240.');
        const end = new Date(Math.max(new Date(booking.KETTHUCDUKIEN || now).getTime(), now.getTime()) + minutes * MINUTE);
        const staffIds = booking.CHITIETLICHHEN.map(item => item.MANV).filter(Boolean);
        const affected = await conflicts(tx, booking.MACHINHANH, staffIds, now, end, bookingId, now);
        // Việc đang làm thực tế có thể kéo dài dù lịch sau bị ảnh hưởng.
        // Ghi nhận sự thật, trả cảnh báo; không tự ý dời lịch của khách khác.
        await tx.lICHHEN.update({ where: { MALICH: bookingId }, data: { KETTHUCDUKIEN: end } });
        return { message: `Cập nhật cần thêm ${minutes} phút`, conflicts: affected };
    });
}

async function reschedule(db, bookingId, input, actor, now = new Date()) {
    return mutate(db, bookingId, actor, async (tx, booking) => {
        if (booking.TRANGTHAI === 'Đang thực hiện') throw bookingError('Không đổi lịch đang thực hiện.');
        if (inQueue(booking)) throw bookingError('Hãy dùng Nhận phục vụ trong hàng đợi.');
        validateDate(input.date, now);
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time || '')) throw bookingError('Giờ không hợp lệ.');
        const start = new Date(`${input.date}T${input.time}:00+07:00`);
        const end = new Date(start.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
        if (start < now || !workingHours(start, end)) throw bookingError('Chọn giờ trong tương lai và trong giờ mở cửa.');
        if (booking.THOIGIANDEN && input.date !== localDate(now)) throw bookingError('Khách đã đến chỉ đổi giờ trong hôm nay; nếu về hãy hủy và tạo lịch mới.');
        const stylist = await staff(tx, input.staffId, booking.MACHINHANH);
        rejectConflicts(await conflicts(tx, booking.MACHINHANH, [stylist.MANV], start, end, bookingId, now));
        await tx.cHITIETLICHHEN.updateMany({ where: { MALICH: bookingId }, data: { MANV: stylist.MANV } });
        await tx.lICHHEN.update({ where: { MALICH: bookingId }, data: { NGAYHEN: new Date(`${input.date}T00:00:00Z`),
            GIOHEN: new Date(`1970-01-01T${input.time}:00Z`), KETTHUCDUKIEN: end } });
        return { message: `Đổi từ ${appointmentStart(booking).toISOString()} (${booking.CHITIETLICHHEN.map(d => d.MANV).join(', ')}) sang ${input.date} ${input.time}, stylist ${stylist.MANV}` };
    });
}

async function addLeave(db, input, actor, now = new Date()) {
    const branchId = required(input.branchId, 'Chi nhánh');
    // UI gửi ISO có offset; không diễn giải datetime-local theo múi giờ máy chủ.
    const start = new Date(input.start), end = new Date(input.end);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start || end <= now) throw bookingError('Khoảng nghỉ không hợp lệ.');
    return db.$transaction(async tx => {
        await lockBranch(tx, branchId);
        const stylist = await staff(tx, input.staffId, branchId);
        const resumeAt = new Date(end.getTime() + LEAVE_BUFFER_MS);
        const affected = await conflicts(tx, branchId, [stylist.MANV], start, resumeAt, '', now);
        if (affected.some(item => item.type === 'leave')) throw bookingError('Khoảng nghỉ bị trùng.', 409);
        const leave = await tx.lICHNGHI.create({ data: { ID: id('LN'), MANV: stylist.MANV, BATDAU: start, KETTHUC: end, LYDO: required(input.reason, 'Lý do', 200) } });
        for (const item of affected) await log(tx, item.id, actor, `Nhân viên ${stylist.MANV} nghỉ ${start.toISOString()} – ${end.toISOString()}: ${leave.LYDO}`);
        return { message: 'Đã ghi nhận nghỉ và 30 phút đệm sau giờ nghỉ. Kiểm tra các lịch bị ảnh hưởng.', leave, resumeAt, conflicts: affected };
    }, { isolationLevel: 'ReadCommitted' });
}

async function board(db, branchId, now = new Date()) {
    const branch = required(branchId, 'Chi nhánh');
    const bookings = await db.lICHHEN.findMany({ where: { MACHINHANH: branch, TRANGTHAI: { notIn: terminal } }, include });
    const stylists = await db.nHANVIEN.findMany({ where: { MACHINHANH: branch, CHUCVU: 'Stylist' }, select: { MANV: true, HOTEN: true } });
    const leaves = await db.lICHNGHI.findMany({ where: { NHANVIEN: { MACHINHANH: branch }, KETTHUC: { gt: new Date(now.getTime() - LEAVE_BUFFER_MS) } }, include: { NHANVIEN: { select: { HOTEN: true } } }, orderBy: { BATDAU: 'asc' } });
    const queue = bookings.filter(inQueue).sort((a, b) => new Date(a.HANGDOI.VAOLUC) - new Date(b.HANGDOI.VAOLUC) || a.MALICH.localeCompare(b.MALICH))
        .map(booking => {
            const end = new Date(now.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
            const available = stylists.filter(stylist => workingHours(now, end) &&
                !bookings.some(other => other.MALICH !== booking.MALICH && !inQueue(other) && other.CHITIETLICHHEN.some(d => d.MANV === stylist.MANV) && overlaps({ start: now, end }, interval(other, now))) &&
                !leaves.some(leave => leave.MANV === stylist.MANV && overlaps({ start: now, end }, leaveInterval(leave))));
            return { ...booking, available };
        });
    const warnings = [];
    for (const booking of bookings.filter(item => !inQueue(item))) {
        const span = interval(booking, now);
        const staffIds = booking.CHITIETLICHHEN.map(d => d.MANV);
        const expectedEnd = booking.KETTHUCDUKIEN ? new Date(booking.KETTHUCDUKIEN)
            : new Date(appointmentStart(booking).getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
        if (booking.TRANGTHAI === 'Đang thực hiện' && expectedEnd < now) {
            warnings.push({ id: booking.MALICH, message: 'Đã quá giờ kết thúc dự kiến. Cập nhật thời gian cần thêm.' });
        }
        for (const other of bookings) {
            if (other.MALICH <= booking.MALICH || inQueue(other)) continue;
            if (other.CHITIETLICHHEN.some(d => staffIds.includes(d.MANV)) && overlaps(span, interval(other, now))) {
                warnings.push({ id: booking.MALICH, relatedId: other.MALICH, message: `Trùng thời gian với ${other.MALICH}. Đổi thợ/giờ hoặc cho khách đã đến vào hàng đợi.` });
            }
        }
        for (const leave of leaves) if (staffIds.includes(leave.MANV) && overlaps(span, leaveInterval(leave))) {
            warnings.push({ id: booking.MALICH, message: `${leave.NHANVIEN.HOTEN} đang trong lịch nghỉ hoặc 30 phút đệm: ${leave.LYDO}. Cần sắp xếp lại lịch.` });
        }
    }
    return { queue, warnings, leaves: leaves.map(leave => ({ ...leave, resumeAt: leaveInterval(leave).end })), stylists, bookings, now };
}

async function draftInvoice(db, bookingId, actor) {
    return db.$transaction(async tx => {
        await tx.$queryRaw`SELECT MALICH FROM LICHHEN WHERE MALICH = ${bookingId} FOR UPDATE`;
        const booking = await tx.lICHHEN.findUnique({ where: { MALICH: bookingId }, include });
        if (!booking || booking.TRANGTHAI !== 'Hoàn thành') throw bookingError('Chỉ lập hóa đơn khi đã hoàn thành dịch vụ.', 409);
        const existing = await tx.hOADON.findFirst({ where: { MALICH: bookingId, OR: [{ TRANGTHAI: null }, { TRANGTHAI: { notIn: ['Đã huỷ', 'Đã hủy'] } }] } });
        if (existing) return { invoice: existing, message: `Lịch đã có hóa đơn ${existing.MAHD}. Xem trong trang Hóa đơn.` };
        if (!booking.CHITIETLICHHEN.length) throw bookingError('Lịch chưa có dịch vụ.');
        const details = booking.CHITIETLICHHEN.map(item => {
            const count = quantity(item.SOLUONG);
            const total = item.GIA_DUKIEN;
            if (!Number.isSafeInteger(total) || total < 0) throw bookingError('Dịch vụ thiếu giá đã chốt. Kiểm tra chi tiết lịch trước.');
            return { MADV: item.MADV, SOLUONG: count, DONGIA: Math.round(total / count), THANHTIEN: total };
        });
        const cashier = await tx.nHANVIEN.findUnique({ where: { MATK: actor } });
        const invoice = await tx.hOADON.create({ data: { MAHD: id('HD'), MAKH: booking.MAKH, MALICH: bookingId,
            MANV: cashier?.MANV || null, TONGTIEN: details.reduce((sum, item) => sum + item.THANHTIEN, 0), TRANGTHAI: 'Chưa thanh toán', NGAYTHANHTOAN: null,
            CHITIETHOADON: { create: details } } });
        await log(tx, bookingId, actor, `Lập hóa đơn ${invoice.MAHD}, gồm ${details.length} dịch vụ ban đầu và phát sinh`);
        return { invoice, message: `Đã lập hóa đơn ${invoice.MAHD}. Sang trang Hóa đơn để thu tiền.` };
    }, { isolationLevel: 'ReadCommitted' });
}

module.exports = { changeStatus, walkIn, queueAction, addService, extend, reschedule, addLeave, board, conflicts, draftInvoice };

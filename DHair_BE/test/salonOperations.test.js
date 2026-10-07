const test = require('node:test');
const assert = require('node:assert/strict');
const { appointmentStart, duration, interval, overlaps, workingHours, inQueue, leaveInterval } = require('../src/services/salonTime');
const { calculateSlots } = require('../src/services/bookingAvailability');
const now = new Date('2026-10-07T09:00:00+07:00');
const booking = (extra = {}) => ({ MALICH: 'LH1', NGAYHEN: new Date('2026-10-07T00:00:00Z'), GIOHEN: new Date('1970-01-01T09:00:00Z'),
    TRANGTHAI: 'Đã đặt', CHITIETLICHHEN: [{ MANV: 'NV1', THOILUONG: 30, SOLUONG: 1, DICHVU: { THOIGIAN: 90 } }], ...extra });

test('Giờ hẹn DATE/TIME ghép theo Việt Nam, không theo timezone máy chủ', () => {
    assert.equal(appointmentStart(booking()).toISOString(), '2026-10-07T02:00:00.000Z');
});
test('Đổi thời lượng trong danh mục không thay đổi dịch vụ đã chốt', () => {
    assert.equal(duration(booking().CHITIETLICHHEN), 30);
});
test('Phục vụ quá giờ chưa xong tiếp tục giữ stylist bận', () => {
    const row = booking({ TRANGTHAI: 'Đang thực hiện', KETTHUCDUKIEN: new Date('2026-10-07T09:30:00+07:00') });
    const after = new Date('2026-10-07T10:00:00+07:00');
    assert.ok(interval(row, after).end > new Date('2026-10-08T00:00:00Z'));
    assert.equal(calculateSlots('2026-10-07', 30, [row], 'NV1', after).length, 0);
});
test('Khách trong hàng đợi không chiếm slot của stylist cũ', () => {
    const row = booking({ HANGDOI: { TRANGTHAI: 'CHO' } });
    assert.equal(inQueue(row), true);
    assert.ok(calculateSlots('2026-10-07', 30, [row], 'NV1', new Date('2026-10-07T08:00:00+07:00')).some(s => s.time === '09:00'));
});
test('Hai lịch tiếp giáp không bị coi là xung đột', () => {
    const a = { start: now, end: new Date(now.getTime() + 30 * 60000) };
    assert.equal(overlaps(a, { start: a.end, end: new Date(a.end.getTime() + 60000) }), false);
});
test('Nghỉ 11:00–12:30: chặn đến trước 13:00, không sửa giờ nghỉ gốc', () => {
    const leave = { BATDAU: new Date('2026-10-07T11:00:00+07:00'), KETTHUC: new Date('2026-10-07T12:30:00+07:00') };
    const span = leaveInterval(leave);
    assert.equal(span.end.toISOString(), '2026-10-07T06:00:00.000Z');
    assert.equal(overlaps(span, { start: new Date('2026-10-07T12:59:59+07:00'), end: new Date('2026-10-07T13:30:00+07:00') }), true);
    assert.equal(overlaps(span, { start: span.end, end: new Date('2026-10-07T13:30:00+07:00') }), false);
    assert.equal(leave.KETTHUC.toISOString(), '2026-10-07T05:30:00.000Z');
});
test('Không nhận làm sớm trước giờ mở cửa hoặc kết thúc quá 22 giờ', () => {
    assert.equal(workingHours(new Date('2026-10-07T07:59:00+07:00'), now), false);
    assert.equal(workingHours(new Date('2026-10-07T21:30:00+07:00'), new Date('2026-10-07T22:01:00+07:00')), false);
});

// Chạy rõ ràng với RUN_SALON_DB_TESTS=1. Toàn bộ fixture nằm trong transaction
// và luôn rollback, không tạo dữ liệu demo tồn tại trong database của người dùng.
test('MySQL: tiếp nhận → hàng đợi → phát sinh/xung đột → nghỉ → đổi lịch → hóa đơn', { skip: process.env.RUN_SALON_DB_TESTS !== '1' }, async () => {
    require('dotenv').config({ quiet: true });
    const { PrismaClient } = require('@prisma/client');
    const { randomUUID } = require('node:crypto');
    const ops = require('../src/services/salonOperationsService');
    const prisma = new PrismaClient();
    const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
    const branchId = `TC${suffix}`, staffId = `TN${suffix}`, otherStaff = `TO${suffix}`, serviceId = `TD${suffix}`, extraId = `TE${suffix}`, actor = `TT${suffix}`;
    const rollback = new Error('ROLLBACK_FIXTURE');
    let assertions = 0;
    try {
        await prisma.$transaction(async tx => {
            // Chuyển các transaction nghiệp vụ vào transaction kiểm thử bên ngoài.
            const db = new Proxy(tx, { get(target, key) { return key === '$transaction' ? async fn => fn(tx) : target[key]; } });
            await tx.cHINHANH.create({ data: { MACHINHANH: branchId, TENCHINHANH: 'TEST ROLLBACK', SDT: `8${Date.now().toString().slice(-9)}` } });
            for (const MANV of [staffId, otherStaff]) await tx.nHANVIEN.create({ data: { MANV, HOTEN: 'TEST STYLIST', CHUCVU: 'Stylist', MACHINHANH: branchId } });
            for (const [MADV, THOIGIAN, GIADV] of [[serviceId, 30, 100000], [extraId, 20, 50000]]) {
                await tx.dICHVU.create({ data: { MADV, TENDV: 'TEST SERVICE', LOAI: 'TEST', THOIGIAN, GIADV, TRANGTHAI: 'Đang cung cấp' } });
            }
            // Dùng khách có ID riêng, không tra cứu trùng số điện thoại khách thật.
            const customer = await tx.kHACHHANG.create({ data: { MAKH: `TK${suffix}`, HOTEN: 'TEST CUSTOMER', SDT: `7${Date.now().toString().slice(-9)}` } });
            const input = { branchId, staffId, serviceId, customerId: customer.MAKH };
            const first = (await ops.walkIn(db, input, actor, now)).booking;
            assert.equal(first.TRANGTHAI, 'Đang thực hiện'); assertions++;
            const waiting = (await ops.walkIn(db, input, actor, new Date(now.getTime() + 5 * 60000))).booking;
            assert.equal(waiting.TRANGTHAI, 'Đã đến'); assertions++;
            const nextId = `TL${suffix}`;
            await tx.lICHHEN.create({ data: { MALICH: nextId, MAKH: customer.MAKH, MACHINHANH: branchId,
                NGAYHEN: new Date('2026-10-07T00:00:00Z'), GIOHEN: new Date('1970-01-01T09:30:00Z'), TRANGTHAI: 'Đã đặt',
                CHITIETLICHHEN: { create: { MADV: serviceId, MANV: staffId, SOLUONG: 1, THOILUONG: 30, GIA_DUKIEN: 100000 } } } });
            await assert.rejects(ops.addService(db, first.MALICH, { staffId, serviceId: extraId }, actor, now), e => e.status === 409); assertions++;
            assert.equal(await tx.cHITIETLICHHEN.count({ where: { MALICH: first.MALICH } }), 1); assertions++;
            const extended = await ops.extend(db, first.MALICH, { minutes: 10 }, actor, now);
            assert.ok(extended.conflicts.some(item => item.id === nextId)); assertions++;
            const leave = await ops.addLeave(db, { branchId, staffId: otherStaff, start: '2026-10-07T09:00:00+07:00', end: '2026-10-07T10:00:00+07:00', reason: 'TEST' }, actor, now);
            assert.ok(leave.leave.ID); assertions++;
            await assert.rejects(ops.reschedule(db, nextId, { staffId: otherStaff, date: '2026-10-07', time: '09:30' }, actor, now), e => e.status === 409); assertions++;
            await assert.rejects(ops.reschedule(db, nextId, { staffId: otherStaff, date: '2026-10-07', time: '10:00' }, actor, now), e => e.status === 409);
            await ops.reschedule(db, nextId, { staffId: otherStaff, date: '2026-10-07', time: '10:30' }, actor, now);
            await ops.addService(db, first.MALICH, { staffId, serviceId: extraId }, actor, now);
            const details = await tx.cHITIETLICHHEN.findMany({ where: { MALICH: first.MALICH } });
            assert.equal(details.length, 2); assert.equal(details.find(d => d.MADV === extraId).PHATSINH, true); assertions += 2;
            await ops.changeStatus(db, first.MALICH, 'Hoàn thành', actor, '', new Date('2026-10-07T09:45:00+07:00'));
            const draft = await ops.draftInvoice(db, first.MALICH, actor);
            assert.equal(draft.invoice.TONGTIEN, 150000); assertions++;
            const repeated = await ops.draftInvoice(db, first.MALICH, actor);
            assert.equal(repeated.invoice.MAHD, draft.invoice.MAHD); assertions++;
            // Kiểm tra tiếp bước thu tiền qua workflow mà API hóa đơn sử dụng.
            const invoices = require('../src/services/invoiceWorkflow');
            const cashierId = `TCG${suffix}`, promotionId = `TP${suffix}`, expiredId = `TX${suffix}`;
            await tx.nHANVIEN.create({ data: { MANV: cashierId, HOTEN: 'TEST CASHIER', CHUCVU: 'Thu ngân', MACHINHANH: branchId } });
            await tx.kHUYENMAI.create({ data: { MAKM: promotionId, TENKM: 'TEST 10%', TRANGTHAI: 'Đang áp dụng', GIATRI: 10,
                NGAYBD: new Date('2026-10-01T00:00:00Z'), NGAYKT: new Date('2026-10-07T00:00:00Z') } });
            await tx.kHUYENMAI.create({ data: { MAKM: expiredId, TENKM: 'TEST EXPIRED', TRANGTHAI: 'Đang áp dụng', GIATRI: 10,
                NGAYKT: new Date('2026-10-06T00:00:00Z') } });
            assert.equal(draft.invoice.NGAYTHANHTOAN, null);
            await assert.rejects(invoices.create(db, { MALICH: first.MALICH }, [], now), e => e.status === 409);
            await assert.rejects(invoices.create(db, { MALICH: nextId }, [], now), e => e.status === 409);
            await assert.rejects(invoices.addDetail(db, { MAHD: draft.invoice.MAHD, MADV: extraId, SOLUONG: 1 }, now), e => e.status === 409);
            const payment = { TRANGTHAI: 'Đã thanh toán', MANV: cashierId, MAKM: promotionId, HINHTHUCTHANHTOAN: 'Tiền mặt', TONGTIEN: 1, NGAYTT: '' };
            await assert.rejects(invoices.update(db, draft.invoice.MAHD, { ...payment, MAKM: expiredId }, now), e => e.status === 400);
            assert.equal((await tx.hOADON.findUnique({ where: { MAHD: draft.invoice.MAHD } })).TRANGTHAI, 'Chưa thanh toán');
            await assert.rejects(invoices.update(db, draft.invoice.MAHD, { ...payment, MANV: staffId }, now), e => e.status === 400);
            const paid = await invoices.update(db, draft.invoice.MAHD, payment, now);
            assert.equal(paid.TONGTIEN, 135000);
            assert.equal(paid.NGAYTHANHTOAN.toISOString(), now.toISOString());
            assert.equal(await tx.cHITIETHOADON.count({ where: { MAHD: paid.MAHD } }), 2);
            await assert.rejects(invoices.update(db, paid.MAHD, { TRANGTHAI: 'Đã huỷ' }, now), e => e.status === 409);
            await assert.rejects(invoices.update(db, paid.MAHD, payment, now), e => e.status === 409);
            await assert.rejects(invoices.remove(db, paid.MAHD), e => e.status === 409);
            const standalone = await invoices.create(db, { MAKH: customer.MAKH, MAKM: promotionId, TONGTIEN: 1, NGAYTT: '' },
                [{ MADV: serviceId, SOLUONG: 1, DONGIA: 1, THANHTIEN: 1 }], now);
            assert.equal(standalone.TONGTIEN, 90000);
            assert.equal(standalone.NGAYTHANHTOAN, null);
            await invoices.addDetail(db, { MAHD: standalone.MAHD, MADV: extraId, SOLUONG: 2, DONGIA: 1, THANHTIEN: 1 }, now);
            assert.equal((await tx.hOADON.findUnique({ where: { MAHD: standalone.MAHD } })).TONGTIEN, 180000);
            await invoices.update(db, standalone.MAHD, { TRANGTHAI: 'Đã huỷ', MAKM: expiredId }, now);
            await invoices.remove(db, standalone.MAHD);
            assert.equal(await tx.hOADON.findUnique({ where: { MAHD: standalone.MAHD } }), null);
            const quantityBookingId = `TQ${suffix}`;
            await tx.lICHHEN.create({ data: { MALICH: quantityBookingId, MAKH: customer.MAKH, MACHINHANH: branchId,
                NGAYHEN: new Date('2026-10-07T00:00:00Z'), GIOHEN: new Date('1970-01-01T15:00:00Z'), TRANGTHAI: 'Đang thực hiện',
                CHITIETLICHHEN: { create: { MADV: serviceId, MANV: staffId, SOLUONG: 2, GIA_DUKIEN: 200000, THOILUONG: 30 } } } });
            await tx.lICHHEN.update({ where: { MALICH: quantityBookingId }, data: { TRANGTHAI: 'Hoàn thành' } });
            const automatic = await tx.hOADON.findFirst({ where: { MALICH: quantityBookingId }, include: { CHITIETHOADON: true } });
            assert.equal(automatic.TONGTIEN, 200000); // Không thành 400000 khi số lượng = 2.
            assert.equal(automatic.NGAYTHANHTOAN, null);
            assert.equal(automatic.CHITIETHOADON[0].DONGIA, 100000);
            await ops.queueAction(db, waiting.MALICH, { action: 'call' }, actor, now);
            await assert.rejects(ops.queueAction(db, waiting.MALICH, { action: 'call' }, actor, now), e => e.status === 409); assertions++;
            const current = new Date('2026-10-07T09:45:00+07:00');
            const board = await ops.board(db, branchId, current);
            assert.ok(board.queue[0].available.some(s => s.MANV === staffId)); assertions++;
            const bufferTime = new Date('2026-10-07T10:00:00+07:00');
            const bufferBoard = await ops.board(db, branchId, bufferTime);
            assert.ok(bufferBoard.leaves.some(l => l.ID === leave.leave.ID));
            assert.ok(!bufferBoard.queue[0].available.some(s => s.MANV === otherStaff));
            await assert.rejects(ops.queueAction(db, waiting.MALICH, { action: 'assign', staffId: otherStaff }, actor, bufferTime), e => e.status === 409);
            await ops.queueAction(db, waiting.MALICH, { action: 'assign', staffId }, actor, current);
            await assert.rejects(ops.queueAction(db, waiting.MALICH, { action: 'assign', staffId }, actor, current), e => e.status === 409); assertions++;
            assert.equal((await ops.board(db, branchId, current)).queue.length, 0); assertions++;
            assert.ok(await tx.lICHSULICH.count({ where: { MALICH: first.MALICH } }) >= 4); assertions++;
            // Đến sớm được ghi nhận, nhưng chưa được bắt đầu nếu thợ đang nghỉ.
            await ops.changeStatus(db, nextId, 'Đã đến', actor, '', new Date('2026-10-07T09:50:00+07:00'));
            await assert.rejects(ops.changeStatus(db, nextId, 'Đang thực hiện', actor, '', new Date('2026-10-07T09:50:00+07:00')), e => e.status === 409); assertions++;
            await assert.rejects(ops.changeStatus(db, nextId, 'Đang thực hiện', actor, '', new Date('2026-10-07T10:00:00+07:00')), e => e.status === 409);
            await ops.changeStatus(db, nextId, 'Đang thực hiện', actor, '', new Date('2026-10-07T10:30:00+07:00'));
            assert.equal((await tx.lICHHEN.findUnique({ where: { MALICH: nextId } })).THOIGIANDEN.toISOString(), '2026-10-07T02:50:00.000Z'); assertions++;
            // Đúng 10 phút vẫn nhận; quá 10 phút thì yêu cầu tạo lượt mới.
            for (const [label, second, accepted] of [['exact', 0, true], ['late', 1, false]]) {
                const lateId = `T${label}${suffix}`.slice(0, 20);
                await tx.lICHHEN.create({ data: { MALICH: lateId, MAKH: customer.MAKH, MACHINHANH: branchId,
                    NGAYHEN: new Date('2026-10-07T00:00:00Z'), GIOHEN: new Date('1970-01-01T11:00:00Z'), TRANGTHAI: 'Đã đặt' } });
                const operation = ops.changeStatus(db, lateId, 'Đã đến', actor, '', new Date(`2026-10-07T11:10:0${second}+07:00`));
                if (accepted) assert.equal((await operation).booking.TRANGTHAI, 'Đã đến');
                else await assert.rejects(operation, e => e.status === 409);
                assertions++;
            }
            throw rollback;
        }, { timeout: 30000 });
    } catch (error) { if (error !== rollback) throw error; }
    finally { await prisma.$disconnect(); }
    assert.equal(assertions, 20);
});

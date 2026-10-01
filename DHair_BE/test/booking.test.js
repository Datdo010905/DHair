const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateSlots, getDateWindow, validateDate } = require('../src/services/bookingAvailability');
const { getAvailability, createBooking, getOptions } = require('../src/services/bookingService');

const now = new Date('2026-10-01T00:00:00Z'); // 07:00 Việt Nam
const date = '2026-10-02';
function existingBooking(time, durations = [90], status = 'Đã đặt') {
    return {
        GIOHEN: `1970-01-01T${time}:00.000Z`, TRANGTHAI: status,
        CHITIETLICHHEN: durations.map(minutes => ({ MANV: 'NV01 ', SOLUONG: 1, DICHVU: { THOIGIAN: minutes } })),
    };
}
function slots(duration, bookings = [], day = date, clock = now) {
    return calculateSlots(day, duration, bookings, 'NV01', clock).map(slot => slot.time);
}

test('Loại cả giờ nằm giữa và giờ bắt đầu trước lịch bận nhưng kéo dài vào lịch đó', () => {
    const result = slots(60, [existingBooking('10:00')]);
    assert.ok(result.includes('09:00'));
    for (const time of ['09:30', '10:00', '10:30', '11:00']) assert.ok(!result.includes(time));
    assert.ok(result.includes('11:30'));
});

test('Cộng thời lượng nhiều dịch vụ và nhân số lượng của đúng stylist', () => {
    const booking = existingBooking('10:00', [30, 45]);
    booking.CHITIETLICHHEN[0].SOLUONG = 2;
    booking.CHITIETLICHHEN.push({ MANV: 'NV02', SOLUONG: 1, DICHVU: { THOIGIAN: 180 } });
    const result = slots(30, [booking]);
    assert.ok(!result.includes('11:30'));
    assert.ok(result.includes('12:00'));
});

test('Lịch bao trọn khoảng bận bị loại; lịch kết thúc đúng lúc bắt đầu lịch bận được giữ', () => {
    const result = slots(180, [existingBooking('10:00', [30])]);
    assert.ok(!result.includes('08:00'));
    assert.ok(result.includes('10:30'));
});

test('Lịch hủy giải phóng giờ với cả hai cách viết dấu', () => {
    assert.ok(slots(30, [existingBooking('10:00', [90], 'Đã huỷ ')]).includes('10:00'));
    assert.ok(slots(30, [existingBooking('10:00', [90], 'Đã hủy')]).includes('10:00'));
    assert.ok(!slots(30, [existingBooking('10:00', [90], 'Đã hoàn thành')]).includes('10:00'));
});

test('Không cho phép dịch vụ kết thúc sau 22:00', () => {
    assert.equal(slots(90).at(-1), '20:30');
    assert.equal(slots(45).at(-1), '21:00');
    assert.deepEqual(slots(900), []);
});

test('Không cho đặt giờ đã qua hoặc đúng giờ hiện tại trong ngày', () => {
    const result = slots(30, [], '2026-10-01', new Date('2026-10-01T03:00:00Z'));
    assert.equal(result[0], '10:30');
});

test('Giới hạn từ hôm nay đến ngày thứ tư theo giờ Việt Nam và qua tháng', () => {
    const clock = new Date('2026-10-31T18:00:00Z');
    assert.deepEqual(getDateWindow(clock), { today: '2026-11-01', lastDay: '2026-11-05' });
    validateDate('2026-11-05', clock);
    assert.throws(() => validateDate('2026-11-06', clock));
    assert.throws(() => validateDate('2026-10-31', clock));
    assert.throws(() => validateDate('2026-02-30', now));
    assert.throws(() => validateDate(undefined, now));
});

test('Không mở giờ khi thời lượng mới hoặc dữ liệu lịch cũ không hợp lệ', () => {
    assert.throws(() => slots(0));
    assert.throws(() => slots(30, [existingBooking('10:00', [0])]));
    assert.throws(() => slots(30, [existingBooking('bad', [30])]));
});

function fakeDatabase() {
    const calls = [];
    const db = {
        cHINHANH: { findMany: async () => [{ MACHINHANH: 'CN01' }] },
        nHANVIEN: {
            findUnique: async () => ({ MANV: 'NV01', MACHINHANH: 'CN01 ', CHUCVU: 'Stylist ' }),
            findMany: async () => [{ MANV: 'NV01', CHUCVU: 'Stylist ' }, { MANV: 'NV02', CHUCVU: 'Quản lý' }],
        },
        dICHVU: { findUnique: async () => ({ THOIGIAN: 90, GIADV: 100000, TRANGTHAI: 'Đang cung cấp ' }) },
        lICHHEN: {
            findMany: async query => { calls.push(['schedule', query]); return []; },
            create: async ({ data }) => { calls.push(['booking', data]); return data; },
        },
        cHITIETLICHHEN: { create: async ({ data }) => { calls.push(['detail', data]); return data; } },
        kHACHHANG: { findUnique: async query => { calls.push(['customer', query]); return { MAKH: 'KH01' }; } },
        $queryRaw: async () => { calls.push(['lock']); },
        $transaction: async (callback, options) => { calls.push(['transaction', options]); return callback(db); },
    };
    return { db, calls };
}
function input() {
    return {
        branchId: 'CN01', staffId: 'NV01', serviceId: 'DV01',
        date: getDateWindow().lastDay, time: '10:00', accountId: 'TK01', note: 'Cắt ngắn',
    };
}

test('Danh sách stylist chỉ chứa nhân viên đúng vai trò', async () => {
    const { db } = fakeDatabase();
    const result = await getOptions(db, 'CN01');
    assert.equal(result.stylists.length, 1);
    assert.equal(result.stylists[0].MANV, 'NV01');
});

test('Backend từ chối nhân viên khác chi nhánh, dịch vụ ngừng cung cấp và số lượng sai', async () => {
    const { db } = fakeDatabase();
    await assert.rejects(getAvailability(db, { ...input(), branchId: 'CN02' }), /chi nhánh/);
    await assert.rejects(getAvailability(db, { ...input(), quantity: 0 }), /Số lượng/);
    db.dICHVU.findUnique = async () => ({ TRANGTHAI: 'Ngừng cung cấp' });
    await assert.rejects(getAvailability(db, input()), /không được cung cấp/);
});

test('Lưu đúng khách hàng theo tài khoản, giá server và khóa trước khi đọc lịch', async () => {
    const { db, calls } = fakeDatabase();
    const result = await createBooking(db, { ...input(), price: 1 });
    assert.equal(result.MAKH, 'KH01');
    assert.equal(result.MALICH.length, 20);
    assert.equal(result.GIOHEN.toISOString(), '1970-01-01T10:00:00.000Z');
    assert.ok(calls.findIndex(call => call[0] === 'lock') < calls.findIndex(call => call[0] === 'schedule'));
    assert.deepEqual(calls.find(call => call[0] === 'customer')[1], { where: { MATK: 'TK01' } });
    assert.equal(calls.find(call => call[0] === 'detail')[1].GIA_DUKIEN, 100000);
    assert.equal(calls[0][1].isolationLevel, 'ReadCommitted');
});

test('Lịch vừa bị chiếm trả 409 và không ghi dữ liệu', async () => {
    const { db, calls } = fakeDatabase();
    db.lICHHEN.findMany = async () => [existingBooking('10:00')];
    await assert.rejects(createBooking(db, input()), error => error.status === 409);
    assert.ok(!calls.some(call => call[0] === 'booking' || call[0] === 'detail'));
});

test('Ghi chú vượt giới hạn database bị từ chối trước khi ghi', async () => {
    const { db, calls } = fakeDatabase();
    await assert.rejects(createBooking(db, { ...input(), note: 'x'.repeat(201) }), /200/);
    assert.equal(calls.length, 0);
});

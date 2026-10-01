const test = require('node:test');
const assert = require('node:assert/strict');
const { getHistory, cancelBooking, formatAppointment } = require('../src/services/bookingHistoryService');

function sampleBooking(status = 'Đã đặt') {
    return {
        MALICH: 'LH01', MAKH: 'KH01', TRANGTHAI: status,
        NGAYHEN: new Date('2026-10-04T00:00:00Z'), GIOHEN: new Date('1970-01-01T09:30:00Z'),
        CHINHANH: { TENCHINHANH: 'Salon A ', DIACHI: 'Địa chỉ A' },
        CHITIETLICHHEN: [
            { MADV: 'DV01', SOLUONG: 2, GIA_DUKIEN: 200000, GHICHU: 'Ghi chú cũ', DICHVU: { TENDV: 'Cắt tóc', THOIGIAN: 30 }, NHANVIEN: { HOTEN: 'Stylist A' } },
            { MADV: 'DV02', SOLUONG: 1, GIA_DUKIEN: 50000, GHICHU: 'Ghi chú khác', DICHVU: { TENDV: 'Gội đầu', THOIGIAN: 15 }, NHANVIEN: null },
        ],
    };
}

// Database giả để kiểm tra điều kiện truy vấn và việc hoàn tác khi một bước lỗi.
function fakeDatabase(status = 'Đã đặt') {
    let booking = sampleBooking(status);
    const calls = [];
    const matches = where => Object.entries(where).every(([key, value]) => booking[key] === value);
    const db = {
        kHACHHANG: { findUnique: async ({ where }) => where.MATK === 'TK01' ? { MAKH: 'KH01' } : { MAKH: 'KH02' } },
        lICHHEN: {
            findMany: async query => { calls.push(query); return matches(query.where) ? [booking] : []; },
            findFirst: async ({ where }) => matches(where) ? booking : null,
            updateMany: async ({ where, data }) => {
                if (!matches(where)) return { count: 0 };
                Object.assign(booking, data);
                return { count: 1 };
            },
        },
        cHITIETLICHHEN: {
            updateMany: async ({ where, data }) => {
                assert.equal(where.MALICH, booking.MALICH);
                booking.CHITIETLICHHEN.forEach(detail => Object.assign(detail, data));
                return { count: booking.CHITIETLICHHEN.length };
            },
        },
        $transaction: async callback => {
            const snapshot = structuredClone(booking);
            try { return await callback(db); }
            catch (error) { booking = snapshot; throw error; }
        },
    };
    return { db, calls, current: () => booking };
}

test('Lịch sử giới hạn theo khách hàng liên kết tài khoản và sắp xếp ngày giờ giảm dần', async () => {
    const { db, calls } = fakeDatabase();
    const result = await getHistory(db, 'TK01');
    assert.equal(result.appointments.length, 1);
    assert.deepEqual(calls[0].where, { MAKH: 'KH01' });
    assert.deepEqual(calls[0].orderBy.slice(0, 2), [{ NGAYHEN: 'desc' }, { GIOHEN: 'desc' }]);
    assert.ok(result.cancellationReasons.includes('Khác'));
    assert.deepEqual((await getHistory(db, 'TK02')).appointments, []);
});

test('Dữ liệu lịch giữ đúng giờ MySQL, cộng giá một lần và hiển thị đủ chi tiết', () => {
    const result = formatAppointment(sampleBooking());
    assert.equal(result.time, '09:30');
    assert.equal(result.date, '2026-10-04');
    assert.equal(result.duration, 75);
    assert.equal(result.price, 250000);
    assert.equal(result.details.length, 2);
    assert.equal(result.details[1].stylist, 'Chưa phân công');
    assert.equal(formatAppointment(sampleBooking('Đã hủy ')).status, 'Đã huỷ');
    assert.equal(formatAppointment(sampleBooking('Đã hoàn thành')).status, 'Hoàn thành');
});

test('Hủy lịch Đã đặt ghi đè ghi chú tất cả dịch vụ và đổi trạng thái', async () => {
    const { db, current } = fakeDatabase();
    const result = await cancelBooking(db, 'TK01', 'LH01', { reason: 'Đặt nhầm lịch' });
    assert.equal(result.status, 'Đã huỷ');
    assert.ok(result.details.every(detail => detail.note === 'Đặt nhầm lịch'));
    assert.equal(current().TRANGTHAI, 'Đã huỷ');
});

test('Từ chối hủy lịch không thuộc tài khoản đăng nhập', async () => {
    const { db, current } = fakeDatabase();
    await assert.rejects(cancelBooking(db, 'TK02', 'LH01', { reason: 'Đặt nhầm lịch' }), error => error.status === 404);
    assert.equal(current().TRANGTHAI, 'Đã đặt');
    assert.equal(current().CHITIETLICHHEN[0].GHICHU, 'Ghi chú cũ');
});

test('Không hủy các trạng thái khác Đã đặt, kể cả yêu cầu gửi lần hai', async () => {
    for (const status of ['Đang chờ', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ']) {
        const { db, current } = fakeDatabase(status);
        await assert.rejects(cancelBooking(db, 'TK01', 'LH01', { reason: 'Đặt nhầm lịch' }), error => error.status === 409);
        assert.equal(current().TRANGTHAI, status);
        assert.equal(current().CHITIETLICHHEN[0].GHICHU, 'Ghi chú cũ');
    }
});

test('Lý do phải thuộc danh sách, Khác phải có nội dung và không quá 200 ký tự', async () => {
    const { db } = fakeDatabase();
    for (const input of [{}, { reason: 'Không hợp lệ' }, { reason: 'Khác', otherReason: '  ' }, { reason: 'Khác', otherReason: 'x'.repeat(195) }]) {
        await assert.rejects(cancelBooking(db, 'TK01', 'LH01', input), error => error.status === 400);
    }
    const result = await cancelBooking(db, 'TK01', 'LH01', { reason: 'Khác', otherReason: ' Tôi có việc gia đình ' });
    assert.equal(result.details[0].note, 'Khác: Tôi có việc gia đình');
});

test('Lỗi ghi ghi chú hoàn tác thay đổi trạng thái', async () => {
    const { db, current } = fakeDatabase();
    db.cHITIETLICHHEN.updateMany = async () => { throw new Error('Database error'); };
    await assert.rejects(cancelBooking(db, 'TK01', 'LH01', { reason: 'Đặt nhầm lịch' }));
    assert.equal(current().TRANGTHAI, 'Đã đặt');
});

test('Lịch thiếu chi tiết không bị hủy mà mất lý do', async () => {
    const { db, current } = fakeDatabase();
    current().CHITIETLICHHEN = [];
    await assert.rejects(cancelBooking(db, 'TK01', 'LH01', { reason: 'Đặt nhầm lịch' }), error => error.status === 409);
    assert.equal(current().TRANGTHAI, 'Đã đặt');
});

test('Lịch đã đổi trạng thái ngay trước UPDATE không bị hủy', async () => {
    const { db, current } = fakeDatabase();
    const update = db.lICHHEN.updateMany;
    db.lICHHEN.updateMany = async args => {
        current().TRANGTHAI = 'Đang chờ';
        return update(args);
    };
    await assert.rejects(cancelBooking(db, 'TK01', 'LH01', { reason: 'Đặt nhầm lịch' }), error => error.status === 409);
    assert.equal(current().CHITIETLICHHEN[0].GHICHU, 'Ghi chú cũ');
});

test('API lịch sử và hủy lấy danh tính từ token hợp lệ, từ chối token thiếu/sai/hết hạn', () => {
    const jwt = require('jsonwebtoken');
    const { requireCustomerSession } = require('../src/controllers/bookingController');
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'history-unit-test-secret';
    try {
        const token = jwt.sign({ MaTK: 'TK01 ', PhanQuyen: 0 }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const req = { headers: { authorization: `Bearer ${token}` }, body: { accountId: 'TK02' } };
        let nextCalled = false;
        requireCustomerSession(req, {}, () => { nextCalled = true; });
        assert.equal(nextCalled, true);
        assert.equal(req.bookingAccountId, 'TK01');

        const expired = jwt.sign({ MaTK: 'TK01' }, process.env.JWT_SECRET, { expiresIn: -1 });
        const forged = jwt.sign({ MaTK: 'TK01' }, 'different-test-secret');
        for (const authorization of ['', 'Bearer invalid', `Bearer ${expired}`, `Bearer ${forged}`]) {
            let responseStatus;
            const res = { status(code) { responseStatus = code; return this; }, json() { return this; } };
            requireCustomerSession({ headers: { authorization } }, res, () => assert.fail('Không được chấp nhận token này'));
            assert.equal(responseStatus, 401);
        }
    } finally {
        if (previousSecret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previousSecret;
    }
});

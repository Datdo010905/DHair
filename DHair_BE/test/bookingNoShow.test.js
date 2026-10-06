const test = require('node:test');
const assert = require('node:assert/strict');
const { cancelOverdueBookings } = require('../src/services/bookingNoShowService');
const { startBookingNoShowJob } = require('../src/jobs/bookingNoShowJob');

function booking(id, time, status = 'Đã đặt', date = '2026-10-06') {
    return { MALICH: id, NGAYHEN: new Date(`${date}T00:00:00Z`), GIOHEN: new Date(`1970-01-01T${time}Z`), TRANGTHAI: status };
}

function fakeDatabase(rows, beforeUpdate = () => {}) {
    return { $executeRaw: async (sql, cutoff) => {
        assert.match(sql.join('?'), /TIMESTAMP\(NGAYHEN, GIOHEN\) < \?/);
        assert.match(sql.join('?'), /WHERE TRANGTHAI IN \('Đã đặt', 'Đang chờ'\)/);
        beforeUpdate();
        let count = 0;
        for (const row of rows) {
            const appointment = `${row.NGAYHEN.toISOString().slice(0, 10)} ${row.GIOHEN.toISOString().slice(11, -1)}`;
            if (['Đã đặt', 'Đang chờ'].includes(row.TRANGTHAI) && appointment < cutoff) {
                row.TRANGTHAI = 'Đã huỷ';
                count++;
            }
        }
        return count;
    } };
}

test('Quá 10 phút mới hủy; đúng 10 phút, chưa đến giờ và lịch ngày mai giữ nguyên', async () => {
    const rows = [booking('late', '08:59:59'), booking('exact', '09:00:00'), booking('early', '09:00:01'), booking('tomorrow', '08:00:00', 'Đã đặt', '2026-10-07')];
    assert.deepEqual(await cancelOverdueBookings(fakeDatabase(rows), new Date('2026-10-06T09:10:00+07:00')), { count: 1 });
    assert.deepEqual(rows.map(row => row.TRANGTHAI), ['Đã huỷ', 'Đã đặt', 'Đã đặt', 'Đã đặt']);
});

test('Chỉ hủy Đã đặt/Đang chờ; không hủy khách đã đến hoặc đang làm', async () => {
    const states = ['Đã đặt', 'Đang chờ', 'Đã đến', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ'];
    const rows = states.map((status, index) => booking(String(index), '08:00:00', status));
    const db = fakeDatabase(rows);
    const now = new Date('2026-10-06T09:00:00+07:00');
    assert.equal((await cancelOverdueBookings(db, now)).count, 2);
    assert.deepEqual(rows.slice(2).map(row => row.TRANGTHAI), states.slice(2));
    assert.equal((await cancelOverdueBookings(db, now)).count, 0);
});

test('Mốc giờ Việt Nam đúng khi qua nửa đêm và chuyển tháng', async () => {
    const rows = [booking('late', '23:54:59', 'Đang chờ', '2026-09-30'), booking('exact', '23:55:00', 'Đã đặt', '2026-09-30'), booking('today', '00:00:00', 'Đã đặt', '2026-10-01')];
    // 17:05 UTC là 00:05 ngày kế tiếp tại Việt Nam.
    assert.equal((await cancelOverdueBookings(fakeDatabase(rows), new Date('2026-09-30T17:05:00Z'))).count, 1);
    assert.equal(rows[1].TRANGTHAI, 'Đã đặt');
    assert.equal(rows[2].TRANGTHAI, 'Đã đặt');
});

test('Xử lý lịch cũ bị bỏ lỡ khi server tắt, không đụng ghi chú', async () => {
    const row = { ...booking('old', '09:00:00', 'Đã đặt', '2026-10-01'), GHICHU: 'Ghi chú khách hàng' };
    await cancelOverdueBookings(fakeDatabase([row]), new Date('2026-10-06T09:00:00+07:00'));
    assert.equal(row.TRANGTHAI, 'Đã huỷ');
    assert.equal(row.GHICHU, 'Ghi chú khách hàng');
});

test('Nhân viên xác nhận đã đến ngay trước UPDATE thì không bị ghi đè', async () => {
    const row = booking('arrived', '08:00:00');
    const db = fakeDatabase([row], () => { row.TRANGTHAI = 'Đã đến'; });
    assert.equal((await cancelOverdueBookings(db, new Date('2026-10-06T09:00:00+07:00'))).count, 0);
});

test('Tác vụ chạy ngay lúc khởi động, lỗi DB được bắt và có thể dừng', async () => {
    let calls = 0;
    const errors = [];
    const stop = startBookingNoShowJob({ $executeRaw: async () => { calls++; throw new Error('test database failure'); } }, {
        logger: { info() {}, error(...args) { errors.push(args); } },
    });
    await stop();
    assert.equal(calls, 1);
    assert.equal(errors.length, 1);
});

test('Không gửi truy vấn khi mốc thời gian không hợp lệ', async () => {
    await assert.rejects(cancelOverdueBookings({}, new Date('invalid')));
});

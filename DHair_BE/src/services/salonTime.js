const MINUTE = 60 * 1000;
const OFFSET = 7 * 60 * MINUTE;
const LEAVE_BUFFER_MS = 30 * MINUTE;
const terminal = ['Đã huỷ', 'Đã hủy', 'Hoàn thành', 'Đã hoàn thành'];

function localDate(now) {
    return new Date(now.getTime() + OFFSET).toISOString().slice(0, 10);
}

function appointmentStart(booking) {
    const day = new Date(booking.NGAYHEN).toISOString().slice(0, 10);
    const time = new Date(booking.GIOHEN).toISOString().slice(11, 19);
    return new Date(`${day}T${time}+07:00`);
}

function duration(details) {
    // THOILUONG lưu số phút cho một đơn vị tại lúc chọn dịch vụ.
    return details.reduce((total, item) => total + (item.THOILUONG ?? item.DICHVU?.THOIGIAN ?? 0) * (item.SOLUONG ?? 1), 0);
}

function interval(booking, now = new Date()) {
    const start = booking.BATDAUTHUCTE ? new Date(booking.BATDAUTHUCTE) : appointmentStart(booking);
    let end = booking.KETTHUCTHUCTE || booking.KETTHUCDUKIEN;
    end = end ? new Date(end) : new Date(start.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
    // Chưa hoàn thành thì không coi thợ đã rảnh chỉ vì hết giờ dự kiến.
    if (booking.TRANGTHAI === 'Đang thực hiện' && end <= now) end = new Date('9999-01-01T00:00:00Z');
    return { start, end };
}

function overlaps(a, b) { return a.start < b.end && a.end > b.start; }
// Giữ nguyên giờ xin nghỉ; chỉ cộng thời gian đệm khi tính lúc được nhận khách.
function leaveInterval(leave) {
    return { start: new Date(leave.BATDAU), end: new Date(new Date(leave.KETTHUC).getTime() + LEAVE_BUFFER_MS) };
}
function inQueue(booking) { return ['CHO', 'DA_GOI'].includes(booking.HANGDOI?.TRANGTHAI); }
function workingHours(start, end) {
    const day = localDate(start);
    return start >= new Date(`${day}T08:00:00+07:00`) && end <= new Date(`${day}T22:00:00+07:00`) && end > start;
}

module.exports = { MINUTE, LEAVE_BUFFER_MS, leaveInterval, localDate, appointmentStart, duration, interval, overlaps, inQueue, terminal, workingHours };

// Quy đổi ngày/giờ Việt Nam và tính khoảng bận dùng chung cho đặt lịch và điều phối.
const MINUTE = 60 * 1000;
const OFFSET = 7 * 60 * MINUTE;
const LEAVE_BUFFER_MS = 30 * MINUTE;
const terminal = ['Đã huỷ', 'Đã hủy', 'Hoàn thành', 'Đã hoàn thành'];

// Lấy ngày YYYY-MM-DD theo UTC+7, không phụ thuộc múi giờ của máy chủ.
function localDate(now) {
  return new Date(now.getTime() + OFFSET).toISOString().slice(0, 10);
}

// Ghép hai cột DATE/TIME thành thời điểm thực tế tại Việt Nam.
function appointmentStart(booking) {
  const day = new Date(booking.NGAYHEN).toISOString().slice(0, 10);
  const time = new Date(booking.GIOHEN).toISOString().slice(11, 19);
  return new Date(`${day}T${time}+07:00`);
}

// Tổng số phút phục vụ = thời lượng mỗi dịch vụ nhân số lượng tương ứng.
function duration(details) {
  // THOILUONG lưu số phút cho một đơn vị tại lúc chọn dịch vụ.
  return details.reduce(
    (total, item) => total + (item.THOILUONG ?? item.DICHVU?.THOIGIAN ?? 0) * (item.SOLUONG ?? 1),
    0,
  );
}

// Ưu tiên mốc thực tế, rồi dự kiến; nếu chưa có thì suy ra từ giờ hẹn và dịch vụ.
function interval(booking, now = new Date()) {
  const start = booking.BATDAUTHUCTE ? new Date(booking.BATDAUTHUCTE) : appointmentStart(booking);
  let end = booking.KETTHUCTHUCTE || booking.KETTHUCDUKIEN;
  end = end ? new Date(end) : new Date(start.getTime() + duration(booking.CHITIETLICHHEN) * MINUTE);
  // Chưa hoàn thành thì không coi thợ đã rảnh chỉ vì hết giờ dự kiến.
  if (booking.TRANGTHAI === 'Đang thực hiện' && end <= now) end = new Date('9999-01-01T00:00:00Z');
  return { start, end };
}

// Hai khoảng chỉ chạm nhau tại điểm kết thúc/bắt đầu không được xem là trùng.
function overlaps(a, b) {
  return a.start < b.end && a.end > b.start;
}
// Giữ nguyên giờ xin nghỉ; chỉ cộng thời gian đệm khi tính lúc được nhận khách.
function leaveInterval(leave) {
  return {
    start: new Date(leave.BATDAU),
    end: new Date(new Date(leave.KETTHUC).getTime() + LEAVE_BUFFER_MS),
  };
}
// Khách đã được gọi vẫn ở hàng đợi cho đến khi nhận phục vụ hoặc rời đi.
function inQueue(booking) {
  return ['CHO', 'DA_GOI'].includes(booking.HANGDOI?.TRANGTHAI);
}
// Toàn bộ lượt phục vụ phải nằm trong 08:00–22:00 của cùng ngày tại Việt Nam.
function workingHours(start, end) {
  const day = localDate(start);
  return (
    start >= new Date(`${day}T08:00:00+07:00`) &&
    end <= new Date(`${day}T22:00:00+07:00`) &&
    end > start
  );
}

module.exports = {
  MINUTE,
  LEAVE_BUFFER_MS,
  leaveInterval,
  localDate,
  appointmentStart,
  duration,
  interval,
  overlaps,
  inQueue,
  terminal,
  workingHours,
};

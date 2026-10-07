const GRACE_PERIOD_MS = 10 * 60 * 1000;
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

async function cancelOverdueBookings(db, now = new Date()) {
    if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
        throw new Error('Thời điểm kiểm tra lịch hẹn không hợp lệ.');
    }

    // MySQL lưu NGAYHEN và GIOHEN riêng; Prisma trả cả hai dưới dạng Date UTC.
    // Chuyển mốc kiểm tra sang giờ Việt Nam trước khi tách ngày/giờ để so sánh.
    const cutoff = new Date(now.getTime() + VIETNAM_OFFSET_MS - GRACE_PERIOD_MS);
    const cutoffLocalTime = cutoff.toISOString().replace('T', ' ').replace('Z', '');

    // Kiểm tra trạng thái ngay trong UPDATE: nếu nhân viên vừa xác nhận khách
    // đã đến thì tác vụ không được ghi đè. Chạy lại cũng không hủy lần thứ hai.
    // Prisma truyền Date thành DATETIME đầy đủ, không phù hợp để so sánh với
    // cột TIME. TIMESTAMP(date, time) ghép hai cột ngay trong MySQL để so sánh đúng.
    // Tagged template truyền cutoff dưới dạng tham số, không nối chuỗi SQL.
    // Dấu < nghĩa là đúng 10 phút chưa hủy; phải quá 10 phút mới hủy.
    const count = await db.$executeRaw`
        UPDATE LICHHEN
        SET TRANGTHAI = 'Đã huỷ', LYDOHUY = 'Tự hủy: quá giờ hẹn 10 phút, khách chưa đến'
        WHERE TRANGTHAI IN ('Đã đặt', 'Đang chờ')
          AND THOIGIANDEN IS NULL
          AND TIMESTAMP(NGAYHEN, GIOHEN) < ${cutoffLocalTime}
    `;
    return { count };
}

module.exports = { cancelOverdueBookings };

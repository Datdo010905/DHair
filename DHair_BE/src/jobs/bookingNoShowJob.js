const { cancelOverdueBookings } = require('../services/bookingNoShowService');

function startBookingNoShowJob(db, { intervalMs = 60_000, logger = console } = {}) {
    let running = false;
    let stopped = false;
    let currentRun = Promise.resolve();

    const run = () => {
        // Không chạy chồng lên nhau nếu database phản hồi lâu hơn một phút.
        if (running || stopped) return currentRun;
        running = true;
        currentRun = (async () => {
            try {
                const result = await cancelOverdueBookings(db);
                if (result.count > 0) {
                    logger.info(`[Lịch hẹn] Tự hủy ${result.count} lịch quá giờ hẹn 10 phút, chưa đến.`);
                }
            } catch (error) {
                // Lỗi một lượt không làm dừng server; lượt sau sẽ thử lại.
                logger.error('[Lịch hẹn] Không thể kiểm tra lịch quá giờ:', error.code || error.message);
            } finally {
                running = false;
            }
        })();
        return currentRun;
    };

    // Chạy ngay lúc khởi động để xử lý cả lịch bị bỏ lỡ khi server tắt.
    void run();
    const timer = setInterval(run, intervalMs);
    timer.unref();

    return async () => {
        stopped = true;
        clearInterval(timer);
        await currentRun;
    };
}

module.exports = { startBookingNoShowJob };

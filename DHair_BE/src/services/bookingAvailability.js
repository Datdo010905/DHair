const OPEN_MINUTES = 8 * 60;
const CLOSE_MINUTES = 22 * 60;
const MAX_DAYS_AHEAD = 4;
const { interval, overlaps, inQueue } = require('./salonTime');

function bookingError(message, status = 400) {
    return Object.assign(new Error(message), { status });
}

// Ngày và giờ của salon luôn theo Việt Nam, không phụ thuộc múi giờ máy chủ.
function getDateWindow(now = new Date()) {
    const vietnamNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = vietnamNow.toISOString().slice(0, 10);
    const lastDay = new Date(`${today}T00:00:00Z`);
    lastDay.setUTCDate(lastDay.getUTCDate() + MAX_DAYS_AHEAD);
    return { today, lastDay: lastDay.toISOString().slice(0, 10) };
}

function validateDate(date, now = new Date()) {
    const { today, lastDay } = getDateWindow(now);
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date ||
        date < today || date > lastDay) {
        throw bookingError('Chỉ được đặt lịch từ hôm nay đến 4 ngày tới.');
    }
}

function timeToMinutes(value) {
    const text = value instanceof Date ? value.toISOString() : String(value || '');
    const time = text.includes('T') ? text.split('T')[1] : text;
    const match = /^(\d{2}):(\d{2})/.exec(time);
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return NaN;
    return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutes(minutes) {
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function isCancelled(status) {
    return ['đã huỷ', 'đã hủy'].includes(String(status || '').trim().toLowerCase());
}

function calculateSlots(date, duration, bookings, staffId, now = new Date()) {
    validateDate(date, now);
    if (!Number.isInteger(duration) || duration <= 0) throw bookingError('Thời lượng dịch vụ không hợp lệ.');
    const busy = bookings.filter(booking => !isCancelled(booking.TRANGTHAI) && !inQueue(booking)).map(booking => {
        if (booking.NGAYHEN && (booking.KETTHUCDUKIEN || booking.BATDAUTHUCTE || booking.TRANGTHAI === 'Đang thực hiện')) {
            return { absolute: interval(booking, now) };
        }
        const start = timeToMinutes(booking.GIOHEN);
        const minutes = booking.CHITIETLICHHEN
            .filter(detail => detail.MANV?.trim() === staffId)
            .reduce((total, detail) => total + Number(detail.THOILUONG ?? detail.DICHVU?.THOIGIAN) * Number(detail.SOLUONG ?? 1), 0);
        // Không mở giờ khi dữ liệu lịch cũ thiếu thời lượng hoặc giờ bắt đầu.
        if (!Number.isFinite(start) || !Number.isFinite(minutes) || minutes <= 0) {
            throw bookingError('Không thể xác định thời lượng lịch của stylist. Vui lòng liên hệ salon.', 409);
        }
        return { start, end: start + minutes };
    });
    const slots = [];
    for (let start = OPEN_MINUTES; start + duration <= CLOSE_MINUTES; start += 30) {
        const time = formatMinutes(start);
        if (new Date(`${date}T${time}:00+07:00`) <= now) continue;
        // Hai lịch có thể nối tiếp nhau; chỉ loại khi khoảng thực hiện giao nhau.
        const slotStart = new Date(`${date}T${time}:00+07:00`);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);
        if (busy.some(item => item.absolute ? overlaps({ start: slotStart, end: slotEnd }, item.absolute) : start < item.end && start + duration > item.start)) continue;
        slots.push({ time, endTime: formatMinutes(start + duration) });
    }
    return slots;
}

module.exports = { bookingError, getDateWindow, validateDate, calculateSlots };

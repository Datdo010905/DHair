const { PrismaClient } = require('@prisma/client');
const bookingService = require('../services/bookingService');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const historyService = require('../services/bookingHistoryService');

// Lấy danh tính từ token đã ký, không nhận mã khách hàng do client tự gửi.
exports.requireCustomerSession = (req, res, next) => {
    try {
        const authorization = req.headers.authorization || '';
        if (!authorization.startsWith('Bearer ')) throw new Error('Missing token');
        const payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] });
        if (typeof payload.MaTK !== 'string' || !payload.MaTK.trim()) throw new Error('Invalid token');
        req.bookingAccountId = payload.MaTK.trim();
        return next();
    } catch {
        return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
    }
};

exports.history = async (req, res) => {
    try {
        const data = await historyService.getHistory(prisma, req.bookingAccountId);
        return res.json({ success: true, data });
    } catch (error) { return handleError(res, error); }
};

exports.cancel = async (req, res) => {
    try {
        const data = await historyService.cancelBooking(prisma, req.bookingAccountId, req.params.id, req.body || {});
        return res.json({ success: true, data, message: 'Đã hủy lịch hẹn.' });
    } catch (error) { return handleError(res, error); }
};

function handleError(res, error) {
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    if (error.code === 'P2002' || error.code === 'P2034') {
        return res.status(409).json({ success: false, message: 'Lịch vừa thay đổi. Vui lòng tải lại giờ trống.' });
    }
    console.error('Booking API:', error);
    return res.status(500).json({ success: false, message: 'Không thể xử lý lịch hẹn. Vui lòng thử lại.' });
}

exports.options = async (req, res) => {
    try {
        const data = await bookingService.getOptions(prisma, req.query.branchId);
        return res.json({ success: true, data });
    } catch (error) { return handleError(res, error); }
};

exports.availability = async (req, res) => {
    try {
        const data = await bookingService.getAvailability(prisma, req.query);
        return res.json({ success: true, data });
    } catch (error) { return handleError(res, error); }
};

exports.create = async (req, res) => {
    try {
        const data = await bookingService.createBooking(prisma, req.body || {});
        return res.status(201).json({ success: true, data, message: 'Đặt lịch thành công!' });
    } catch (error) { return handleError(res, error); }
};

// Web vẫn dùng payload cũ nhưng kiểm tra giờ và khóa nhân viên chung với mobile.
exports.createFull = async (req, res) => {
    try {
        const { booking = {}, details = {} } = req.body || {};
        const data = await bookingService.createBooking(prisma, {
            bookingId: booking.MALICH, customerId: booking.MAKH,
            branchId: booking.MACHINHANH, staffId: details.MANV,
            serviceId: details.MADV, quantity: details.SOLUONG,
            date: booking.NGAYHEN, time: booking.GIOHEN, note: details.GHICHU,
        });
        return res.status(201).json({ success: true, data, message: 'Đặt lịch thành công!' });
    } catch (error) { return handleError(res, error); }
};

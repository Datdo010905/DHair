const express = require('express');
const router = express.Router();
const lichHenController = require('../controllers/lichHenController');
const bookingController = require('../controllers/bookingController');
const salon = require('../controllers/salonOperationsController');
const reviews = require('../controllers/bookingReviewController');
router.get('/reviews', bookingController.requireCustomerSession, reviews.list);
router.post('/:id/review', bookingController.requireCustomerSession, reviews.create);
const staffSession = [bookingController.requireCustomerSession, salon.requireStaff];
// Danh mục tĩnh dùng chung; quyền hủy vẫn được kiểm tra ở endpoint ghi dữ liệu.
router.get(
  '/cancellation-reasons',
  bookingController.requireCustomerSession,
  bookingController.cancellationReasons,
);
router.get('/operations/board', ...staffSession, salon.board);
router.post('/operations/walk-in', ...staffSession, salon.walkIn);
router.post('/operations/leave', ...staffSession, salon.leave);
router.post('/operations/:id/queue', ...staffSession, salon.queue);
router.post('/operations/:id/extend', ...staffSession, salon.extend);
router.post('/operations/:id/reschedule', ...staffSession, salon.reschedule);
router.get('/operations/:id/history', ...staffSession, salon.history);
router.post('/operations/:id/invoice', ...staffSession, salon.invoice);
router.get(
  '/admin-list',
  bookingController.requireCustomerSession,
  lichHenController.getAdminBookings,
);
router.get('/history', bookingController.requireCustomerSession, bookingController.history);
router.post('/:id/cancel', bookingController.requireCustomerSession, bookingController.cancel);

router.get('/booking-options', bookingController.options);
router.get('/availability', bookingController.availability);
router.post('/book', bookingController.create);

// Route lich hẹn
router.get('/get-all-lichhen', lichHenController.getAll);
router.get('/get-byId-lichhen/:id', lichHenController.getByID);
router.get('/get-byIdKH-lichhen/:id', lichHenController.getByIDKH);
router.get('/get-byIdNV-lichhen/:id', lichHenController.getByNhanVien);
router.post('/insert-lichhen', lichHenController.create);
router.put('/update-lichhen/:id', ...staffSession, lichHenController.updateStatus);
router.delete('/delete-lichhen/:id', lichHenController.remove);
router.get('/get-all-lichhenTheoNgay', lichHenController.getAllTheoNgay);
// Route chi tiết lịch hẹn
router.get('/get-all-CTlichhen', lichHenController.getAllCT);
router.get('/get-byId-CTlichhen/:id', lichHenController.getCTByID);
router.post('/insert-CTlichhen', ...staffSession, lichHenController.createCT);
router.put('/update-CTlichhen/:id', lichHenController.updateCT);
router.delete('/delete-CTlichhen/:id', lichHenController.removeCT);

router.post('/create-full', bookingController.createFull);
router.delete('/delete-full/:id', lichHenController.deleteFullBookingTransaction);
module.exports = router;

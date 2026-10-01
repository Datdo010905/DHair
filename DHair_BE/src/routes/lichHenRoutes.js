const express = require('express');
const router = express.Router();
const lichHenController = require('../controllers/lichHenController');
const bookingController = require('../controllers/bookingController');
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
router.put('/update-lichhen/:id', lichHenController.updateStatus);
router.delete('/delete-lichhen/:id', lichHenController.remove);
router.get('/get-all-lichhenTheoNgay', lichHenController.getAllTheoNgay);
// Route chi tiết lịch hẹn
router.get('/get-all-CTlichhen', lichHenController.getAllCT);
router.get('/get-byId-CTlichhen/:id', lichHenController.getCTByID);
router.post('/insert-CTlichhen', lichHenController.createCT);
router.put('/update-CTlichhen/:id', lichHenController.updateCT);
router.delete('/delete-CTlichhen/:id', lichHenController.removeCT);


router.post('/create-full', bookingController.createFull);
router.delete('/delete-full/:id', lichHenController.deleteFullBookingTransaction);
module.exports = router;

const express = require('express');
const router = express.Router();
const khuyenMaiController = require('../controllers/khuyenMaiController');

router.get('/get-all-KhuyenMai', khuyenMaiController.getAll);
router.get('/get-byId-KhuyenMai/:id', khuyenMaiController.getByID);
router.post('/insert-KhuyenMai', khuyenMaiController.create);
router.put('/update-KhuyenMai/:id', khuyenMaiController.update);
router.delete('/delete-KhuyenMai/:id', khuyenMaiController.remove);

module.exports = router;
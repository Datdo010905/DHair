const express = require('express');
const router = express.Router();
const dichVuController = require('../controllers/dichVuController');

const multer = require('multer');
const path = require('path');

//CẤU HÌNH MULTER ĐỂ LƯU FILE ẢNH
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Nơi lưu file
    },
    filename: function (req, file, cb) {
        //TÊN GỐC FILE
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//endpoint như [HttpGet] 
router.get('/get-all-DichVuToc', dichVuController.getDichVuToc);
router.get('/get-all-DichVuCungCap', dichVuController.getAllDichVuCungCap);
router.get('/get-all-DichVuCSD', dichVuController.getDichVuCSD);
router.get('/get-all-DichVuChamSocDA', dichVuController.getDichVuChamSocDaAll);
router.get('/get-all-DichVu', dichVuController.getDichVuTocAll);
router.get('/get-DichVuByID/:id', dichVuController.getDichVuByID);

//middleware upload.single('fileAnh') vào giữa chặn trước khi vào Controller
router.post('/create-DichVu', upload.single('fileAnh'), dichVuController.createDichVu);

router.put('/update-DichVu', upload.single('fileAnh'), dichVuController.updateDichVu);

// Dùng DELETE cho Delete
router.delete('/delete-DichVu/:id', dichVuController.deleteDichVu);

module.exports = router;
const dichVuService = require('../services/dichVuService');

const getDichVuToc = async (req, res) => {
    try {
        const data = await dichVuService.getAllDichVuToc();
        //trả về dữ liệu cho client
        res.status(200).json({
            success: true,
            data: data,
            message: 'Lấy danh sách dịch vụ tóc thành công!'
        });
    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        res.status(500).json({ success: false, message: 'Lỗi kết nối với server!' });
    }
};
const getAllDichVuCungCap = async (req, res) => {
    try {
        const data = await dichVuService.getTatCaDichVuCungCap();
        //trả về dữ liệu cho client
        res.status(200).json({
            success: true,
            data: data,
            message: 'Lấy danh sách dịch vụ đang cung cấp thành công!'
        });
    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        res.status(500).json({ success: false, message: 'Lỗi kết nối với server!' });
    }
};
const getDichVuTocAll = async (req, res) => {
    try {
        const data = await dichVuService.getAllDichVu();
        //trả về dữ liệu cho client
        res.status(200).json({
            success: true,
            data: data,
            message: 'Lấy danh sách dịch vụ tóc thành công!'
        });
    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        res.status(500).json({ success: false, message: 'Lỗi kết nối với server!' });
    }
};
const getDichVuChamSocDaAll = async (req, res) => {
    try {
        const data = await dichVuService.getAllDichVuChamSocDA();
        //trả về dữ liệu cho client
        res.status(200).json({
            success: true,
            data: data,
            message: 'Lấy danh sách dịch vụ chăm sóc da thành công!'
        });
    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        res.status(500).json({ success: false, message: 'Lỗi kết nối với server!' });
    }
};
const getDichVuCSD = async (req, res) => {
    try {
        const data = await dichVuService.getAllDichVuCSD();
        //trả về dữ liệu cho client
        res.status(200).json({
            success: true,
            data: data,
            message: 'Lấy danh sách dịch vụ chăm sóc da thành công!'
        });
    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        res.status(500).json({ success: false, message: 'Lỗi kết nối với server!' });
    }
};
const getDichVuByID = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Thiếu mã dịch vụ"
            });
        }

        const data = await dichVuService.getDVByID(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy dịch vụ"
            });
        }

        // thành công
        return res.status(200).json({
            success: true,
            data: data,
            message: "Lấy thông tin dịch vụ thành công!"
        });

    } catch (error) {
        console.error("Lỗi Controller Dịch Vụ:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};
const createDichVu = async (req, res) => {
    try {
        //dữ liệu text từ req.body
        const { maDV, tenDV, loai, moTa, thoiGian, giaDV, trangThai, quyTrinh } = req.body;

        //đường dẫn ảnh từ req.file
        const hinhAnh = req.file ? `/img/product/${req.file.originalname}` : null;

        //tạo object model để gửi
        const model = {
            MaDV: maDV,
            Loai: loai,
            TenDV: tenDV,
            MoTa: moTa,
            ThoiGian: thoiGian,
            GiaDV: giaDV,
            TrangThai: trangThai,
            QuyTrinh: quyTrinh,
            HinhAnh: hinhAnh
        };
        
        const dichVuTonTai = await dichVuService.getDVByID(maDV); 
        
        if (dichVuTonTai) {
            return res.status(400).json({
                success: false,
                message: `Mã dịch vụ ${maDV} đã tồn tại. Vui lòng nhập mã khác!`
            });
        }

        //thêm
        const result = await dichVuService.insertDichVu(model);

        res.status(201).json({
            success: true,
            data: result,
            message: "Thêm dịch vụ thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//cập nhật
const updateDichVu = async (req, res) => {
    try {
        // Hứng data từ Form
        const { maDV, tenDV, loai, moTa, thoiGian, giaDV, trangThai, quyTrinh } = req.body;

        // Nếu chọn ảnh mới thì lấy, không thì để null
        const hinhAnh = req.file ? `/img/product/${req.file.originalname}` : null;

        const model = {
            Loai: loai,
            TenDV: tenDV,
            MoTa: moTa,
            ThoiGian: thoiGian,
            GiaDV: giaDV,
            TrangThai: trangThai,
            QuyTrinh: quyTrinh,
            HinhAnh: hinhAnh 
        };

        const result = await dichVuService.updateDichVu(maDV, model);

        res.status(200).json({
            success: true,
            data: result,
            message: "Cập nhật dịch vụ thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteDichVu = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ success: false, message: "Thiếu mã dịch vụ cần xóa!" });
        }

        await dichVuService.deleteDichVu(id);

        res.status(200).json({
            success: true,
            message: "Xóa dịch vụ thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    getDichVuToc,
    getDichVuCSD,
    createDichVu,
    getDichVuByID,
    getDichVuTocAll,
    getDichVuChamSocDaAll,
    updateDichVu,
    deleteDichVu,
    getAllDichVuCungCap
};
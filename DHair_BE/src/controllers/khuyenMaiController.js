const khuyenMaiService = require('../services/khuyenMaiService');

const getAll = async (req, res) => {
    try {
        const data = await khuyenMaiService.getAllKhuyenMai();
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getByID = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await khuyenMaiService.getKhuyenMaiByID(id);
        if (data) return res.status(200).json({ success: true, data: data });
        return res.status(404).json({ success: false, message: "Không tìm thấy khuyến mại!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const data = req.body;
        const maKM = data.MAKM || data.makm;

        const dt = await khuyenMaiService.getKhuyenMaiByID(maKM);
        if (dt) return res.status(400).json({ success: false, message: `Mã ${maKM} đã tồn tại!` });

        const newData = await khuyenMaiService.createKhuyenMai(data);
        return res.status(201).json({ success: true, message: "Thêm thành công!", data: newData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const updatedData = await khuyenMaiService.updateKhuyenMai(id, data);
        return res.status(200).json({ success: true, message: "Cập nhật thành công!", data: updatedData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        await khuyenMaiService.deleteKhuyenMai(id);
        return res.status(200).json({ success: true, message: "Xóa thành công!" });
    } catch (error) {
        // Bắt lỗi nếu Khuyến mại đã được áp dụng vào Hóa Đơn
        if (error.code === 'P2003') return res.status(400).json({ success: false, message: "Khuyến mại đã được sử dụng, không thể xóa!" });
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAll, getByID, create, update, remove };
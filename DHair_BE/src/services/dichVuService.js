const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getTatCaDichVuCungCap = async () => {
    return await prisma.dICHVU.findMany({
        where: {
            TRANGTHAI: 'Đang cung cấp'
        }
    });
};

const getAllDichVuToc = async () => {
    return await prisma.dICHVU.findMany({
        where: {
            LOAI: 'CT',
            TRANGTHAI: 'Đang cung cấp'
        }
    });
};

const getAllDichVuCSD = async () => {
    return await prisma.dICHVU.findMany({
        where: {
            LOAI: 'CSD',
            TRANGTHAI: 'Đang cung cấp'
        }
    });
};

const getAllDichVu = async () => {
    return await prisma.dICHVU.findMany({
        where: {
            LOAI: 'CT'
        }
    });
};

const getAllDichVuChamSocDA = async () => {
    return await prisma.dICHVU.findMany({
        where: {
            LOAI: 'CSD'
        }
    });
};
const getDVByID = async (ma) => {
    return await prisma.dICHVU.findUnique({
        where: { MADV: ma }
    });
};
//dùng ORM của Prisma thay excuteRaw
const insertDichVu = async (model) => {
    try {

        //prisma dùng chữ thường cho kí tự đầu tiên của bảng
        const result = await prisma.dICHVU.create({
            data: {
                MADV: model.MaDV,
                LOAI: model.Loai,
                TENDV: model.TenDV,
                MOTA: model.MoTa || null,
                THOIGIAN: Number(model.ThoiGian),
                GIADV: Number(model.GiaDV),
                TRANGTHAI: model.TrangThai || null,
                HINH: model.HinhAnh || null,
                QUYTRINH: model.QuyTrinh || null
            }
        });

        return result;
    } catch (error) {
        throw new Error("Lỗi khi thêm dịch vụ: " + error.message);
    }
};

const updateDichVu = async (ma, model) => {
    try {
        // Dùng Prisma để update dựa theo Mã Dịch Vụ
        const result = await prisma.dICHVU.update({
            where: { MADV: ma },
            data: {
                LOAI: model.Loai,
                TENDV: model.TenDV,
                MOTA: model.MoTa || null,
                THOIGIAN: Number(model.ThoiGian),
                GIADV: Number(model.GiaDV),
                TRANGTHAI: model.TrangThai || null,
                QUYTRINH: model.QuyTrinh || null,
                //Chỉ cập nhật ảnh nếu có up ảnh mới lên
                ...(model.HinhAnh && { HINH: model.HinhAnh }) 
            }
        });
        return result;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật dịch vụ: " + error.message);
    }
};

const updateStatus = async (ma, status, db = prisma) => {
    if (typeof ma !== 'string' || !ma.trim() || !['Đang cung cấp', 'Ngừng cung cấp'].includes(status)) {
        const error = new Error('Mã dịch vụ hoặc trạng thái không hợp lệ.');
        error.status = 400;
        throw error;
    }
    return db.dICHVU.update({ where: { MADV: ma.trim() }, data: { TRANGTHAI: status } });
};

const deleteDichVu = async (ma) => {
    try {
        const result = await prisma.dICHVU.delete({
            where: { MADV: ma }
        });
        return result;
    } catch (error) {
        //dịch vụ này đã có người đặt lịch, không được xóa
        //tránh xoá bảng khi có khoá ngoại liên quan.
        if (error.code === 'P2003') {
            throw new Error("Dịch vụ này đã có trong hóa đơn hoặc lịch hẹn, không thể xóa!");
        }
        throw new Error("Lỗi khi xóa dịch vụ: " + error.message);
    }
};
module.exports = {
    getAllDichVuToc,
    getAllDichVuCSD,
    getAllDichVu,
    getAllDichVuChamSocDA,
    getDVByID,
    insertDichVu,
    updateDichVu,
    updateStatus,
    deleteDichVu,
    getTatCaDichVuCungCap
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllKhuyenMai = async () => {
    return await prisma.kHUYENMAI.findMany();
};

const getKhuyenMaiByID = async (ma) => {
    return await prisma.kHUYENMAI.findUnique({
        where: { MAKM: ma }
    });
};

const createKhuyenMai = async (model) => {
    return await prisma.kHUYENMAI.create({
        data: {
            MAKM: model.MAKM || model.makm,
            TENKM: model.TENKM || model.tenkm,
            MOTA: model.MOTA || model.mota || null,
            // Ép chuỗi thành kiểu Date cho Prisma
            NGAYBD: new Date(model.NGAYBD || model.ngaybd),
            NGAYKT: new Date(model.NGAYKT || model.ngaykt),
            // Ép giá trị thành dạng số
            GIATRI: Number(model.GIATRI || model.giatri),
            TRANGTHAI: model.TRANGTHAI || model.trangthai
        }
    });
};

const updateKhuyenMai = async (ma, model) => {
    return await prisma.kHUYENMAI.update({
        where: { MAKM: ma },
        data: {
            TENKM: model.TENKM || model.tenkm,
            MOTA: model.MOTA || model.mota || null,
            NGAYBD: new Date(model.NGAYBD || model.ngaybd),
            NGAYKT: new Date(model.NGAYKT || model.ngaykt),
            GIATRI: Number(model.GIATRI || model.giatri),
            TRANGTHAI: model.TRANGTHAI || model.trangthai
        }
    });
};

const deleteKhuyenMai = async (ma) => {
    return await prisma.kHUYENMAI.delete({
        where: { MAKM: ma }
    });
};

module.exports = {
    getAllKhuyenMai, getKhuyenMaiByID, createKhuyenMai, updateKhuyenMai, deleteKhuyenMai
};
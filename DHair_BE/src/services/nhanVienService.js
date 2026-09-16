const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllNhanVien = async () => {
    return await prisma.nHANVIEN.findMany();
};

const getNhanVienByID = async (ma) => {
    return await prisma.nHANVIEN.findUnique({
        where: { MANV: ma }
    });
};

// Tìm xem có nhân viên KHÁC đang dùng tài khoản này không
const checkAccTonTai = async (manv, matk) => {
    return await prisma.nHANVIEN.findFirst({
        where: {
            MATK: matk,
            MANV: { not: manv }
        }
    });
};

// Tìm xem có nhân viên KHÁC đang dùng SĐT này không
const checkSDTTonTai = async (manv, sdt) => {
    return await prisma.nHANVIEN.findFirst({
        where: {
            SDT: sdt,
            MANV: { not: manv }
        }
    });
};

const createNhanVien = async (model) => {
    return await prisma.nHANVIEN.create({
        data: {
            MANV: model.MANV || model.manv,
            HOTEN: model.HOTEN || model.hoten,
            CHUCVU: model.CHUCVU || model.chucvu,
            SDT: model.SDT || model.sdt,
            DIACHI: model.DIACHI || model.diachi,
            MACHINHANH: model.MACHINHANH || model.machinhanh,
            // Ép chuỗi ngày tháng từ React sang chuẩn Date của Prisma
            NGAYSINH: new Date(model.NGAYSINH || model.ngaysinh), 
            MATK: model.MATK || model.matk || null
        }
    });
};

const updateNhanVien = async (ma, model) => {
    return await prisma.nHANVIEN.update({
        where: { MANV: ma },
        data: {
            HOTEN: model.HOTEN || model.hoten,
            CHUCVU: model.CHUCVU || model.chucvu,
            SDT: model.SDT || model.sdt,
            DIACHI: model.DIACHI || model.diachi,
            MACHINHANH: model.MACHINHANH || model.machinhanh,
            NGAYSINH: new Date(model.NGAYSINH || model.ngaysinh),
            MATK: model.MATK || model.matk || null
        }
    });
};

const deleteNhanVien = async (ma) => {
    return await prisma.nHANVIEN.delete({
        where: { MANV: ma }
    });
};

module.exports = {
    getAllNhanVien, getNhanVienByID, checkAccTonTai, checkSDTTonTai, createNhanVien, updateNhanVien, deleteNhanVien
};
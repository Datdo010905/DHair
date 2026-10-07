const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const checkLogin = async (username, password) => {
  const user = await prisma.tAIKHOAN.findUnique({
    where: {
      MATK: username,
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.PASS);

  if (!passwordMatches) {
    return null;
  }

  return user;
};
// Hàm check xem mã tài khoản đã tồn tại chưa
const checkTaiKhoanTonTai = async (maTK) => {
  return await prisma.tAIKHOAN.findUnique({
    where: {
      MATK: maTK,
    },
    select: {
      MATK: true,
      PHANQUYEN: true,
      TRANGTHAI: true,
    },
  });
};

// Hàm thêm tài khoản mới
const createTaiKhoan = async (model) => {
  const hashedPassword = await bcrypt.hash(model.PASS, 10);

  return await prisma.tAIKHOAN.create({
    data: {
      MATK: model.MATK,
      PASS: hashedPassword,
      PHANQUYEN: Number(model.PHANQUYEN),
      TRANGTHAI: model.TRANGTHAI,
    },
    select: {
      MATK: true,
      PHANQUYEN: true,
      TRANGTHAI: true,
    },
  });
};
const getAllTaiKhoan = async () => {
  return await prisma.tAIKHOAN.findMany({
    select: {
      MATK: true,
      PHANQUYEN: true,
      TRANGTHAI: true,
    },
  });
};

const updateTaiKhoan = async (ma, model) => {
  return await prisma.tAIKHOAN.update({
    where: {
      MATK: ma,
    },
    data: {
      PHANQUYEN: Number(model.PHANQUYEN),
      TRANGTHAI: model.TRANGTHAI,
    },
    select: {
      MATK: true,
      PHANQUYEN: true,
      TRANGTHAI: true,
    },
  });
};

const deleteTaiKhoan = async (ma) => {
  return await prisma.tAIKHOAN.delete({
    where: { MATK: ma },
  });
};

module.exports = {
  checkLogin,
  checkTaiKhoanTonTai,
  createTaiKhoan,
  getAllTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
};

const taiKhoanService = require('../services/taiKhoanService');
const { PrismaClient } = require('@prisma/client');
const { forgotPasswordEmail } = require('../services/mailService');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getAll = async (req, res) => {
  try {
    const data = await taiKhoanService.getAllTaiKhoan();
    return res
      .status(200)
      .json({ success: true, message: 'Lấy danh sách tài khoản thành công!', data: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
  }
};

const getByID = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await taiKhoanService.checkTaiKhoanTonTai(id);

    if (data) {
      return res
        .status(200)
        .json({ success: true, message: 'Tìm thấy tài khoản thành công!', data: data });
    } else {
      return res
        .status(404)
        .json({ success: false, message: `Không tìm thấy tài khoản có mã: '${id}'` });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
  }
};

const create = async (req, res) => {
  try {
    // Lấy dữ liệu từ body
    const data = req.body;
    const isExist = await taiKhoanService.checkTaiKhoanTonTai(data.MATK);

    if (!isExist) {
      const newData = await taiKhoanService.createTaiKhoan(data);
      return res
        .status(201)
        .json({ success: true, message: 'Thêm thông tin tài khoản thành công!', data: newData });
    } else {
      return res
        .status(400)
        .json({ success: false, message: `Đã tồn tại tài khoản có mã: '${data.MATK}'` });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id; // Lấy ID từ URL
    const data = req.body;

    const isExist = await taiKhoanService.checkTaiKhoanTonTai(id);
    if (isExist) {
      const updatedData = await taiKhoanService.updateTaiKhoan(id, data);
      return res.status(200).json({
        success: true,
        message: 'Thay đổi thông tin tài khoản thành công!',
        data: updatedData,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: `Không tồn tại tài khoản có mã: '${id}' để thay đổi` });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const isExist = await taiKhoanService.checkTaiKhoanTonTai(id);

    if (isExist) {
      await taiKhoanService.deleteTaiKhoan(id);
      return res
        .status(200)
        .json({ success: true, message: 'Xoá thông tin tài khoản thành công!' });
    } else {
      return res
        .status(404)
        .json({ success: false, message: `Không tồn tại tài khoản có mã: '${id}' để xoá` });
    }
  } catch (error) {
    // Bắt lỗi khóa ngoại nếu tài khoản đang dính tới Khách Hàng hoặc Thợ
    if (error.message.includes('Foreign key constraint failed') || error.code === 'P2003') {
      return res
        .status(400)
        .json({ success: false, message: 'Tài khoản này đang được sử dụng, không thể xóa!' });
    }
    return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const accountId = req.profileAccountId;

    const { currentPassword, newPassword } = req.body || {};

    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ mật khẩu.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      });
    }

    if (newPassword.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không được vượt quá 50 ký tự.',
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
      });
    }

    const account = await prisma.tAIKHOAN.findUnique({
      where: {
        MATK: accountId,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản.',
      });
    }

    // So sánh password nhập vào với hash trong DB.
    const passwordMatches = await bcrypt.compare(currentPassword, account.PASS);

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.tAIKHOAN.update({
      where: {
        MATK: accountId,
      },
      data: {
        PASS: hashedPassword,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công.',
    });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);

    return res.status(500).json({
      success: false,
      message: 'Không thể đổi mật khẩu. Vui lòng thử lại.',
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, sdt } = req.body;

    const khachHang = await prisma.kHACHHANG.findFirst({
      where: {
        SDT: sdt,
        EMAIL: email,
      },
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin không chính xác hoặc không tồn tại!',
      });
    }

    // Password thật gửi cho user.
    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();

    // Nhưng DB chỉ lưu bcrypt hash.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.tAIKHOAN.update({
      where: {
        MATK: sdt,
      },
      data: {
        PASS: hashedPassword,
      },
    });

    // Email vẫn gửi password thật.
    forgotPasswordEmail(email, newPassword, khachHang.HOTEN).catch((err) => {
      console.error('Lỗi gửi mail cấp lại pass ngầm:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Mật khẩu mới đã được gửi vào Email của bạn!',
    });
  } catch (error) {
    console.error('Lỗi gửi email:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ, vui lòng thử lại sau!',
    });
  }
};

module.exports = { getAll, getByID, create, update, remove, changePassword, forgotPassword };

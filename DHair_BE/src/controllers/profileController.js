const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const service = require('../services/profileService');
const prisma = new PrismaClient();

exports.requireSession = (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';
    if (!authorization.startsWith('Bearer ')) throw new Error('Missing token');
    const payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    if (typeof payload.MaTK !== 'string' || !payload.MaTK.trim()) throw new Error('Invalid token');
    req.profileAccountId = payload.MaTK.trim();
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
  }
};

function handleError(res, error) {
  if (error.status)
    return res.status(error.status).json({ success: false, message: error.message });
  console.error('Profile API:', error);
  return res
    .status(500)
    .json({ success: false, message: 'Không thể xử lý thông tin cá nhân. Vui lòng thử lại.' });
}

exports.get = async (req, res) => {
  try {
    const data = await service.getProfile(prisma, req.profileAccountId);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.updateProfile(prisma, req.profileAccountId, req.body || {});
    return res.json({ success: true, data, message: 'Đã lưu thông tin cá nhân.' });
  } catch (error) {
    return handleError(res, error);
  }
};

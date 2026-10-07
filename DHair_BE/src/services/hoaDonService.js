const { PrismaClient } = require('@prisma/client');
const { bookingError } = require('./bookingAvailability');
const workflow = require('./invoiceWorkflow');
const prisma = new PrismaClient();

// Mọi đường ghi hóa đơn dùng chung quy tắc và transaction.
const createHoaDonWithDetails = (model, details) => workflow.create(prisma, model, details);
const createHoaDon = (model) => createHoaDonWithDetails(model, model.details || []);
const updateHoaDon = (id, model) => workflow.update(prisma, id, model);
const createCT = (model) => workflow.addDetail(prisma, model);
const deleteHoaDonWithDetails = (id) => workflow.remove(prisma, id);
const deleteHoaDon = deleteHoaDonWithDetails;
async function deleteCT() {
  throw bookingError('Không xóa rời toàn bộ chi tiết hóa đơn. Hãy hủy hóa đơn trước.', 409);
}
const getAllHoaDon = () => prisma.hOADON.findMany();
const getHoaDonByID = (ma) => prisma.hOADON.findUnique({ where: { MAHD: ma } });
const getAllCT = () => prisma.cHITIETHOADON.findMany();
const getCTByID = (ma) => prisma.cHITIETHOADON.findMany({ where: { MAHD: ma } });
async function getHoaDonTheoNgay(ngaybd, ngaykt) {
  const start = new Date(ngaybd + 'T00:00:00+07:00');
  const end = new Date(ngaykt + 'T23:59:59+07:00');
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end)
    throw bookingError('Khoảng ngày không hợp lệ.');
  return prisma.hOADON.findMany({
    where: { NGAYTHANHTOAN: { gte: start, lte: end } },
    orderBy: { NGAYTHANHTOAN: 'desc' },
  });
}
module.exports = {
  getAllHoaDon,
  getHoaDonByID,
  createHoaDon,
  updateHoaDon,
  deleteHoaDon,
  getHoaDonTheoNgay,
  getAllCT,
  getCTByID,
  createCT,
  deleteCT,
  createHoaDonWithDetails,
  deleteHoaDonWithDetails,
};

const { PrismaClient } = require('@prisma/client');
const operations = require('../services/salonOperationsService');
const db = new PrismaClient();

// Các thao tác vận hành chỉ dành cho quản lý, lễ tân và stylist được giao lịch.
async function requireStaff(req, res, next) {
  try {
    const account = await db.tAIKHOAN.findUnique({ where: { MATK: req.bookingAccountId } });
    if (!account || account.TRANGTHAI.trim().toLowerCase() !== 'hoạt động')
      return res.status(401).json({ message: 'Tài khoản không còn hoạt động.' });
    if (![1, 2, 3, 5].includes(account.PHANQUYEN))
      return res.status(403).json({ message: 'Không có quyền vận hành salon.' });
    req.salonRole = account.PHANQUYEN;
    if (account.PHANQUYEN === 3) {
      const bookingId = req.params.id || req.body?.MALICH;
      const assigned =
        bookingId &&
        (await db.cHITIETLICHHEN.findFirst({
          where: { MALICH: bookingId, NHANVIEN: { MATK: account.MATK } },
        }));
      if (
        !assigned ||
        !['PUT', 'POST'].includes(req.method) ||
        !/update-lichhen|\/status$|\/extend$/.test(req.path)
      ) {
        return res.status(403).json({ message: 'Stylist chỉ cập nhật tiến độ lịch được giao.' });
      }
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Không thể kiểm tra quyền.' });
  }
}

function handle(fn) {
  return async (req, res) => {
    try {
      return res.json({ success: true, data: await fn(req) });
    } catch (error) {
      if (!error.status) console.error('Salon operations:', error);
      return res
        .status(error.status || (['P2002', 'P2034'].includes(error.code) ? 409 : 500))
        .json({
          success: false,
          message: error.status
            ? error.message
            : 'Không thể lưu. Dữ liệu có thể vừa thay đổi, hãy tải lại.',
          conflicts: error.conflicts || [],
        });
    }
  };
}

module.exports = {
  requireStaff,
  board: handle((req) => operations.board(db, req.query.branchId)),
  invoice: handle((req) => operations.draftInvoice(db, req.params.id, req.bookingAccountId)),
  walkIn: handle((req) => operations.walkIn(db, req.body, req.bookingAccountId)),
  leave: handle((req) => operations.addLeave(db, req.body, req.bookingAccountId)),
  queue: handle((req) => operations.queueAction(db, req.params.id, req.body, req.bookingAccountId)),
  extend: handle((req) => operations.extend(db, req.params.id, req.body, req.bookingAccountId)),
  reschedule: handle((req) =>
    operations.reschedule(db, req.params.id, req.body, req.bookingAccountId),
  ),
  history: handle((req) =>
    db.lICHSULICH.findMany({ where: { MALICH: req.params.id }, orderBy: { THOIDIEM: 'desc' } }),
  ),
};

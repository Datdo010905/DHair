// Nghiệp vụ hóa đơn: giá đã chốt, khuyến mãi, thu ngân, trạng thái và chống lập trùng.
const { randomUUID } = require('node:crypto');
const { bookingError } = require('./bookingAvailability');
const { localDate } = require('./salonTime');
const pending = 'Chưa thanh toán';
const cancelled = ['Đã huỷ', 'Đã hủy'];
const field = (model, key) => (model[key] !== undefined ? model[key] : model[key.toLowerCase()]);
const code = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);
function money(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 2147483647)
    throw bookingError('Số tiền không hợp lệ.');
  return value;
}
function count(value) {
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < 1 || result > 20)
    throw bookingError('Số lượng phải từ 1 đến 20.');
  return result;
}
async function priceTotal(tx, details, promotionId, now) {
  const subtotal = money(details.reduce((sum, item) => sum + money(item.THANHTIEN), 0));
  if (!promotionId) return subtotal;
  const promotion = await tx.kHUYENMAI.findUnique({ where: { MAKM: promotionId } });
  const today = localDate(now);
  // Form khuyến mãi nhập theo ngày, tính cả ngày kết thúc theo lịch Việt Nam.
  if (
    !promotion ||
    promotion.TRANGTHAI?.trim() !== 'Đang áp dụng' ||
    (promotion.NGAYBD && today < promotion.NGAYBD.toISOString().slice(0, 10)) ||
    (promotion.NGAYKT && today > promotion.NGAYKT.toISOString().slice(0, 10)) ||
    !Number.isFinite(promotion.GIATRI) ||
    promotion.GIATRI < 0 ||
    promotion.GIATRI > 100
  ) {
    throw bookingError('Khuyến mãi không còn hợp lệ. Vui lòng bỏ hoặc chọn lại.');
  }
  return money(Math.round(subtotal * (1 - promotion.GIATRI / 100)));
}
async function bookingDetails(tx, bookingId) {
  const booking = await tx.lICHHEN.findUnique({
    where: { MALICH: bookingId },
    include: { CHITIETLICHHEN: true },
  });
  if (!booking || booking.TRANGTHAI?.trim() !== 'Hoàn thành')
    throw bookingError('Lịch phải hoàn thành trước khi lập hoặc thanh toán hóa đơn.', 409);
  const details = booking.CHITIETLICHHEN.map((item) => {
    const quantity = count(item.SOLUONG ?? 1),
      total = money(item.GIA_DUKIEN);
    return {
      MADV: item.MADV,
      SOLUONG: quantity,
      DONGIA: Math.round(total / quantity),
      THANHTIEN: total,
    };
  });
  if (!details.length) throw bookingError('Lịch chưa có dịch vụ.');
  return { booking, details };
}
async function catalogDetails(tx, items) {
  if (!Array.isArray(items) || !items.length) throw bookingError('Hóa đơn phải có dịch vụ.');
  const details = [];
  for (const item of items) {
    const serviceId = code(field(item, 'MADV'));
    if (!serviceId || details.some((detail) => detail.MADV === serviceId))
      throw bookingError('Dịch vụ bị trùng hoặc không hợp lệ.');
    const service = await tx.dICHVU.findUnique({ where: { MADV: serviceId } });
    if (!service || service.TRANGTHAI?.trim() !== 'Đang cung cấp')
      throw bookingError('Dịch vụ không còn cung cấp.');
    const quantity = count(field(item, 'SOLUONG')),
      unitPrice = money(Math.round(service.GIADV));
    details.push({
      MADV: serviceId,
      SOLUONG: quantity,
      DONGIA: unitPrice,
      THANHTIEN: money(unitPrice * quantity),
    });
  }
  return details;
}
async function settlement(tx, model, status, now, branchId) {
  const cashierId = code(field(model, 'MANV')),
    method = code(field(model, 'HINHTHUCTHANHTOAN'));
  if (![pending, 'Đã thanh toán', ...cancelled].includes(status))
    throw bookingError('Trạng thái hóa đơn không hợp lệ.');
  if (status === 'Đã thanh toán') {
    const cashier = cashierId && (await tx.nHANVIEN.findUnique({ where: { MANV: cashierId } }));
    if (
      !cashier ||
      cashier.CHUCVU?.trim() !== 'Thu ngân' ||
      (branchId && cashier.MACHINHANH?.trim() !== branchId.trim())
    )
      throw bookingError('Chọn thu ngân đúng chi nhánh.');
    if (!['Tiền mặt', 'Thẻ tín dụng', 'Chuyển khoản', 'Ví điện tử'].includes(method))
      throw bookingError('Chọn hình thức thanh toán hợp lệ.');
  }
  // Server ghi giờ thu tiền. Hóa đơn nháp/hủy chưa có ngày thanh toán.
  return {
    MANV: cashierId,
    HINHTHUCTHANHTOAN: method,
    TRANGTHAI: status,
    NGAYTHANHTOAN: status === 'Đã thanh toán' ? now : null,
  };
}
async function lockInvoice(tx, invoiceId) {
  const initial = await tx.hOADON.findUnique({ where: { MAHD: invoiceId } });
  if (!initial) throw bookingError('Không tìm thấy hóa đơn.', 404);
  // Cùng thứ tự khóa với chức năng lập hóa đơn từ lịch để tránh tranh chấp.
  if (initial.MALICH)
    await tx.$queryRaw`SELECT MALICH FROM LICHHEN WHERE MALICH = ${initial.MALICH} FOR UPDATE`;
  await tx.$queryRaw`SELECT MAHD FROM HOADON WHERE MAHD = ${invoiceId} FOR UPDATE`;
  const invoice = await tx.hOADON.findUnique({
    where: { MAHD: invoiceId },
    include: { CHITIETHOADON: true },
  });
  if (!invoice) throw bookingError('Hóa đơn vừa bị xóa.', 409);
  return invoice;
}
function assertPending(invoice) {
  if (invoice.TRANGTHAI?.trim() !== pending)
    throw bookingError('Chỉ được sửa hóa đơn chưa thanh toán.', 409);
}
async function assertNoDuplicate(tx, bookingId, exceptId) {
  const existing = await tx.hOADON.findFirst({
    where: {
      MALICH: bookingId,
      MAHD: { not: exceptId || '' },
      OR: [{ TRANGTHAI: null }, { TRANGTHAI: { notIn: cancelled } }],
    },
  });
  if (existing)
    throw bookingError(`Lịch đã có hóa đơn ${existing.MAHD}. Vui lòng mở hóa đơn đó.`, 409);
}
async function create(db, model, items, now = new Date()) {
  return db.$transaction(
    async (tx) => {
      const bookingId = code(field(model, 'MALICH'));
      let details,
        customerId = code(field(model, 'MAKH')),
        branchId;
      if (bookingId) {
        await tx.$queryRaw`SELECT MALICH FROM LICHHEN WHERE MALICH = ${bookingId} FOR UPDATE`;
        await assertNoDuplicate(tx, bookingId);
        const source = await bookingDetails(tx, bookingId);
        details = source.details;
        customerId = source.booking.MAKH;
        branchId = source.booking.MACHINHANH;
      } else details = await catalogDetails(tx, items);
      const status = field(model, 'TRANGTHAI') || pending;
      if (cancelled.includes(status)) throw bookingError('Không tạo mới hóa đơn đã hủy.');
      const promotionId = code(field(model, 'MAKM'));
      return tx.hOADON.create({
        data: {
          MAHD: code(field(model, 'MAHD')) || `HD${randomUUID().replace(/-/g, '').slice(0, 18)}`,
          MAKH: customerId,
          MALICH: bookingId,
          MAKM: promotionId,
          TONGTIEN: await priceTotal(tx, details, promotionId, now),
          ...(await settlement(tx, model, status, now, branchId)),
          CHITIETHOADON: { create: details },
        },
      });
    },
    { isolationLevel: 'ReadCommitted' },
  );
}
// Chỉ hóa đơn chưa thanh toán được sửa; server tính tiền và ghi thời điểm thu tiền.
async function update(db, invoiceId, model, now = new Date()) {
  return db.$transaction(
    async (tx) => {
      const invoice = await lockInvoice(tx, invoiceId);
      assertPending(invoice);
      const status = field(model, 'TRANGTHAI') || pending;
      if (cancelled.includes(status))
        return tx.hOADON.update({
          where: { MAHD: invoiceId },
          data: { TRANGTHAI: 'Đã huỷ', NGAYTHANHTOAN: null },
        });
      let details = invoice.CHITIETHOADON,
        branchId;
      if (invoice.MALICH) {
        await assertNoDuplicate(tx, invoice.MALICH, invoiceId);
        const source = await bookingDetails(tx, invoice.MALICH);
        details = source.details;
        branchId = source.booking.MACHINHANH;
      }
      if (!details.length) throw bookingError('Hóa đơn chưa có dịch vụ.');
      const promotionId =
        field(model, 'MAKM') === undefined ? invoice.MAKM : code(field(model, 'MAKM'));
      const total = await priceTotal(tx, details, promotionId, now);
      const cashier = field(model, 'MANV');
      const method = field(model, 'HINHTHUCTHANHTOAN');
      const payment = await settlement(
        tx,
        {
          MANV: cashier === undefined ? invoice.MANV : cashier,
          HINHTHUCTHANHTOAN: method === undefined ? invoice.HINHTHUCTHANHTOAN : method,
        },
        status,
        now,
        branchId,
      );
      if (invoice.MALICH) {
        // Đồng bộ đủ dịch vụ và giá đã chốt từ lịch, bỏ qua tiền client gửi.
        await tx.cHITIETHOADON.deleteMany({ where: { MAHD: invoiceId } });
        await tx.cHITIETHOADON.createMany({
          data: details.map((item) => ({ ...item, MAHD: invoiceId })),
        });
      }
      return tx.hOADON.update({
        where: { MAHD: invoiceId },
        data: { ...payment, MAKM: promotionId, TONGTIEN: total },
      });
    },
    { isolationLevel: 'ReadCommitted' },
  );
}
async function addDetail(db, model, now = new Date()) {
  return db.$transaction(
    async (tx) => {
      const invoice = await lockInvoice(tx, code(field(model, 'MAHD')));
      assertPending(invoice);
      if (invoice.MALICH) throw bookingError('Hóa đơn từ lịch không được thêm dịch vụ riêng.', 409);
      const [detail] = await catalogDetails(tx, [model]);
      if (invoice.CHITIETHOADON.some((item) => item.MADV === detail.MADV))
        throw bookingError('Dịch vụ đã có trong hóa đơn.', 409);
      const total = await priceTotal(tx, [...invoice.CHITIETHOADON, detail], invoice.MAKM, now);
      const created = await tx.cHITIETHOADON.create({ data: { ...detail, MAHD: invoice.MAHD } });
      await tx.hOADON.update({ where: { MAHD: invoice.MAHD }, data: { TONGTIEN: total } });
      return created;
    },
    { isolationLevel: 'ReadCommitted' },
  );
}
async function remove(db, invoiceId) {
  return db.$transaction(
    async (tx) => {
      const invoice = await lockInvoice(tx, invoiceId);
      if (!cancelled.includes(invoice.TRANGTHAI?.trim()))
        throw bookingError('Chỉ được xóa hóa đơn đã hủy.', 409);
      await tx.cHITIETHOADON.deleteMany({ where: { MAHD: invoiceId } });
      return tx.hOADON.delete({ where: { MAHD: invoiceId } });
    },
    { isolationLevel: 'ReadCommitted' },
  );
}
module.exports = { create, update, addDetail, remove };

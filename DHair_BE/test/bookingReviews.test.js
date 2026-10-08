const test = require('node:test');
const assert = require('node:assert/strict');
const { createReview, listReviews, dateBound } = require('../src/services/bookingReviewService');

function database({ role = 6, status = 'Hoàn thành', owner = 'KH1', existing = null } = {}) {
  const booking = { MALICH: 'LH1', MAKH: owner, TRANGTHAI: status, DANHGIA: existing };
  const db = {
    tAIKHOAN: { findUnique: async () => ({ PHANQUYEN: role, TRANGTHAI: 'Hoạt động' }) },
    kHACHHANG: { findUnique: async () => ({ MAKH: 'KH1' }) },
    $queryRaw: async () => [],
    lICHHEN: { findFirst: async ({ where }) => (where.MAKH === booking.MAKH ? booking : null) },
    dANHGIALICH: {
      create: async ({ data }) => {
        booking.DANHGIA = { ...data, TAOLUC: new Date() };
        return booking.DANHGIA;
      },
      groupBy: async () => [],
      findMany: async () => [],
    },
    cHINHANH: { findMany: async () => [] },
    $transaction: async (callback) => callback(db),
  };
  return db;
}

test('Chỉ chủ lịch đã hoàn thành được đánh giá; lưu nhận xét đã cắt khoảng trắng', async () => {
  const db = database();
  const result = await createReview(db, 'TK1', 'LH1', { rating: 5, comment: ' Tốt ' });
  assert.equal(result.rating, 5);
  assert.equal(result.comment, 'Tốt');
  await assert.rejects(createReview(db, 'TK1', 'LH1', { rating: 4 }), { status: 409 });
  await assert.rejects(createReview(database({ owner: 'KH2' }), 'TK1', 'LH1', { rating: 4 }), {
    status: 404,
  });
  await assert.rejects(
    createReview(database({ status: 'Đang thực hiện' }), 'TK1', 'LH1', { rating: 4 }),
    { status: 409 },
  );
});

test('Kiểm tra số sao, nhận xét và trạng thái tài khoản', async () => {
  for (const rating of [0, 6, 1.5, '5', null])
    await assert.rejects(createReview(database(), 'TK1', 'LH1', { rating }), { status: 400 });
  await assert.rejects(
    createReview(database(), 'TK1', 'LH1', { rating: 5, comment: 'a'.repeat(501) }),
    { status: 400 },
  );
  const db = database();
  db.tAIKHOAN.findUnique = async () => ({ TRANGTHAI: 'Khóa' });
  await assert.rejects(createReview(db, 'TK1', 'LH1', { rating: 5 }), { status: 401 });
});

test('Khóa duy nhất trả lỗi xung đột khi hai yêu cầu cùng gửi', async () => {
  const db = database();
  db.dANHGIALICH.create = async () => {
    throw Object.assign(new Error(), { code: 'P2002' });
  };
  await assert.rejects(createReview(db, 'TK1', 'LH1', { rating: 5 }), { status: 409 });
});

test('Phản hồi chỉ dành cho quản lý; thống kê rỗng không tạo điểm giả', async () => {
  for (const role of [3, 4, 5, 6])
    await assert.rejects(listReviews(database({ role }), 'TK1', {}), { status: 403 });
  const result = await listReviews(database({ role: 2 }), 'TK1', {});
  assert.equal(result.total, 0);
  assert.equal(result.average, null);
  assert.equal(result.positiveRate, null);
});

test('Thống kê toàn bộ kết quả; bộ lọc ngày Việt Nam, chi nhánh và sao áp dụng cho truy vấn', async () => {
  const db = database({ role: 1 });
  let criteria;
  db.dANHGIALICH.groupBy = async ({ where }) => {
    criteria = where;
    return [
      { SOSAO: 5, _count: { _all: 12 } },
      { SOSAO: 2, _count: { _all: 3 } },
    ];
  };
  db.dANHGIALICH.findMany = async ({ where, skip, take }) => {
    assert.deepEqual(where, criteria);
    assert.equal(skip, 10);
    assert.equal(take, 10);
    return [];
  };
  const result = await listReviews(db, 'TK1', {
    branchId: 'CN1',
    start: '2026-10-08',
    end: '2026-10-08',
    page: '2',
  });
  assert.equal(result.average, 4.4);
  assert.equal(result.positiveRate, 80);
  assert.equal(result.total, 15);
  assert.deepEqual(criteria.LICHHEN, { MACHINHANH: 'CN1' });
  assert.equal(criteria.TAOLUC.gte.toISOString(), '2026-10-07T17:00:00.000Z');
  assert.equal(criteria.TAOLUC.lt.toISOString(), '2026-10-08T17:00:00.000Z');
  const empty = database({ role: 2 });
  empty.dANHGIALICH.groupBy = async ({ where }) => {
    assert.equal(where.SOSAO, 4);
    return [];
  };
  await listReviews(empty, 'TK1', { rating: '4' });
  await assert.rejects(listReviews(empty, 'TK1', { start: '2026-10-09', end: '2026-10-08' }), {
    status: 400,
  });
  assert.throws(() => dateBound('2026-02-30'), { status: 400 });
});

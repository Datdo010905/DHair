const test = require('node:test');
const assert = require('node:assert/strict');
const { getProfile, updateProfile, validateProfile } = require('../src/services/profileService');

test('Tải hồ sơ theo tài khoản và chỉ trả thông tin hiển thị', async () => {
    const db = { kHACHHANG: { findUnique: async query => {
        assert.deepEqual(query.where, { MATK: 'TK01' });
        assert.deepEqual(query.select, { HOTEN: true, SDT: true, EMAIL: true });
        return { HOTEN: ' Nguyễn An ', SDT: '0901234567 ', EMAIL: null };
    } } };
    assert.deepEqual(await getProfile(db, 'TK01'), { fullName: 'Nguyễn An', phone: '0901234567', email: '' });
});

test('Cập nhật đúng tài khoản, bỏ qua mã khách hàng, điện thoại và mật khẩu từ client', async () => {
    const db = { kHACHHANG: { update: async query => {
        assert.deepEqual(query.where, { MATK: 'TK01' });
        assert.deepEqual(query.data, { HOTEN: 'Tên mới', EMAIL: 'test@example.com' });
        return { ...query.data, SDT: '0901234567' };
    } } };
    const result = await updateProfile(db, 'TK01', {
        fullName: ' Tên mới ', email: ' test@example.com ', MATK: 'TK02',
        MAKH: 'KH02', SDT: '0999999999', PASS: 'ignored',
    });
    assert.equal(result.fullName, 'Tên mới');
    assert.equal(result.phone, '0901234567');
});

test('Từ chối tên rỗng, tên quá dài và email không hợp lệ', () => {
    for (const input of [
        {}, { fullName: '  ', email: '' }, { fullName: 'x'.repeat(101), email: '' },
        { fullName: 'An', email: 'bad-email' }, { fullName: 'An', email: 'a b@example.com' },
        { fullName: 'An', email: 'a'.repeat(100) + '@test.com' }, { fullName: 'An', email: {} },
    ]) assert.throws(() => validateProfile(input), error => error.status === 400);
});

test('Cho phép bỏ email và tên có dấu trong giới hạn schema', () => {
    assert.deepEqual(validateProfile({ fullName: ' Nguyễn An ', email: ' ' }), { HOTEN: 'Nguyễn An', EMAIL: null });
    assert.equal(validateProfile({ fullName: 'a'.repeat(100), email: '' }).HOTEN.length, 100);
});

test('Không tìm thấy hồ sơ trả 404 khi đọc và cập nhật', async () => {
    const db = { kHACHHANG: {
        findUnique: async () => null,
        update: async () => { throw Object.assign(new Error('Missing'), { code: 'P2025' }); },
    } };
    await assert.rejects(getProfile(db, 'TK01'), error => error.status === 404);
    await assert.rejects(updateProfile(db, 'TK01', { fullName: 'An', email: '' }), error => error.status === 404);
});

test('API lấy danh tính từ token, từ chối token sai hoặc thiếu', () => {
    const jwt = require('jsonwebtoken');
    const { requireSession } = require('../src/controllers/profileController');
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'profile-test-secret';
    try {
        const token = jwt.sign({ MaTK: 'TK01 ' }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const req = { headers: { authorization: `Bearer ${token}` }, body: { accountId: 'TK02' } };
        let accepted = false;
        requireSession(req, {}, () => { accepted = true; });
        assert.equal(accepted, true);
        assert.equal(req.profileAccountId, 'TK01');
        for (const authorization of ['', 'Bearer bad-token']) {
            let status;
            const res = { status(value) { status = value; return this; }, json() { return this; } };
            requireSession({ headers: { authorization } }, res, () => assert.fail('Token không hợp lệ'));
            assert.equal(status, 401);
        }
    } finally {
        if (previousSecret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previousSecret;
    }
});

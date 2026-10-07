// Đọc/sửa hồ sơ theo tài khoản đã xác thực; không cho client đổi chủ sở hữu hồ sơ.
function profileError(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

const profileSelect = { HOTEN: true, SDT: true, EMAIL: true };

function formatProfile(customer) {
  return {
    fullName: customer.HOTEN.trim(),
    phone: customer.SDT.trim(),
    email: customer.EMAIL?.trim() || '',
  };
}

function validateProfile(input) {
  if (
    typeof input.fullName !== 'string' ||
    !input.fullName.trim() ||
    input.fullName.trim().length > 100
  ) {
    throw profileError('Họ và tên phải có từ 1 đến 100 ký tự.');
  }
  if (typeof input.email !== 'string') throw profileError('Email không hợp lệ.');
  const email = input.email.trim();
  if (email.length > 100 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw profileError('Email không đúng định dạng hoặc vượt quá 100 ký tự.');
  }
  // Chỉ cho cập nhật hai trường này, không nhận số điện thoại/mã tài khoản từ client.
  return { HOTEN: input.fullName.trim(), EMAIL: email || null };
}

async function getProfile(db, accountId) {
  const customer = await db.kHACHHANG.findUnique({
    where: { MATK: accountId },
    select: profileSelect,
  });
  if (!customer) throw profileError('Không tìm thấy thông tin khách hàng.', 404);
  return formatProfile(customer);
}

async function updateProfile(db, accountId, input) {
  const data = validateProfile(input);
  try {
    const customer = await db.kHACHHANG.update({
      where: { MATK: accountId },
      data,
      select: profileSelect,
    });
    return formatProfile(customer);
  } catch (error) {
    if (error.code === 'P2025') throw profileError('Không tìm thấy thông tin khách hàng.', 404);
    throw error;
  }
}

module.exports = { getProfile, updateProfile, validateProfile };

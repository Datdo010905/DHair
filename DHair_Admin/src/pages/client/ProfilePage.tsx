import '../../assets/css/profile.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogOut,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AdminIcon from '../../components/ui/AdminIcon';
import CustomerApi from '../../api/customerApi';
import bookingApi, { Booking } from '../../api/bookingApi';
import useCooldown from '../../hooks/useCooldown';
import { useAuth } from '../../context/AuthContext';

type Profile = {
  name: string;
  email: string;
};

type ProfileSection = 'info' | 'password';

// Record<string, string> mô tả bảng tra cứu: mã chi nhánh → tên hiển thị.
const branchNames: Record<string, string> = {
  CN001: 'DHair - Nguyễn Trãi',
  CN002: 'DHair - Cầu Giấy',
  CN003: 'DHair - Tân Bình',
  CN004: 'DHair - Đà Nẵng',
};

function getBookingTime(value: string): string {
  // Cột TIME được Prisma trả dưới dạng "1970-01-01T09:00:00.000Z".
  // Chỉ lấy phần giờ, không đổi múi giờ vì đây là giờ tại salon đã lưu trong DB.
  // Vẫn hỗ trợ chuỗi "09:00" hoặc "09:00:00" từ API khác.
  const time = value.trim().split('T').pop() || '';
  return time.slice(0, 5);
}

function findNextBooking(bookings: Booking[]): Booking | null {
  const upcomingBookings = bookings.filter((booking) => {
    const isPending = ['Đã đặt', 'Đang chờ'].includes(
      booking.TRANGTHAI?.trim(),
    );
    const date = booking.NGAYHEN.slice(0, 10);
    const time = getBookingTime(booking.GIOHEN);

    // API trả ngày và giờ riêng. +07:00 giúp hiểu giờ hẹn theo múi giờ Việt Nam,
    // ngay cả khi khách mở web từ máy tính đang dùng múi giờ khác.
    const appointmentTime = new Date(`${date}T${time}:00+07:00`).getTime();
    return isPending && appointmentTime >= Date.now();
  });

  upcomingBookings.sort((first, second) => {
    const dateOrder = first.NGAYHEN.localeCompare(second.NGAYHEN);
    if (dateOrder !== 0) return dateOrder;
    return getBookingTime(first.GIOHEN).localeCompare(
      getBookingTime(second.GIOHEN),
    );
  });

  return upcomingBookings[0] || null;
}

const ProfilePage = () => {
  const username = localStorage.getItem('username')?.trim();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<ProfileSection>('info');

  // profile là bản đang sửa; savedProfile là bản đã lưu thành công trên máy chủ.
  // So sánh hai bản để biết có cần bật nút lưu hay không.
  const [profile, setProfile] = useState<Profile>({ name: '', email: '' });
  const [savedProfile, setSavedProfile] = useState<Profile>({
    name: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState('');
  const [profileRetryCount, setProfileRetryCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  // Ref đổi giá trị ngay lập tức, chặn nhấp gửi hai lần trước khi React render lại.
  // State isSaving dùng riêng để cập nhật giao diện nút và khóa biểu mẫu.
  const saveLock = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(true);
  const [hasBookingError, setHasBookingError] = useState(false);
  const [bookingRetryCount, setBookingRetryCount] = useState(0);
  const { remainingSeconds, startCooldown } = useCooldown();

  useEffect(() => {
    if (!username) return;
    // Bỏ qua phản hồi cũ nếu đã rời trang hoặc effect chạy lại khi bấm thử lại.
    // Cờ này không hủy request HTTP, chỉ ngăn cập nhật state từ request hết hiệu lực.
    let isActive = true;
    setIsProfileLoading(true);
    setProfileLoadError('');
    CustomerApi.getById(username)
      .then((response) => {
        // API hiện có thể trả một đối tượng hoặc mảng chứa khách hàng.
        const data = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
        if (!response.data.success || !data) throw new Error();
        if (isActive) {
          const value = { name: data.HOTEN || '', email: data.EMAIL || '' };
          setProfile(value);
          setSavedProfile(value);
        }
      })
      .catch(() => {
        if (isActive)
          setProfileLoadError(
            'Không thể tải thông tin cá nhân. Vui lòng thử lại.',
          );
      })
      .finally(() => {
        if (isActive) setIsProfileLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [username, profileRetryCount]);

  // Lịch hẹn tải độc lập: lỗi lịch hẹn không cản việc chỉnh sửa hồ sơ.
  // Tăng bộ đếm thử lại sẽ chạy lại effect tương ứng.
  useEffect(() => {
    if (!username) return;
    let isActive = true;
    setIsBookingLoading(true);
    setHasBookingError(false);
    bookingApi
      .getAllByIdKH(username)
      .then((response) => {
        if (!response.data.success) throw new Error();
        const bookings: Booking[] = response.data.data || [];
        if (isActive) setUpcomingBooking(findNextBooking(bookings));
      })
      .catch(() => {
        if (isActive) setHasBookingError(true);
      })
      .finally(() => {
        if (isActive) setIsBookingLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [username, bookingRetryCount]);

  if (!username) return <Navigate to="/login" replace />;

  const hasUnsavedChanges =
    section === 'info'
      ? profile.name.trim() !== savedProfile.name.trim() ||
        profile.email.trim() !== savedProfile.email.trim()
      : password.length > 0 || confirmPassword.length > 0;
  // Lấy chữ cái đầu của hai từ cuối: "Nguyễn Văn An" → "VA".
  const avatarInitials =
    savedProfile.name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'DH';

  let submitButtonLabel =
    section === 'info' ? 'Lưu thay đổi' : 'Cập nhật mật khẩu';
  if (isSaving) {
    submitButtonLabel = 'Đang lưu…';
  } else if (remainingSeconds > 0) {
    submitButtonLabel = `Thử lại sau ${remainingSeconds}s`;
  }

  const handleSectionChange = (nextSection: ProfileSection) => {
    setSection(nextSection);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      saveLock.current ||
      isProfileLoading ||
      profileLoadError ||
      !hasUnsavedChanges ||
      remainingSeconds > 0
    )
      return;
    const nextErrors: Record<string, string> = {};
    if (section === 'info') {
      if (!profile.name.trim()) nextErrors.name = 'Vui lòng nhập họ và tên.';
      if (
        profile.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
      )
        nextErrors.email = 'Email chưa đúng định dạng.';
    } else {
      if (!password.trim()) nextErrors.password = 'Vui lòng nhập mật khẩu mới.';
      if (password !== confirmPassword)
        nextErrors.confirm = 'Mật khẩu xác nhận chưa trùng khớp.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    // Khi đổi mật khẩu, gửi bản hồ sơ đã lưu để không lưu nhầm phần đang sửa
    // ở mục Thông tin cá nhân. API này vẫn yêu cầu customerData cho cả hai mục.
    const profileToSave =
      section === 'info'
        ? { name: profile.name.trim(), email: profile.email.trim() }
        : savedProfile;
    saveLock.current = true;
    setIsSaving(true);
    try {
      const response = await CustomerApi.updateProfileFull(username, {
        customerData: { HOTEN: profileToSave.name, EMAIL: profileToSave.email },
        // undefined được bỏ qua khi gửi JSON: chỉ gửi mật khẩu ở mục đổi mật khẩu.
        accountData: section === 'password' ? { PASS: password } : undefined,
      });
      if (!response.data.success)
        throw new Error(response.data.message || 'Cập nhật thất bại.');
      if (section === 'info') {
        setSavedProfile(profileToSave);
        setProfile(profileToSave);
      }
      setPassword('');
      setConfirmPassword('');
      startCooldown();
      toast.success(
        section === 'info'
          ? 'Đã lưu thông tin cá nhân.'
          : 'Đổi mật khẩu thành công.',
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Không thể cập nhật. Vui lòng thử lại.',
      );
    } finally {
      setIsSaving(false);
      saveLock.current = false;
    }
  };

  return (
    <div className="dh-profile">
      <div className="pf-wrap">
        <header className="pf-heading">
          <span className="pf-eyebrow">TÀI KHOẢN DHAIR</span>
          <h1>Không gian của bạn</h1>
          <p>
            Quản lý thông tin và sẵn sàng cho lần làm mới phong cách tiếp theo.
          </p>
        </header>
        <div className="pf-layout">
          <aside className="pf-sidebar pf-card">
            <div className="pf-identity">
              <div className="pf-avatar" aria-hidden="true">
                {avatarInitials}
              </div>
              <h2>{savedProfile.name || 'Tài khoản của bạn'}</h2>
              <p>{username}</p>
              <span className="pf-member">
                <AdminIcon icon={FiCheck} aria-hidden="true" /> Khách hàng DHair
              </span>
            </div>
            <nav aria-label="Tài khoản cá nhân" className="pf-nav">
              <button
                type="button"
                disabled={isSaving}
                aria-current={section === 'info' ? 'page' : undefined}
                onClick={() => handleSectionChange('info')}
              >
                <AdminIcon icon={FiUser} aria-hidden="true" />
                Thông tin cá nhân
              </button>
              <Link to="/lichsu">
                <AdminIcon icon={FiCalendar} aria-hidden="true" />
                Lịch sử đặt lịch
              </Link>
              <button
                type="button"
                disabled={isSaving}
                aria-current={section === 'password' ? 'page' : undefined}
                onClick={() => handleSectionChange('password')}
              >
                <AdminIcon icon={FiLock} aria-hidden="true" />
                Đổi mật khẩu
              </button>
              <button
                type="button"
                className="pf-logout"
                disabled={isSaving}
                onClick={handleLogout}
              >
                <AdminIcon icon={FiLogOut} aria-hidden="true" />
                Đăng xuất
              </button>
            </nav>
          </aside>
          <div className="pf-content">
            <section
              className="pf-card pf-editor"
              aria-labelledby="pf-title"
              aria-busy={isProfileLoading}
            >
              <div className="pf-section-heading">
                <span className="pf-icon">
                  {section === 'info' ? (
                    <AdminIcon icon={FiUser} />
                  ) : (
                    <AdminIcon icon={FiLock} />
                  )}
                </span>
                <div>
                  <h2 id="pf-title">
                    {section === 'info' ? 'Thông tin cá nhân' : 'Đổi mật khẩu'}
                  </h2>
                  <p>
                    {section === 'info'
                      ? 'Thông tin chính xác giúp DHair phục vụ bạn tốt hơn.'
                      : 'Cập nhật mật khẩu để bảo vệ tài khoản của bạn.'}
                  </p>
                </div>
              </div>
              {isProfileLoading && (
                <p className="pf-feedback" role="status">
                  Đang tải thông tin của bạn…
                </p>
              )}
              {!isProfileLoading && profileLoadError && (
                <div className="pf-feedback" role="alert">
                  <p>{profileLoadError}</p>
                  <button
                    className="pf-secondary"
                    onClick={() => setProfileRetryCount((value) => value + 1)}
                  >
                    Thử lại
                  </button>
                </div>
              )}
              {/* Tự kiểm tra dữ liệu để hiển thị lỗi dưới từng ô thay vì popup của trình duyệt. */}
              {!isProfileLoading && !profileLoadError && (
                <form onSubmit={handleSubmit} noValidate>
                  {/* fieldset khóa các ô khi gửi; aria-describedby nối ô nhập với lời nhắc/lỗi cho trình đọc màn hình. */}
                  <fieldset disabled={isSaving} className="pf-fields">
                    {section === 'info' ? (
                      <>
                        <div className="pf-field">
                          <label htmlFor="pf-name">
                            Họ và tên <span>*</span>
                          </label>
                          <input
                            id="pf-name"
                            autoComplete="name"
                            maxLength={100}
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            aria-invalid={!!errors.name}
                            aria-describedby={
                              errors.name ? 'pf-name-error' : undefined
                            }
                          />
                          {errors.name && (
                            <p className="pf-error" id="pf-name-error">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="pf-field">
                          <label htmlFor="pf-phone">Số điện thoại</label>
                          <input
                            id="pf-phone"
                            type="tel"
                            autoComplete="tel"
                            value={username}
                            readOnly
                            aria-describedby="pf-phone-help"
                          />
                          <p id="pf-phone-help" className="pf-hint">
                            Số điện thoại đăng nhập không thể thay đổi.
                          </p>
                        </div>
                        <div className="pf-field pf-wide">
                          <label htmlFor="pf-email">Email</label>
                          <input
                            id="pf-email"
                            type="email"
                            autoComplete="email"
                            maxLength={100}
                            placeholder="Nhập địa chỉ email của bạn"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            aria-invalid={!!errors.email}
                            aria-describedby={
                              errors.email ? 'pf-email-error' : undefined
                            }
                          />
                          {errors.email && (
                            <p className="pf-error" id="pf-email-error">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pf-field">
                          <label htmlFor="pf-password">
                            Mật khẩu mới <span>*</span>
                          </label>
                          <div className="pf-password">
                            <input
                              id="pf-password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              aria-invalid={!!errors.password}
                              aria-describedby={
                                errors.password
                                  ? 'pf-password-error'
                                  : undefined
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((value) => !value)}
                              aria-label={
                                showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                              }
                              aria-pressed={showPassword}
                            >
                              {showPassword ? (
                                <AdminIcon icon={FiEyeOff} />
                              ) : (
                                <AdminIcon icon={FiEye} />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="pf-error" id="pf-password-error">
                              {errors.password}
                            </p>
                          )}
                        </div>
                        <div className="pf-field">
                          <label htmlFor="pf-confirm">
                            Xác nhận mật khẩu <span>*</span>
                          </label>
                          <input
                            id="pf-confirm"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            aria-invalid={!!errors.confirm}
                            aria-describedby={
                              errors.confirm ? 'pf-confirm-error' : undefined
                            }
                          />
                          {errors.confirm && (
                            <p className="pf-error" id="pf-confirm-error">
                              {errors.confirm}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </fieldset>
                  <div className="pf-actions">
                    <span className="pf-hint" role="status">
                      {hasUnsavedChanges
                        ? 'Bạn có thay đổi chưa lưu.'
                        : 'Thông tin của bạn đã được cập nhật.'}
                    </span>
                    <button
                      className="pf-primary"
                      type="submit"
                      disabled={
                        !hasUnsavedChanges || isSaving || remainingSeconds > 0
                      }
                    >
                      {submitButtonLabel}
                      {!isSaving && (
                        <AdminIcon icon={FiCheck} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </section>
            <section
              className="pf-card pf-appointment"
              aria-labelledby="pf-appointment-title"
            >
              <div className="pf-section-heading">
                <span className="pf-icon">
                  <AdminIcon icon={FiCalendar} />
                </span>
                <div>
                  <h2 id="pf-appointment-title">Lịch hẹn sắp tới</h2>
                  <p>Một chút thời gian cho diện mạo mới.</p>
                </div>
              </div>
              {isBookingLoading && (
                <p className="pf-feedback" role="status">
                  Đang tải lịch hẹn…
                </p>
              )}
              {!isBookingLoading && hasBookingError && (
                <div className="pf-feedback" role="alert">
                  <p>Chưa thể tải lịch hẹn của bạn.</p>
                  <button
                    className="pf-secondary"
                    onClick={() => setBookingRetryCount((value) => value + 1)}
                  >
                    Thử lại
                  </button>
                </div>
              )}
              {!isBookingLoading && !hasBookingError && upcomingBooking && (
                <div className="pf-booking">
                  <span className="pf-status">{upcomingBooking.TRANGTHAI}</span>
                  <h3>Lịch hẹn #{upcomingBooking.MALICH.trim()}</h3>
                  <div className="pf-booking-meta">
                    <span>
                      <AdminIcon icon={FiCalendar} />
                      {upcomingBooking.NGAYHEN.slice(0, 10)
                        .split('-')
                        .reverse()
                        .join('/')}
                    </span>
                    <span>
                      <AdminIcon icon={FiClock} />
                      {getBookingTime(upcomingBooking.GIOHEN)}
                    </span>
                    <span>
                      <AdminIcon icon={FiMapPin} />
                      {branchNames[upcomingBooking.MACHINHANH.trim()] ||
                        upcomingBooking.MACHINHANH}
                    </span>
                  </div>
                  <Link className="pf-text-link" to="/lichsu">
                    Xem lịch sử và chi tiết lịch hẹn{' '}
                    <AdminIcon icon={FiArrowRight} />
                  </Link>
                </div>
              )}
              {!isBookingLoading && !hasBookingError && !upcomingBooking && (
                <div className="pf-empty">
                  <div>
                    <h3>Bạn chưa có lịch hẹn sắp tới</h3>
                    <p>
                      Chọn thời gian phù hợp và để DHair chăm sóc mái tóc của
                      bạn.
                    </p>
                  </div>
                  <Link className="pf-primary" to="/datlich">
                    Đặt lịch mới{' '}
                    <AdminIcon icon={FiArrowRight} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

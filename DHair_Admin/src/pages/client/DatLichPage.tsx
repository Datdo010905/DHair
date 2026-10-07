import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/booking-admin.css';
import '../../assets/css/lichhen.css';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import bookingApi from '../../api/bookingApi';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';

interface Options {
  branches: { MACHINHANH: string; TENCHINHANH: string; DIACHI: string }[];
  stylists: { MANV: string; HOTEN: string }[];
  today: string;
  lastDay: string;
}
const emptyOptions: Options = { branches: [], stylists: [], today: '', lastDay: '' };
const currency = (value: number) => value.toLocaleString('vi-VN') + ' ₫';
const dateLabel = (value: string) => (value ? value.split('-').reverse().join('/') : 'Chưa chọn');

export default function DatLichPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileReload, setProfileReload] = useState(0);
  const [services, setServices] = useState<DichVu[]>([]);
  const [options, setOptions] = useState<Options>(emptyOptions);
  const [form, setForm] = useState({
    service: localStorage.getItem('madvCanXem')?.trim() || '',
    branch: '',
    staff: '',
    date: '',
    time: '',
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursError, setHoursError] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setFullName('');
    setPhone('');
    setProfileError('');
    if (!username) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    axiosClient
      .get<{ success: boolean; data: { fullName: string; phone: string } }>('/api/khachhang/me', {
        signal: controller.signal,
      })
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!response.data.success) throw new Error();
        setFullName(response.data.data.fullName);
        setPhone(response.data.data.phone);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setProfileError('Không tải được thông tin khách hàng. Vui lòng thử lại.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setProfileLoading(false);
      });
    return () => controller.abort();
  }, [username, profileReload]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([dichVuApi.getAllDichVuClient(), axiosClient.get('/api/lichhen/booking-options')])
      .then(([serviceResponse, optionResponse]) => {
        if (!active) return;
        if (!serviceResponse.data.success || !optionResponse.data.success) throw new Error();
        setServices(serviceResponse.data.data || []);
        setOptions((prev) => ({ ...optionResponse.data.data, stylists: prev.stylists }));
        setForm((prev) => ({ ...prev, date: prev.date || optionResponse.data.data.today }));
      })
      .catch(() => {
        if (active) setError('Không tải được thông tin đặt lịch. Vui lòng thử lại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reload]);

  useEffect(() => {
    const controller = new AbortController();
    setStaffError('');
    if (!form.branch) {
      setStaffLoading(false);
      return;
    }
    setStaffLoading(true);
    axiosClient
      .get('/api/lichhen/booking-options', {
        params: { branchId: form.branch },
        signal: controller.signal,
      })
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!response.data.success) throw new Error();
        setOptions(response.data.data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setStaffError('Không tải được stylist. Vui lòng thử lại.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setStaffLoading(false);
      });
    return () => controller.abort();
  }, [form.branch, reload]);

  useEffect(() => {
    const controller = new AbortController();
    setSlots([]);
    setHoursError('');
    setForm((prev) => (prev.time ? { ...prev, time: '' } : prev));
    if (!form.branch || !form.staff || !form.service || !form.date) {
      setHoursLoading(false);
      return;
    }
    setHoursLoading(true);
    bookingApi
      .availability(
        {
          branchId: form.branch,
          staffId: form.staff,
          serviceId: form.service,
          date: form.date,
          quantity: 1,
        },
        controller.signal,
      )
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!response.data.success) throw new Error(response.data.message);
        setSlots(response.data.data.slots.map((slot: { time: string }) => slot.time));
      })
      .catch((err: any) => {
        if (!controller.signal.aborted)
          setHoursError(
            err.response?.data?.message || 'Không tải được giờ trống. Vui lòng thử lại.',
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setHoursLoading(false);
      });
    return () => controller.abort();
  }, [form.branch, form.staff, form.service, form.date, reload]);

  const service = services.find((item) => item.MADV.trim() === form.service);
  const branch = options.branches.find((item) => item.MACHINHANH.trim() === form.branch);
  const staff = options.stylists.find((item) => item.MANV.trim() === form.staff);
  const ready =
    !!(service && branch && staff && form.date && form.time && slots.includes(form.time)) &&
    !loading &&
    !staffLoading &&
    !hoursLoading &&
    !error &&
    !staffError &&
    !hoursError;
  const review = (event: React.FormEvent) => {
    event.preventDefault();
    if (!username) {
      navigate('/login');
      return;
    }
    if (!ready) {
      toast.info('Vui lòng chọn đủ dịch vụ, stylist và giờ hẹn.');
      return;
    }
    setPassword('');
    setConfirmOpen(true);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saveLock.current || !ready || !password) return;
    saveLock.current = true;
    setSaving(true);
    try {
      const login = await axios.post(
        '/api/login/login-taikhoan',
        { username, pass: password },
        { baseURL: axiosClient.defaults.baseURL },
      );
      if (!login.data.success)
        throw new Error(login.data.message || 'Không xác nhận được tài khoản.');
      const response = await axiosClient.post('/api/lichhen/book', {
        accountId: username,
        branchId: form.branch,
        staffId: form.staff,
        serviceId: form.service,
        date: form.date,
        time: form.time,
        quantity: 1,
        note: form.note.trim(),
      });
      if (!response.data.success) throw new Error(response.data.message || 'Không đặt được lịch.');
      setPassword('');
      setConfirmOpen(false);
      localStorage.removeItem('madvCanXem');
      toast.success('Đặt lịch thành công!');
      navigate('/lichsu');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || 'Đặt lịch thất bại. Vui lòng thử lại.',
      );
      if (err.response?.status === 409) {
        setConfirmOpen(false);
        setPassword('');
        setReload((value) => value + 1);
      }
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };
  const close = () => {
    if (!saving) {
      setConfirmOpen(false);
      setPassword('');
    }
  };
  return (
    <div className="reservation-page booking-admin">
      <header className="ba-heading">
        <div>
          <p className="ba-eyebrow">ĐẶT HẸN CÙNG DHAIR</p>
          <h2>Đặt lịch giữ chỗ</h2>
          <p>Chọn dịch vụ, stylist và khung giờ phù hợp với bạn.</p>
        </div>
        <Link className="ba-button" to="/lichsu">
          Lịch hẹn của tôi
        </Link>
      </header>
      {!username && (
        <div className="reservation-notice">
          Bạn cần <Link to="/login">đăng nhập</Link> để xác nhận đặt lịch.
        </div>
      )}
      {error && (
        <div role="alert" className="reservation-notice ba-error">
          {error}{' '}
          <button className="ba-button" onClick={() => setReload((value) => value + 1)}>
            Thử lại
          </button>
        </div>
      )}
      <form className="reservation-layout" onSubmit={review} noValidate={!username}>
        <div className="reservation-sections">
          <section className="ba-card reservation-section">
            <h3>
              <span>01</span> Thông tin của bạn
            </h3>
            <div className="reservation-fields">
              <label>
                Họ và tên
                <input
                  readOnly
                  value={fullName}
                  placeholder={profileLoading ? 'Đang tải thông tin…' : 'Chưa có thông tin'}
                />
              </label>
              <label>
                Số điện thoại
                <input
                  readOnly
                  value={phone}
                  placeholder={profileLoading ? 'Đang tải thông tin…' : 'Chưa có thông tin'}
                />
              </label>
            </div>
            {profileError && (
              <p role="alert" className="ba-error">
                {profileError}{' '}
                <button
                  type="button"
                  className="ba-button"
                  onClick={() => setProfileReload((value) => value + 1)}
                >
                  Thử lại
                </button>
              </p>
            )}
          </section>
          <section className="ba-card reservation-section">
            <h3>
              <span>02</span> Dịch vụ và salon
            </h3>
            <div className="reservation-fields">
              <label className="reservation-wide">
                Dịch vụ
                <select
                  required
                  disabled={loading || !!error}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value, time: '' })}
                >
                  <option value="">{loading ? 'Đang tải dịch vụ…' : 'Chọn dịch vụ'}</option>
                  {services.map((item) => (
                    <option key={item.MADV} value={item.MADV.trim()}>
                      {item.TENDV} · {item.THOIGIAN} phút · {currency(Number(item.GIADV))}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Chi nhánh
                <select
                  required
                  disabled={loading || !!error}
                  value={form.branch}
                  onChange={(e) =>
                    setForm({ ...form, branch: e.target.value, staff: '', time: '' })
                  }
                >
                  <option value="">Chọn chi nhánh</option>
                  {options.branches.map((item) => (
                    <option key={item.MACHINHANH} value={item.MACHINHANH.trim()}>
                      {item.TENCHINHANH}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Stylist
                <select
                  required
                  disabled={!form.branch || staffLoading || !!staffError}
                  value={form.staff}
                  onChange={(e) => setForm({ ...form, staff: e.target.value, time: '' })}
                >
                  <option value="">{staffLoading ? 'Đang tải stylist…' : 'Chọn stylist'}</option>
                  {!staffLoading &&
                    options.stylists.map((item) => (
                      <option key={item.MANV} value={item.MANV.trim()}>
                        {item.HOTEN}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            {branch?.DIACHI && <p className="reservation-help">{branch.DIACHI}</p>}
            {staffError && (
              <p role="alert" className="ba-error">
                {staffError}{' '}
                <button
                  type="button"
                  className="ba-button"
                  onClick={() => setReload((value) => value + 1)}
                >
                  Thử lại
                </button>
              </p>
            )}
          </section>
          <section className="ba-card reservation-section">
            <h3>
              <span>03</span> Ngày và giờ hẹn
            </h3>
            <label>
              Ngày hẹn
              <input
                required
                type="date"
                min={options.today}
                max={options.lastDay}
                disabled={loading || !!error}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })}
              />
            </label>
            <p className="reservation-help">
              Đặt lịch trong 5 ngày: {dateLabel(options.today)} – {dateLabel(options.lastDay)}.
            </p>
            <fieldset className="reservation-hours">
              <legend>Chọn giờ trống</legend>
              {hoursLoading ? (
                <p role="status">Đang kiểm tra giờ trống…</p>
              ) : hoursError ? (
                <p className="ba-error" role="alert">
                  {hoursError}{' '}
                  <button
                    type="button"
                    className="ba-button"
                    onClick={() => setReload((value) => value + 1)}
                  >
                    Thử lại
                  </button>
                </p>
              ) : !form.service || !form.staff || !form.date ? (
                <p>Chọn dịch vụ, stylist và ngày để xem giờ trống.</p>
              ) : !slots.length ? (
                <p>Ngày này đã hết giờ trống. Bạn hãy chọn ngày hoặc stylist khác.</p>
              ) : (
                <div className="reservation-slots">
                  {slots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      aria-pressed={form.time === time}
                      onClick={() => setForm({ ...form, time })}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>
            <label>
              Ghi chú{' '}
              <textarea
                maxLength={200}
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Yêu cầu về kiểu tóc hoặc thông tin cần lưu ý…"
              />
            </label>
          </section>
        </div>
        <aside className="ba-card reservation-summary">
          <p className="ba-eyebrow">THÔNG TIN ĐẶT LỊCH</p>
          <h3>Lịch hẹn của bạn</h3>
          <dl>
            <div>
              <dt>Dịch vụ</dt>
              <dd>{service?.TENDV || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Chi nhánh</dt>
              <dd>{branch?.TENCHINHANH || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Stylist</dt>
              <dd>{staff?.HOTEN || 'Chưa chọn'}</dd>
            </div>
            <div>
              <dt>Thời gian</dt>
              <dd>
                {dateLabel(form.date)}
                {form.time && ' · ' + form.time}
              </dd>
            </div>
            <div>
              <dt>Thời lượng</dt>
              <dd>{service ? service.THOIGIAN + ' phút' : '—'}</dd>
            </div>
          </dl>
          <div className="reservation-total">
            <span>Giá dự kiến</span>
            <strong>{service ? currency(Number(service.GIADV)) : '—'}</strong>
          </div>
          <button className="ba-button ba-primary" type="submit" disabled={!!username && !ready}>
            {username ? 'Tiếp tục đặt lịch' : 'Đăng nhập để đặt lịch'}
          </button>
          <p className="reservation-help">Thanh toán tại salon sau khi sử dụng dịch vụ.</p>
        </aside>
      </form>
      <Modal isOpen={confirmOpen} onClose={close} title="Xác nhận đặt lịch">
        <form className="ba-form" onSubmit={submit}>
          <div className="ba-detail-item">
            <strong>{service?.TENDV}</strong>
            <p>
              {branch?.TENCHINHANH} · {staff?.HOTEN}
            </p>
            <p>
              {dateLabel(form.date)} · {form.time}
            </p>
          </div>
          <label>
            Mật khẩu tài khoản
            <input
              type="password"
              autoComplete="current-password"
              required
              disabled={saving}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="ba-actions">
            <button type="button" className="ba-button" disabled={saving} onClick={close}>
              Quay lại
            </button>
            <button className="ba-button ba-primary" disabled={saving || !ready}>
              {saving ? 'Đang đặt lịch…' : 'Xác nhận đặt lịch'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

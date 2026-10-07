// Quản lý lịch theo bộ lọc server; modal chỉ thu thập dữ liệu, backend quyết định chuyển trạng thái.
import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/ui/Modal';
import SalonOperationsPanel from '../../components/ui/SalonOperationsPanel';
import axiosClient from '../../api/axiosClient';
import { useSearch } from '../../context/SearchContext';
import { toast } from 'react-toastify';
import bookingApi, {
  AdminBooking,
  AdminBookingQuery,
  AdminBookingResult,
} from '../../api/bookingApi';
import customerApi, { Customer } from '../../api/customerApi';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import '../../assets/css/booking-admin.css';

const statuses = ['Đã đặt', 'Đang chờ', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ', 'Đã đến'];
const transitions: Record<string, string[]> = {
  'Đã đặt': ['Đang chờ', 'Đã đến', 'Đã huỷ'],
  'Đang chờ': ['Đã đến', 'Đang thực hiện', 'Đã huỷ'],
  'Đã đến': ['Đang thực hiện', 'Đã huỷ'],
  'Đang thực hiện': ['Hoàn thành'],
};
const normalizeStatus = (value: string) => (value.trim() === 'Đã hủy' ? 'Đã huỷ' : value.trim());
const dateLabel = (value: string) => value.split('T')[0].split('-').reverse().join('/');
const timeLabel = (value: string) =>
  (value.includes('T') ? value.split('T')[1] : value).slice(0, 5);
const emptyForm = {
  id: '',
  branchId: '',
  customerId: '',
  staffId: '',
  serviceId: '',
  date: '',
  time: '',
  quantity: '1',
  note: '',
  status: '',
};
type Action = 'add' | 'details' | 'edit' | 'delete' | 'view' | null;

function errorMessage(error: any) {
  return (
    error.response?.data?.message || error.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.'
  );
}

export default function BookingPage() {
  const role = Number(localStorage.getItem('phanquyen'));
  const canCreate = [1, 2, 5].includes(role);
  const canUpdate = [1, 2, 3, 5].includes(role);
  const canDelete = [1, 2].includes(role);
  const { searchTerm, setSearchTerm } = useSearch();
  const [query, setQuery] = useState<AdminBookingQuery>({
    mode: 'days',
    start: '',
    end: '',
    status: '',
    branchId: '',
    staffId: '',
    search: searchTerm,
    page: 1,
    pageSize: 10,
  });
  const [result, setResult] = useState<AdminBookingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [range, setRange] = useState({ start: '', end: '' });
  const [rangeError, setRangeError] = useState('');
  const [action, setAction] = useState<Action>(null);
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<AdminBooking | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<DichVu[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const [hours, setHours] = useState<string[]>([]);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursError, setHoursError] = useState('');
  const [audit, setAudit] = useState<
    { ID: string; NGUOISUA: string; THOIDIEM: string; NOIDUNG: string }[]
  >([]);
  const [auditError, setAuditError] = useState('');

  // Lấy danh sách chung từ backend để admin và mobile không lệch lý do hủy.
  useEffect(() => {
    if (action !== 'edit') return;
    let active = true;
    setCancellationReasons([]);
    bookingApi
      .getCancellationReasons()
      .then((response) => {
        if (!response.data.success) throw new Error('Không thể tải lý do hủy.');
        if (active) setCancellationReasons(response.data.data);
      })
      .catch((err) => {
        if (active) setFormError(errorMessage(err));
      });
    return () => {
      active = false;
    };
  }, [action]);

  useEffect(() => {
    const timer = setInterval(() => setReload((value) => value + 1), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    setAudit([]);
    setAuditError('');
    if (action !== 'view' || !selected || !canCreate) return;
    const controller = new AbortController();
    axiosClient
      .get(`/api/lichhen/operations/${selected.MALICH}/history`, { signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setAudit(response.data.data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setAuditError(errorMessage(err));
      });
    return () => controller.abort();
  }, [action, selected, canCreate]);

  // Tìm ở server trên toàn bộ kết quả, không chỉ trong trang đang hiển thị.
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setQuery((previous) =>
          previous.search === searchTerm.trim()
            ? previous
            : { ...previous, search: searchTerm.trim(), page: 1 },
        ),
      300,
    );
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    bookingApi
      .getAdminList(query, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [query, reload]);

  // Chỉ lấy dữ liệu cho form khi cần tạo lịch hoặc thêm dịch vụ.
  useEffect(() => {
    if (action !== 'add' && action !== 'details') return;
    let active = true;
    setFormLoading(true);
    Promise.all([
      dichVuApi.getAllDichVuClient(),
      action === 'add' ? customerApi.getAll() : Promise.resolve(null),
    ])
      .then(([serviceResponse, customerResponse]) => {
        if (!active) return;
        setServices(serviceResponse.data.data);
        if (customerResponse) setCustomers(customerResponse.data.data);
      })
      .catch((err) => {
        if (active) setFormError(errorMessage(err));
      })
      .finally(() => {
        if (active) setFormLoading(false);
      });
    return () => {
      active = false;
    };
  }, [action]);

  // Sau phân trang không thể suy ra giờ trống từ bảng; lấy từ API availability.
  useEffect(() => {
    const controller = new AbortController();
    setHours([]);
    setHoursError('');
    setHoursLoading(false);
    if (action !== 'add') return () => controller.abort();
    setForm((previous) => ({ ...previous, time: '' }));
    if (
      !form.branchId ||
      !form.staffId ||
      !form.serviceId ||
      !form.date ||
      Number(form.quantity) < 1
    )
      return () => controller.abort();
    setHoursLoading(true);
    bookingApi
      .availability(
        {
          branchId: form.branchId,
          staffId: form.staffId,
          serviceId: form.serviceId,
          date: form.date,
          quantity: Number(form.quantity),
        },
        controller.signal,
      )
      .then((response) => {
        if (!controller.signal.aborted)
          setHours(response.data.data.slots.map((slot: { time: string }) => slot.time));
      })
      .catch((err) => {
        if (!controller.signal.aborted) setHoursError(errorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setHoursLoading(false);
      });
    return () => controller.abort();
  }, [action, form.branchId, form.staffId, form.serviceId, form.date, form.quantity]);

  function filter(values: Partial<AdminBookingQuery>) {
    setQuery((previous) => ({ ...previous, ...values, page: 1 }));
  }
  function changeMode(mode: 'days' | 'archive') {
    setRangeError('');
    const today = result?.today || '';
    setRange({ start: today, end: today });
    filter({ mode, start: mode === 'days' ? '' : today, end: mode === 'days' ? '' : today });
  }
  function applyRange(event: React.FormEvent) {
    event.preventDefault();
    if (!range.start || !range.end || range.start > range.end) {
      setRangeError('Chọn khoảng ngày hợp lệ: từ ngày không được sau đến ngày.');
      return;
    }
    setRangeError('');
    filter(range);
  }
  function clearFilters() {
    setSearchTerm('');
    filter({ status: '', branchId: '', staffId: '', search: '' });
  }
  function openAction(next: Action, row: AdminBooking | null = null) {
    setSelectedReason('');
    setSelected(row);
    setFormError('');
    setFormLoading(next === 'add' || next === 'details');
    const status = row ? normalizeStatus(row.TRANGTHAI) : '';
    setForm({
      ...emptyForm,
      id: row?.MALICH.trim() || '',
      branchId: row?.MACHINHANH.trim() || query.branchId,
      date: row
        ? row.NGAYHEN.slice(0, 10)
        : query.mode === 'days'
          ? query.start || result?.today || ''
          : result?.today || '',
      status: transitions[status]?.[0] || '',
    });
    setAction(next);
  }
  function closeModal() {
    if (!saveLock.current) setAction(null);
  }
  function changeForm(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'branchId' ? { staffId: '', time: '' } : {}),
    }));
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    setFormError('');
    try {
      if (action === 'edit' && selected) {
        let reason = '';
        if (form.status === 'Đã huỷ') {
          if (!cancellationReasons.includes(selectedReason))
            throw new Error('Vui lòng chọn lý do hủy.');
          if (selectedReason === 'Khác' && !form.note.trim())
            throw new Error('Vui lòng nhập lý do khác.');
          reason = selectedReason === 'Khác' ? `Khác: ${form.note.trim()}` : selectedReason;
          if (reason.length > 200) throw new Error('Lý do hủy tối đa 200 ký tự.');
        }
        await bookingApi.update(selected.MALICH.trim(), form.status, reason);
      } else if (action === 'delete' && selected) {
        await bookingApi.deleteFull(selected.MALICH.trim());
      } else if (action === 'add' || action === 'details') {
        const service = services.find((item) => item.MADV.trim() === form.serviceId);
        if (
          !service ||
          !form.staffId ||
          !Number.isInteger(Number(form.quantity)) ||
          Number(form.quantity) < 1
        )
          throw new Error('Vui lòng chọn dịch vụ, stylist và số lượng hợp lệ.');
        const details = {
          MALICH: form.id,
          MADV: form.serviceId,
          MANV: form.staffId,
          SOLUONG: Number(form.quantity),
          GIA_DUKIEN: Math.round(service.GIADV * Number(form.quantity)),
          GHICHU: form.note,
        };
        if (action === 'add') {
          if (!hours.includes(form.time)) throw new Error('Vui lòng chọn giờ trống.');
          await bookingApi.createFull({
            booking: {
              MALICH: form.id,
              MAKH: form.customerId,
              MACHINHANH: form.branchId,
              NGAYHEN: form.date,
              GIOHEN: form.time,
              TRANGTHAI: 'Đã đặt',
            },
            details,
          });
        } else await bookingApi.createCT(details);
      }
      toast.success('Đã lưu thay đổi lịch hẹn.');
      setAction(null);
      // Giữ bộ lọc và trang, server tự lùi trang nếu trang cuối vừa hết dữ liệu.
      setReload((value) => value + 1);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  const currentPage = result?.page || 1;
  const visibleStylists = (result?.stylists || []).filter(
    (item) => !query.branchId || item.MACHINHANH?.trim() === query.branchId,
  );
  const formStylists = (result?.stylists || []).filter(
    (item) => item.MACHINHANH?.trim() === form.branchId,
  );
  const allCount = Object.values(result?.statusCounts || {}).reduce((sum, count) => sum + count, 0);
  const title = {
    add: 'Thêm lịch hẹn',
    details: 'Thêm dịch vụ',
    edit: 'Cập nhật trạng thái',
    delete: 'Xóa lịch đã hủy',
    view: 'Chi tiết lịch hẹn',
  };
  const selectedStatus = selected ? normalizeStatus(selected.TRANGTHAI) : '';

  return (
    <div id="bookings" className="section booking-admin">
      <header className="ba-heading">
        <div>
          <p className="ba-eyebrow">QUẢN LÝ SALON</p>
          <h2>Lịch hẹn</h2>
          <p>Theo dõi lịch từng ngày và sắp xếp công việc cho stylist.</p>
        </div>
        <div className="ba-actions">
          <button className="ba-button" onClick={() => setReload((value) => value + 1)}>
            Làm mới
          </button>
          {canCreate && (
            <button
              className="ba-button ba-primary"
              disabled={!result}
              onClick={() => openAction('add')}
            >
              + Thêm lịch hẹn
            </button>
          )}
        </div>
      </header>
      {canCreate && (
        <SalonOperationsPanel
          branches={result?.branches || []}
          revision={reload}
          requestedBooking={rescheduleBooking}
          onChanged={() => setReload((value) => value + 1)}
        />
      )}
      <div className="ba-modes" aria-label="Chế độ xem">
        <button aria-pressed={query.mode === 'days'} onClick={() => changeMode('days')}>
          5 ngày đặt lịch
        </button>
        <button aria-pressed={query.mode === 'archive'} onClick={() => changeMode('archive')}>
          Tra cứu theo khoảng ngày
        </button>
      </div>
      {query.mode === 'days' ? (
        <div className="ba-days" aria-label="Chọn ngày hẹn">
          {(result?.days || []).map((day) => (
            <button
              key={day.date}
              aria-pressed={(query.start || result?.today) === day.date}
              onClick={() => filter({ start: day.date })}
            >
              <span>
                {day.date === result?.today
                  ? 'Hôm nay'
                  : new Date(day.date + 'T00:00:00Z').toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      timeZone: 'UTC',
                    })}
              </span>
              <strong>{dateLabel(day.date)}</strong>
              <small>{loading ? '…' : `${day.count} lịch hẹn`}</small>
            </button>
          ))}
        </div>
      ) : (
        <form className="ba-range" onSubmit={applyRange}>
          <label>
            Từ ngày
            <input
              type="date"
              required
              value={range.start}
              onChange={(event) => setRange({ ...range, start: event.target.value })}
            />
          </label>
          <label>
            Đến ngày
            <input
              type="date"
              required
              value={range.end}
              onChange={(event) => setRange({ ...range, end: event.target.value })}
            />
          </label>
          <button className="ba-button ba-primary">Áp dụng</button>
          {rangeError && (
            <p role="alert" className="ba-error">
              {rangeError}
            </p>
          )}
        </form>
      )}
      <section className="ba-card">
        <div className="ba-filters">
          <label className="ba-search">
            Tìm lịch hẹn
            <input
              maxLength={100}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Mã lịch, tên hoặc số điện thoại"
            />
          </label>
          <label>
            Chi nhánh
            <select
              value={query.branchId}
              onChange={(event) => filter({ branchId: event.target.value, staffId: '' })}
            >
              <option value="">Tất cả chi nhánh</option>
              {result?.branches.map((item) => (
                <option key={item.MACHINHANH} value={item.MACHINHANH.trim()}>
                  {item.TENCHINHANH || item.MACHINHANH}
                </option>
              ))}
            </select>
          </label>
          <label>
            Stylist
            <select
              value={query.staffId}
              onChange={(event) => filter({ staffId: event.target.value })}
            >
              <option value="">{role === 3 ? 'Lịch được giao cho tôi' : 'Tất cả stylist'}</option>
              {visibleStylists.map((item) => (
                <option key={item.MANV} value={item.MANV.trim()}>
                  {item.HOTEN}
                </option>
              ))}
            </select>
          </label>
          <label>
            Trạng thái
            <select
              value={query.status}
              onChange={(event) => filter({ status: event.target.value })}
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <button className="ba-button" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
        <div className="ba-status-filters" aria-label="Lọc nhanh theo trạng thái">
          {['', ...statuses].map((status, index) => (
            <button
              key={status}
              aria-pressed={query.status === status}
              onClick={() => filter({ status })}
            >
              <span className={`ba-dot ba-dot-${index}`} />
              {status || 'Tất cả'}{' '}
              <b>{loading ? '…' : status ? result?.statusCounts[status] || 0 : allCount}</b>
            </button>
          ))}
        </div>
        <div className="ba-list-heading">
          <h3>
            {result
              ? result.start === result.end
                ? `Lịch ngày ${dateLabel(result.start)}`
                : `${dateLabel(result.start)} – ${dateLabel(result.end)}`
              : 'Danh sách lịch hẹn'}
          </h3>
          <span>Bộ đếm theo chi nhánh, stylist và tìm kiếm</span>
        </div>
        {loading ? (
          <div className="ba-empty" role="status">
            Đang tải lịch hẹn…
          </div>
        ) : error ? (
          <div className="ba-empty ba-error" role="alert">
            {error}
            <button className="ba-button" onClick={() => setReload((value) => value + 1)}>
              Thử lại
            </button>
          </div>
        ) : !result?.items.length ? (
          <div className="ba-empty">
            <strong>Không có lịch hẹn phù hợp</strong>
            <p>Chọn ngày khác hoặc xóa bộ lọc để xem thêm.</p>
          </div>
        ) : (
          <div className="ba-table-scroll">
            <table className="ba-table">
              <thead>
                <tr>
                  <th>Giờ hẹn</th>
                  <th>Khách hàng</th>
                  <th>Dịch vụ / Stylist</th>
                  <th>Chi nhánh</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((row) => {
                  const status = normalizeStatus(row.TRANGTHAI);
                  return (
                    <tr key={row.MALICH}>
                      <td>
                        <strong className="ba-time">{timeLabel(row.GIOHEN)}</strong>
                        <small>{dateLabel(row.NGAYHEN)}</small>
                        <small>{row.MALICH.trim()}</small>
                      </td>
                      <td>
                        <strong>{row.KHACHHANG?.HOTEN || row.MAKH}</strong>
                        <small>{row.KHACHHANG?.SDT || 'Chưa có SĐT'}</small>
                      </td>
                      <td>
                        {row.CHITIETLICHHEN.length ? (
                          row.CHITIETLICHHEN.map((detail) => (
                            <div className="ba-service" key={detail.MADV}>
                              <strong>{detail.DICHVU?.TENDV || detail.MADV}</strong>
                              <small>
                                {detail.NHANVIEN?.HOTEN || 'Chưa phân công'} · SL{' '}
                                {detail.SOLUONG || 1}
                              </small>
                            </div>
                          ))
                        ) : (
                          <small>Chưa có dịch vụ</small>
                        )}
                      </td>
                      <td>{row.CHINHANH?.TENCHINHANH || row.MACHINHANH}</td>
                      <td>
                        <span className={`ba-status ba-status-${statuses.indexOf(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="ba-row-actions">
                          <button onClick={() => openAction('view', row)}>Chi tiết</button>
                          {canCreate && ['Đã đặt', 'Đang chờ', 'Đã đến'].includes(status) && (
                            <button
                              disabled={saving}
                              onClick={() => setRescheduleBooking({ ...row })}
                            >
                              Đổi giờ
                            </button>
                          )}
                          {canUpdate && transitions[status] && (
                            <button onClick={() => openAction('edit', row)}>Cập nhật</button>
                          )}
                          {canCreate &&
                            ['Đã đặt', 'Đang chờ', 'Đã đến', 'Đang thực hiện'].includes(status) && (
                              <button onClick={() => openAction('details', row)}>+ Dịch vụ</button>
                            )}
                          {canDelete && status === 'Đã huỷ' && (
                            <button className="ba-danger" onClick={() => openAction('delete', row)}>
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <footer className="ba-pagination">
          <label>
            Số lịch mỗi trang
            <select
              value={query.pageSize}
              onChange={(event) => filter({ pageSize: Number(event.target.value) })}
            >
              {[10, 20, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <span aria-live="polite">
            {loading
              ? 'Đang tải…'
              : error
                ? 'Chưa tải được kết quả'
                : `${result?.total ? (currentPage - 1) * query.pageSize + 1 : 0}–${Math.min(currentPage * query.pageSize, result?.total || 0)} / ${result?.total || 0} lịch`}
          </span>
          <div className="ba-actions">
            <button
              className="ba-button"
              disabled={loading || !!error || currentPage <= 1}
              onClick={() => setQuery({ ...query, page: currentPage - 1 })}
            >
              Trước
            </button>
            <span>
              Trang {currentPage}/{result?.totalPages || 1}
            </span>
            <button
              className="ba-button"
              disabled={loading || !!error || currentPage >= (result?.totalPages || 1)}
              onClick={() => setQuery({ ...query, page: currentPage + 1 })}
            >
              Sau
            </button>
          </div>
        </footer>
      </section>
      <Modal isOpen={action !== null} onClose={closeModal} title={action ? title[action] : ''}>
        {action === 'view' && selected ? (
          <div className="ba-detail">
            <p>
              <strong>{selected.MALICH.trim()}</strong> · {timeLabel(selected.GIOHEN)} ·{' '}
              {dateLabel(selected.NGAYHEN)}
            </p>
            <p>
              {selected.KHACHHANG?.HOTEN} · {selected.KHACHHANG?.SDT}
            </p>
            <p>
              {selected.CHINHANH?.TENCHINHANH} · {selectedStatus}
            </p>
            <p>Loại lịch: {selected.LOAILICH === 'WALK_IN' ? 'Khách trực tiếp' : 'Đặt trước'}</p>
            {(
              [
                ['Khách đến', selected.THOIGIANDEN],
                ['Bắt đầu thực tế', selected.BATDAUTHUCTE],
                ['Kết thúc dự kiến', selected.KETTHUCDUKIEN],
                ['Hoàn thành', selected.KETTHUCTHUCTE],
              ] as const
            ).map(([label, value]) => (
              <p key={label}>
                {label}:{' '}
                {value
                  ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                  : 'Chưa ghi nhận'}
              </p>
            ))}
            {selected.LYDOHUY && <p>Lý do hủy: {selected.LYDOHUY}</p>}
            {selected.CHITIETLICHHEN.map((detail) => (
              <div className="ba-detail-item" key={detail.MADV}>
                <strong>{detail.DICHVU?.TENDV || detail.MADV}</strong>
                <p>
                  {detail.NHANVIEN?.HOTEN || 'Chưa phân công'} · Số lượng: {detail.SOLUONG || 1} ·{' '}
                  {(detail.GIA_DUKIEN || 0).toLocaleString('vi-VN')} đ
                </p>
                <p>Ghi chú: {detail.GHICHU || 'Không có'}</p>
              </div>
            ))}
            {!selected.CHITIETLICHHEN.length && <p>Chưa có chi tiết dịch vụ.</p>}
            {canCreate && (
              <>
                <h4>Lịch sử xử lý</h4>
                {auditError && <p role="alert">{auditError}</p>}
                {audit.map((item) => (
                  <p key={item.ID}>
                    {new Date(item.THOIDIEM).toLocaleString('vi-VN', {
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })}{' '}
                    · {item.NGUOISUA}: {item.NOIDUNG}
                  </p>
                ))}
              </>
            )}
          </div>
        ) : (
          <form className="ba-form" onSubmit={submit}>
            {formLoading && <p role="status">Đang tải dữ liệu form…</p>}
            {(action === 'add' || action === 'details') && (
              <>
                {action === 'add' && (
                  <>
                    <label>
                      Mã lịch (để trống để tự tạo)
                      <input name="id" maxLength={20} value={form.id} onChange={changeForm} />
                    </label>
                    <label>
                      Chi nhánh
                      <select name="branchId" required value={form.branchId} onChange={changeForm}>
                        <option value="">Chọn chi nhánh</option>
                        {result?.branches.map((item) => (
                          <option key={item.MACHINHANH} value={item.MACHINHANH.trim()}>
                            {item.TENCHINHANH || item.MACHINHANH}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Khách hàng
                      <select
                        name="customerId"
                        required
                        value={form.customerId}
                        onChange={changeForm}
                      >
                        <option value="">Chọn khách hàng</option>
                        {customers.map((item) => (
                          <option key={item.MAKH} value={item.MAKH.trim()}>
                            {item.HOTEN} · {item.SDT}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                <label>
                  Dịch vụ
                  <select name="serviceId" required value={form.serviceId} onChange={changeForm}>
                    <option value="">Chọn dịch vụ</option>
                    {services.map((item) => (
                      <option key={item.MADV} value={item.MADV.trim()}>
                        {item.TENDV} · {item.THOIGIAN} phút
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Stylist
                  <select name="staffId" required value={form.staffId} onChange={changeForm}>
                    <option value="">Chọn stylist</option>
                    {formStylists.map((item) => (
                      <option key={item.MANV} value={item.MANV.trim()}>
                        {item.HOTEN}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Số lượng
                  <input
                    name="quantity"
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={form.quantity}
                    onChange={changeForm}
                  />
                </label>
                {action === 'add' && (
                  <>
                    <label>
                      Ngày hẹn
                      <input
                        name="date"
                        type="date"
                        min={result?.today}
                        max={result?.lastDay}
                        required
                        value={form.date}
                        onChange={changeForm}
                      />
                    </label>
                    <label>
                      Giờ trống
                      <select
                        name="time"
                        required
                        disabled={hoursLoading}
                        value={form.time}
                        onChange={changeForm}
                      >
                        <option value="">
                          {hoursLoading ? 'Đang tải giờ…' : 'Chọn giờ trống'}
                        </option>
                        {hours.map((time) => (
                          <option key={time}>{time}</option>
                        ))}
                      </select>
                    </label>
                    {hoursError && (
                      <p className="ba-error" role="alert">
                        {hoursError}
                      </p>
                    )}
                  </>
                )}
                <label>
                  Ghi chú
                  <textarea name="note" maxLength={200} value={form.note} onChange={changeForm} />
                </label>
              </>
            )}
            {action === 'edit' && (
              <>
                <p>
                  Lịch {selected?.MALICH} hiện đang: <strong>{selectedStatus}</strong>
                </p>
                <p>
                  Khi khách có mặt, chọn “Đã đến”. Lịch chưa đến sẽ tự hủy nếu quá giờ hẹn 10 phút.
                </p>
                <label>
                  Chuyển trạng thái
                  <select name="status" required value={form.status} onChange={changeForm}>
                    {(transitions[selectedStatus] || []).map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {action === 'edit' && form.status === 'Đã huỷ' && (
              <>
                <label>
                  Lý do hủy
                  <select
                    required
                    disabled={saving}
                    value={selectedReason}
                    onChange={(event) => setSelectedReason(event.target.value)}
                  >
                    <option value="">-- Chọn lý do hủy --</option>
                    {cancellationReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedReason === 'Khác' && (
                  <label>
                    Lý do khác
                    <textarea
                      name="note"
                      required
                      maxLength={194}
                      disabled={saving}
                      value={form.note}
                      onChange={changeForm}
                      placeholder="Nhập lý do hủy..."
                    />
                  </label>
                )}
              </>
            )}
            {action === 'delete' && (
              <p>
                Xóa lịch đã hủy <strong>{selected?.MALICH}</strong> và các chi tiết của lịch này?
              </p>
            )}
            {formError && (
              <p role="alert" className="ba-error">
                {formError}
              </p>
            )}
            <div className="ba-actions">
              <button type="button" className="ba-button" disabled={saving} onClick={closeModal}>
                Đóng
              </button>
              <button
                className="ba-button ba-primary"
                disabled={saving || formLoading || (action === 'add' && hoursLoading)}
              >
                {saving ? 'Đang lưu…' : action === 'delete' ? 'Xác nhận xóa' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

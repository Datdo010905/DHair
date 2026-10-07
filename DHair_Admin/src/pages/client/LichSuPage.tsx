import '../../assets/css/booking-admin.css';
import '../../assets/css/lichsu.css';
import { Link, Navigate } from 'react-router-dom';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Modal from '../../components/ui/Modal';
import { toast } from 'react-toastify';
import bookingApi, { Booking, BookingDetails } from '../../api/bookingApi';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import staffApi, { NhanVien } from '../../api/staffApi';
import axios from 'axios';

const LichSuPage = () => {
  //check đã đăng nhập
  const user = localStorage.getItem('username');
  const role = localStorage.getItem('phanquyen');

  const [modalType, setModalType] = useState<'add' | 'addDetails' | 'edit' | 'none'>('none');
  const [IDtoView, setIDtoView] = useState<string | null>(null); // Lưu ID cần xem chi tiết
  const [viewDetailsList, setViewDetailsList] = useState<BookingDetails[]>([]);

  //Dữ liệu
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
  const [nhanVienList, setNhanVienList] = useState<NhanVien[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const saveLock = useRef(false);
  const detailVersion = useRef(0);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const statuses = ['Đã đặt', 'Đang chờ', 'Đang thực hiện', 'Hoàn thành', 'Đã huỷ', 'Đã đến'];
  const normalizeStatus = (value: string) =>
    value?.trim() === 'Đã hủy'
      ? 'Đã huỷ'
      : value?.trim() === 'Đã hoàn thành'
        ? 'Hoàn thành'
        : value?.trim();
  const matching = bookingList
    .filter((row) => {
      const date = row.NGAYHEN?.slice(0, 10) || '';
      return (
        [row.MALICH, row.MACHINHANH]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase()) &&
        (!dateRange.start || date >= dateRange.start) &&
        (!dateRange.end || (!!date && date <= dateRange.end))
      );
    })
    .sort(
      (a, b) =>
        (b.NGAYHEN || '').localeCompare(a.NGAYHEN || '') ||
        (b.GIOHEN || '').localeCompare(a.GIOHEN || ''),
    );
  const filtered = matching.filter(
    (row) => !statusFilter || normalizeStatus(row.TRANGTHAI) === statusFilter,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateRange, pageSize]);
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const [formData, setFormData] = useState({
    bookingID: '',
    customerID: '',
    branchID: '',
    bookingDate: '',
    bookingTime: '',
    status: '',
    dichvu: '',
    soluong: '',
    nhanvien: '',
  });
  const [formDataDetails, setFormDataDetails] = useState({
    bookingID: '',
    branchID: '',
    dichvu: '',
    soluong: '',
    giadukien: '',
    nhanvien: '',
    ghichu: '',
  });
  const [formDataTK, setFormDataTK] = useState({
    start: '',
    end: '',
  });
  //up data từ api lên bảng
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (user) {
        const [resBooking, history] = await Promise.all([
          bookingApi.getAllByIdKH(user),
          bookingApi.getCustomerHistory(),
        ]);
        if (!history.data.success) throw new Error();
        setCancellationReasons(history.data.data.cancellationReasons);
        if (!resBooking.data.success) throw new Error();
        setBookingList(resBooking.data.data || []);

        const [resDichVu, resCSD, resNhanVien] = await Promise.all([
          dichVuApi.getAll(),
          dichVuApi.getAllCSD(),
          staffApi.getAll(),
        ]);
        if (resDichVu.data.success) {
          setDichVuList([...(resDichVu.data.data || []), ...(resCSD.data.data || [])]);
        }
        if (resNhanVien.data.success) {
          setNhanVienList(resNhanVien.data.data);
        }
      }
    } catch (err) {
      setError('Không thể tải lịch sử lịch hẹn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [user]);
  // Tải dữ liệu khi component mount
  useEffect(() => {
    if (user || role) {
      fetchData();
    }
  }, [user, role, fetchData]);

  useEffect(() => {
    // kiểm tra khi bookingList đã fetch
    if (bookingList && bookingList.length > 0) {
      const checkDangCho = bookingList.filter((lh) => lh.TRANGTHAI.trim() === 'Đang chờ');

      if (checkDangCho.length > 0) {
        toast.info('Bạn có lịch hẹn đã được duyệt, hãy đến dùng dịch vụ!', {
          toastId: 'thong-bao-dang-cho', //chỉ hiện 1 lần dù có nhiều lịch hẹn đang chờ
        });
      }
    }
  }, [bookingList]); // Chạy khi bookingList thay đổi

  if (!user && !role) {
    return <Navigate to="/login" replace />;
  }

  const handleViewClick = async (row: Booking) => {
    const version = ++detailVersion.current;
    setViewDetailsList([]);
    setDetailsLoading(true);
    try {
      setIDtoView(row.MALICH?.trim() || null);

      const view = await bookingApi.getByIdCT(row.MALICH?.trim() || '');
      if (version !== detailVersion.current) return;
      if (view.data.success) {
        const responseData = view.data.data;
        // Nếu là mảng thì giữ nguyên, không thì bọc []
        const formattedData = Array.isArray(responseData) ? responseData : [responseData];

        setViewDetailsList(formattedData);
        //toast.info(`Xem chi tiết lịch hẹn: ${row.MALICH}`);
      } else {
        toast.error('Không tìm thấy chi tiết lịch hẹn!');
        setViewDetailsList([]); // Xóa rỗng bảng nếu không có data
      }
    } catch (error) {
      if (version !== detailVersion.current) return;
      console.error('Lỗi xem chi tiết:', error);
      toast.error('Xem chi tiết thất bại!');
      setViewDetailsList([]); // Xóa rỗng bảng nếu không có data
    } finally {
      if (version === detailVersion.current) setDetailsLoading(false);
    }
  };
  const getChiNhanhName = (branchCode: string) => {
    switch (branchCode) {
      case 'CN001':
        return 'DHair - Nguyễn Trãi';
      case 'CN002':
        return 'DHair - Cầu Giấy';
      case 'CN003':
        return 'DHair - Tân Bình';
      case 'CN004':
        return 'DHair - Đà Nẵng';
      default:
        return 'Không xác định';
    }
  };
  //xử lý thay đổi form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    // Cập nhật dữ liệu người dùng nhập vào formData
    setFormDataDetails((prev) => ({ ...prev, [id]: value }));
    setFormDataTK((prev) => ({ ...prev, [id]: value }));
  };
  const handleDeleteClick = (row: Booking) => {
    setSelectedReason('');
    setFormData({
      bookingID: row.MALICH?.trim() || '',
      customerID: row.MAKH?.trim() || '',
      branchID: row.MACHINHANH?.trim() || '',
      bookingTime: row.GIOHEN?.trim() || '',
      bookingDate: row.NGAYHEN ? row.NGAYHEN.split('T')[0] : '',
      status: row.TRANGTHAI?.trim() || '',
      dichvu: '', //tạm để trống
      soluong: '', //tạm để trống
      nhanvien: '', //tạm để trống
    });
    setFormDataDetails({
      bookingID: '',
      branchID: '',
      dichvu: '',
      soluong: '',
      giadukien: '',
      nhanvien: '',
      ghichu: '',
    });

    setModalType('edit');
  };

  // huỷ lịch
  const handleDeleteConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    //tạo FormData theo swagger

    const trangthaiHienTai = bookingList
      .find((b) => b.MALICH?.trim() === formData.bookingID)
      ?.TRANGTHAI?.trim();
    try {
      if (modalType === 'edit') {
        if (!cancellationReasons.includes(selectedReason)) {
          toast.info('Vui lòng chọn lý do hủy lịch!');
          return;
        }
        if (selectedReason === 'Khác' && !formDataDetails.ghichu.trim()) {
          toast.info('Vui lòng nhập lý do hủy.');
          return;
        }
        if (trangthaiHienTai !== 'Đã đặt') {
          toast.error('Chỉ có thể hủy lịch ở trạng thái Đã đặt!');
          return;
        }
        // API chung với mobile lưu lý do và trạng thái trong cùng một giao dịch.
        const response = await bookingApi.cancelAppointment(
          formData.bookingID,
          selectedReason,
          selectedReason === 'Khác' ? formDataDetails.ghichu.trim() : '',
        );
        if (!response.data.success) throw new Error(response.data.message || 'Không thể hủy lịch.');
        toast.success('Huỷ lịch hẹn thành công!');
      }
      setModalType('none'); // Đóng form
      fetchData(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              'Chưa xác nhận được kết quả hủy. Vui lòng tải lại danh sách.'
          : error instanceof Error
            ? error.message
            : 'Không thể hủy lịch.',
      );
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  const handleClickReport = () => {
    if (formDataTK.start && formDataTK.end && formDataTK.start > formDataTK.end) {
      toast.warn('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
      return;
    }
    setDateRange({ ...formDataTK });
  };
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
    setFormDataTK({ start: '', end: '' });
  };

  return (
    <div className="booking-history booking-admin">
      <header className="ba-heading">
        <div>
          <p className="ba-eyebrow">LỊCH HẸN CỦA BẠN</p>
          <h2>Lịch sử lịch hẹn</h2>
          <p>Theo dõi lịch hẹn và xem lại các dịch vụ đã đặt tại DHair.</p>
        </div>
        <div className="ba-actions">
          <button className="ba-button" disabled={loading} onClick={fetchData}>
            Làm mới
          </button>
          <Link className="ba-button ba-primary" to="/datlich">
            + Đặt lịch mới
          </Link>
        </div>
      </header>
      <section className="ba-card" aria-label="Lịch sử lịch hẹn" aria-busy={loading}>
        <div className="ba-filters">
          <label className="ba-search">
            Tìm lịch hẹn
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mã lịch hoặc mã chi nhánh…"
            />
          </label>
          <label>
            Từ ngày
            <input
              type="date"
              value={formDataTK.start}
              onChange={(e) => setFormDataTK((prev) => ({ ...prev, start: e.target.value }))}
            />
          </label>
          <label>
            Đến ngày
            <input
              type="date"
              value={formDataTK.end}
              onChange={(e) => setFormDataTK((prev) => ({ ...prev, end: e.target.value }))}
            />
          </label>
          <button className="ba-button ba-primary" onClick={handleClickReport}>
            Áp dụng ngày
          </button>
          <button className="ba-button" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
        <div className="ba-status-filters" aria-label="Lọc trạng thái">
          {['', ...statuses].map((status, index) => (
            <button
              key={status}
              aria-pressed={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              <span className={`ba-dot ba-dot-${index}`} />
              {status || 'Tất cả'}{' '}
              <b>
                {loading || error
                  ? '…'
                  : matching.filter((row) => !status || normalizeStatus(row.TRANGTHAI) === status)
                      .length}
              </b>
            </button>
          ))}
        </div>
        <div className="ba-list-heading">
          <h3>Danh sách lịch hẹn</h3>
          <span>
            {dateRange.start || dateRange.end
              ? `${dateRange.start || 'Từ đầu'} — ${dateRange.end || 'Đến nay'} · `
              : ''}
            Mới nhất trước
          </span>
        </div>
        {loading ? (
          <div className="ba-empty" role="status">
            Đang tải lịch hẹn…
          </div>
        ) : error ? (
          <div className="ba-empty ba-error" role="alert">
            {error}
            <button className="ba-button" onClick={fetchData}>
              Thử lại
            </button>
          </div>
        ) : !pageItems.length ? (
          <div className="ba-empty">
            <strong>Chưa có lịch hẹn phù hợp</strong>
            <p>Thử thay đổi bộ lọc hoặc đặt lịch mới.</p>
            <Link className="ba-button ba-primary" to="/datlich">
              Đặt lịch
            </Link>
          </div>
        ) : (
          <div className="ba-table-scroll">
            <table className="ba-table">
              <thead>
                <tr>
                  <th>Ngày / Giờ hẹn</th>
                  <th>Mã lịch</th>
                  <th>Chi nhánh</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.MALICH}>
                    <td>
                      <strong className="ba-time">
                        {row.GIOHEN?.includes('T')
                          ? row.GIOHEN.split('T')[1].slice(0, 5)
                          : row.GIOHEN?.slice(0, 5)}
                      </strong>
                      <small>
                        {row.NGAYHEN ? new Date(row.NGAYHEN).toLocaleDateString('vi-VN') : '—'}
                      </small>
                    </td>
                    <td>{row.MALICH}</td>
                    <td>{getChiNhanhName(row.MACHINHANH?.trim())}</td>
                    <td>
                      <span
                        className={`ba-status ba-status-${statuses.indexOf(normalizeStatus(row.TRANGTHAI))}`}
                      >
                        {normalizeStatus(row.TRANGTHAI) || 'Chưa xác định'}
                      </span>
                    </td>
                    <td>
                      <div className="ba-row-actions">
                        <button onClick={() => handleViewClick(row)}>Chi tiết</button>
                        {normalizeStatus(row.TRANGTHAI) === 'Đã đặt' && (
                          <button className="ba-danger" onClick={() => handleDeleteClick(row)}>
                            Hủy lịch
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <footer className="ba-pagination">
          <span>
            {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–
            {Math.min(currentPage * pageSize, filtered.length)} / {filtered.length} lịch hẹn
          </span>
          <label>
            Số dòng
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 20, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <div className="ba-actions">
            <button
              className="ba-button"
              disabled={loading || !!error || currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Trước
            </button>
            <span>
              Trang {currentPage}/{totalPages}
            </span>
            <button
              className="ba-button"
              disabled={loading || !!error || currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </footer>
      </section>
      <Modal
        isOpen={!!IDtoView}
        onClose={() => {
          detailVersion.current++;
          setIDtoView(null);
        }}
        title={`Chi tiết lịch hẹn ${IDtoView || ''}`}
      >
        <div className="history-details">
          {detailsLoading ? (
            <p role="status">Đang tải chi tiết…</p>
          ) : !viewDetailsList.length ? (
            <p>Chưa có chi tiết để hiển thị.</p>
          ) : (
            viewDetailsList.map((detail) => (
              <article className="ba-detail-item" key={detail.MADV}>
                <strong>
                  {dichVuList.find((item) => item.MADV?.trim() === detail.MADV?.trim())?.TENDV ||
                    detail.MADV}
                </strong>
                <p>
                  Nhân viên:{' '}
                  {nhanVienList.find((item) => item.MANV?.trim() === detail.MANV?.trim())?.HOTEN ||
                    'Chưa phân công'}
                </p>
                <p>
                  Số lượng: {detail.SOLUONG} · Giá dự kiến:{' '}
                  {Number(detail.GIA_DUKIEN || 0).toLocaleString('vi-VN')} ₫
                </p>
                <p>Ghi chú: {detail.GHICHU || 'Không có'}</p>
              </article>
            ))
          )}
          <button
            className="ba-button"
            onClick={() => {
              detailVersion.current++;
              setIDtoView(null);
            }}
          >
            Đóng
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={modalType === 'edit'}
        onClose={() => {
          if (!saving) setModalType('none');
        }}
        title="Hủy lịch hẹn"
      >
        <form className="ba-form" onSubmit={handleDeleteConfirm}>
          <p>
            Bạn muốn hủy lịch <strong>{formData.bookingID}</strong>? Vui lòng cho salon biết lý do.
          </p>
          <label htmlFor="cancel-reason">
            Lý do hủy
            <select
              id="cancel-reason"
              required
              disabled={saving}
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
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
            <label htmlFor="ghichu">
              Lý do khác
              {/* Chừa 6 ký tự cho tiền tố "Khác: " mà backend thêm vào. */}
              <textarea
                id="ghichu"
                required
                maxLength={194}
                disabled={saving}
                value={formDataDetails.ghichu}
                onChange={handleChange}
                placeholder="Nhập lý do hủy..."
              />
            </label>
          )}
          <p>Lý do hủy sẽ thay thế ghi chú của các dịch vụ trong lịch hẹn.</p>

          <div className="ba-actions">
            <button
              type="button"
              className="ba-button"
              disabled={saving}
              onClick={() => setModalType('none')}
            >
              Giữ lịch hẹn
            </button>
            <button type="submit" className="ba-button ba-primary" disabled={saving}>
              {saving ? 'Đang xử lý…' : 'Xác nhận hủy'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default LichSuPage;

import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Modal from '../../components/ui/Modal';
import '../../assets/css/booking-admin.css';
import '../../assets/css/admin-pages.css';
import '../../assets/css/reviews-admin.css';

type Review = {
  MALICH: string;
  SOSAO: number;
  NHANXET: string;
  TAOLUC: string;
  LICHHEN: {
    NGAYHEN: string;
    GIOHEN: string;
    TRANGTHAI: string;
    CHINHANH: { TENCHINHANH: string } | null;
    KHACHHANG: { HOTEN: string } | null;
    CHITIETLICHHEN: {
      MADV: string;
      SOLUONG: number;
      DICHVU: { TENDV: string } | null;
      NHANVIEN: { HOTEN: string } | null;
    }[];
  };
};
type Result = {
  items: Review[];
  branches: { MACHINHANH: string; TENCHINHANH: string | null }[];
  total: number;
  page: number;
  totalPages: number;
  average: number | null;
  positiveRate: number | null;
};
const emptyFilters = { branchId: '', start: '', end: '', rating: '' };

export default function ReviewsPage() {
  const [form, setForm] = useState(emptyFilters);
  const [query, setQuery] = useState({ ...emptyFilters, page: 1 });
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [revision, setRevision] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    axiosClient
      .get('/api/lichhen/reviews', { params: query, signal: controller.signal })
      .then((response) => {
        if (!response.data.success) throw new Error(response.data.message);
        if (!controller.signal.aborted) setData(response.data.data);
      })
      .catch((err) => {
        if (!controller.signal.aborted)
          setError(err.response?.data?.message || 'Không thể tải phản hồi. Vui lòng thử lại.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [query, revision]);

  function apply(event: React.FormEvent) {
    event.preventDefault();
    if (form.start && form.end && form.start > form.end) {
      setFormError('Ngày bắt đầu không được sau ngày kết thúc.');
      return;
    }
    setFormError('');
    setQuery({ ...form, page: 1 });
  }

  const ready = !loading && !error && data;
  return (
    <div className="section admin-page reviews-admin">
      <header className="ba-heading">
        <div>
          <p className="ba-eyebrow">QUẢN LÝ SALON</p>
          <h2>Chăm sóc khách hàng</h2>
          <p>Theo dõi phản hồi và chất lượng trải nghiệm sau mỗi lịch hẹn.</p>
        </div>
        <button
          className="ba-button"
          onClick={() => setRevision((value) => value + 1)}
          disabled={loading}
        >
          Làm mới
        </button>
      </header>
      <div className="reviews-summary" aria-live="polite">
        <article>
          <span>
            <i className="far fa-comment-alt" aria-hidden="true" /> Lượt đánh giá
          </span>
          <strong>{ready ? data.total : '—'}</strong>
          <small>Theo bộ lọc đang áp dụng</small>
        </article>
        <article>
          <span>
            <i className="far fa-star" aria-hidden="true" /> Điểm trung bình
          </span>
          <strong>{ready && data.average !== null ? `${data.average.toFixed(1)}/5` : '—'}</strong>
          <small>Trải nghiệm của cả lịch hẹn</small>
        </article>
        <article>
          <span>
            <i className="far fa-thumbs-up" aria-hidden="true" /> Đánh giá tích cực
          </span>
          <strong>
            {ready && data.positiveRate !== null ? `${data.positiveRate.toFixed(1)}%` : '—'}
          </strong>
          <small>Tỷ lệ phản hồi từ 4 đến 5 sao</small>
        </article>
      </div>
      <section className="ba-card" aria-label="Phản hồi khách hàng" aria-busy={loading}>
        <form className="ba-filters" onSubmit={apply}>
          <label>
            Chi nhánh
            <select
              value={form.branchId}
              onChange={(event) => setForm({ ...form, branchId: event.target.value })}
            >
              <option value="">Tất cả chi nhánh</option>
              {data?.branches.map((branch) => (
                <option key={branch.MACHINHANH} value={branch.MACHINHANH.trim()}>
                  {branch.TENCHINHANH || branch.MACHINHANH}
                </option>
              ))}
            </select>
          </label>
          <label>
            Từ ngày gửi
            <input
              type="date"
              value={form.start}
              onChange={(event) => setForm({ ...form, start: event.target.value })}
            />
          </label>
          <label>
            Đến ngày gửi
            <input
              type="date"
              value={form.end}
              onChange={(event) => setForm({ ...form, end: event.target.value })}
            />
          </label>
          <label>
            Số sao
            <select
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: event.target.value })}
            >
              <option value="">Tất cả số sao</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} sao
                </option>
              ))}
            </select>
          </label>
          <div className="ba-actions">
            <button className="ba-button ba-primary" type="submit">
              Xem phản hồi
            </button>
            <button
              className="ba-button"
              type="button"
              onClick={() => {
                setForm(emptyFilters);
                setQuery({ ...emptyFilters, page: 1 });
                setFormError('');
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
          {formError && (
            <p className="reviews-filter-error" role="alert">
              {formError}
            </p>
          )}
          <p className="reviews-filter-note">
            Thống kê trên toàn bộ kết quả đã lọc. Ngày gửi tính theo giờ Việt Nam.
          </p>
        </form>
        <div className="ba-list-heading">
          <h3>Phản hồi khách hàng</h3>
          <span>{ready ? data.total : '—'} đánh giá</span>
        </div>
        {loading && (
          <div className="ba-empty" role="status">
            Đang tải phản hồi…
          </div>
        )}
        {error && (
          <div className="ba-empty ba-error" role="alert">
            {error}{' '}
            <button className="ba-button" onClick={() => setRevision((value) => value + 1)}>
              Thử lại
            </button>
          </div>
        )}
        {ready && data.items.length === 0 && (
          <div className="ba-empty">
            <i className="far fa-comments" aria-hidden="true" />
            <strong>Chưa có phản hồi phù hợp</strong>
            <p>
              Phản hồi sẽ xuất hiện khi khách đánh giá lịch đã hoàn thành. Bạn có thể thử đổi bộ
              lọc.
            </p>
          </div>
        )}
        {ready && data.items.length > 0 && (
          <div className="ba-table-scroll">
            <table className="ba-table reviews-table">
              <thead>
                <tr>
                  <th scope="col">Khách hàng</th>
                  <th scope="col">Chi nhánh</th>
                  <th scope="col">Đánh giá</th>
                  <th scope="col">Nhận xét</th>
                  <th scope="col">Ngày gửi</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((review) => (
                  <tr key={review.MALICH}>
                    <td>
                      <strong>{review.LICHHEN.KHACHHANG?.HOTEN || 'Khách hàng'}</strong>
                      <small>#{review.MALICH}</small>
                    </td>
                    <td>{review.LICHHEN.CHINHANH?.TENCHINHANH || 'Chưa xác định'}</td>
                    <td>
                      <span
                        className={`ba-status ${review.SOSAO >= 4 ? 'ba-status-3' : review.SOSAO <= 2 ? 'ba-status-4' : 'ba-status-2'}`}
                      >
                        {review.SOSAO}/5 ★
                      </span>
                    </td>
                    <td>
                      <p className="reviews-comment-preview">
                        {review.NHANXET || 'Không có nhận xét'}
                      </p>
                    </td>
                    <td className="reviews-date">
                      {new Date(review.TAOLUC).toLocaleDateString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                      })}
                      <small>
                        {new Date(review.TAOLUC).toLocaleTimeString('vi-VN', {
                          timeZone: 'Asia/Ho_Chi_Minh',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </td>
                    <td>
                      <button
                        className="ba-button"
                        onClick={() => setSelectedReview(review)}
                        aria-label={`Xem phản hồi lịch ${review.MALICH}`}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {ready && (
          <footer className="ba-pagination">
            <span>
              {data.total ? (data.page - 1) * 10 + 1 : 0}–{Math.min(data.page * 10, data.total)} /{' '}
              {data.total} đánh giá
            </span>
            <div className="ba-actions">
              <button
                className="ba-button"
                disabled={data.page <= 1}
                onClick={() => setQuery({ ...query, page: data.page - 1 })}
              >
                Trang trước
              </button>
              <span>
                Trang {data.page}/{data.totalPages}
              </span>
              <button
                className="ba-button"
                disabled={data.page >= data.totalPages}
                onClick={() => setQuery({ ...query, page: data.page + 1 })}
              >
                Trang sau
              </button>
            </div>
          </footer>
        )}
      </section>
      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Chi tiết phản hồi"
      >
        {selectedReview && (
          <div className="reviews-detail">
            <div className="reviews-detail-heading">
              <div>
                <h4>{selectedReview.LICHHEN.KHACHHANG?.HOTEN || 'Khách hàng'}</h4>
                <p>{selectedReview.LICHHEN.CHINHANH?.TENCHINHANH || 'Chưa xác định chi nhánh'}</p>
              </div>
              <span className="ba-status ba-status-2">{selectedReview.SOSAO}/5 ★</span>
            </div>
            <p className="reviews-full-comment">
              {selectedReview.NHANXET || 'Khách chỉ chấm sao, không để lại nhận xét.'}
            </p>
            <p>
              Gửi lúc{' '}
              {new Date(selectedReview.TAOLUC).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
              })}
            </p>
            <div className="reviews-booking">
              <h4>Lịch hẹn #{selectedReview.MALICH}</h4>
              <p>
                {selectedReview.LICHHEN.NGAYHEN.slice(0, 10).split('-').reverse().join('/')} ·{' '}
                {selectedReview.LICHHEN.GIOHEN.slice(11, 16)} · {selectedReview.LICHHEN.TRANGTHAI}
              </p>
              {selectedReview.LICHHEN.CHITIETLICHHEN.map((detail) => (
                <div className="reviews-service" key={detail.MADV}>
                  <strong>
                    {detail.DICHVU?.TENDV || detail.MADV} × {detail.SOLUONG}
                  </strong>
                  <span>Stylist: {detail.NHANVIEN?.HOTEN || 'Chưa phân công'}</span>
                </div>
              ))}
            </div>
            <div className="ba-actions">
              <button className="ba-button" onClick={() => setSelectedReview(null)}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

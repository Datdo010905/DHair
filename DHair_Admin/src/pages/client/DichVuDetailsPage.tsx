import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiScissors } from 'react-icons/fi';
import { toast } from 'react-toastify';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import AdminIcon from '../../components/ui/AdminIcon';
import '../../assets/css/service-details.css';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Chỉ tách bước theo dòng, dấu gạch hoặc dấu gạch có khoảng trắng.
// Giữ dấu phẩy trong câu để không chia một bước thành nhiều phần vụn.
function getProcedureSteps(text: string) {
  return (text || '')
    .split(/\r?\n|-|\s+-\s+/)
    .map((step) => step.trim().replace(/^[-•]\s*/, ''))
    .filter(Boolean);
}

function ServiceImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className="sd-image-fallback" role="img" aria-label={`Chưa có ảnh ${name}`}>
        <AdminIcon icon={FiScissors} />
        <span>DHair · Dịch vụ của bạn</span>
      </div>
    );
  }
  return <img src={src} alt={name} onError={() => setFailed(true)} />;
}

export default function DichVuDetailsPage() {
  const { madv } = useParams<{ madv: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<DichVu | null>(null);
  const [services, setServices] = useState<DichVu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Khi chuyển sang dịch vụ khác, bỏ qua phản hồi cũ để tránh hiện sai nội dung.
    let active = true;
    setLoading(true);
    setError('');
    setService(null);
    window.scrollTo(0, 0);
    if (!madv) {
      setError('Không tìm thấy dịch vụ.');
      setLoading(false);
      return;
    }
    dichVuApi
      .getById(madv)
      .then((response) => {
        if (!response.data.success || !response.data.data) throw new Error();
        if (active) setService(response.data.data);
      })
      .catch(() => {
        if (active) setError('Không thể tải dịch vụ. Vui lòng thử lại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [madv, retryCount]);

  useEffect(() => {
    let active = true;
    // Gợi ý là nội dung bổ sung: lỗi tải danh sách không chặn chi tiết dịch vụ.
    dichVuApi
      .getAllDichVuClient()
      .then((response) => {
        if (active && response.data.success) setServices(response.data.data || []);
      })
      .catch(() => {
        if (active) setServices([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleBooking = () => {
    if (!service || service.TRANGTHAI?.trim() !== 'Đang cung cấp') return;
    // DatLichPage đọc khóa này để chọn sẵn dịch vụ trong biểu mẫu.
    localStorage.setItem('madvCanXem', service.MADV.trim());
    if (!localStorage.getItem('username') || !localStorage.getItem('token')) {
      toast.info('Vui lòng đăng nhập để tiếp tục đặt lịch. Dịch vụ đã được ghi nhớ.');
      navigate('/login');
      return;
    }
    navigate('/datlich');
  };

  if (loading || error || !service) {
    return (
      <div className="dh-service-details">
        <div className="sd-feedback" role={loading ? 'status' : 'alert'}>
          <h1>{loading ? 'Đang tải dịch vụ…' : error || 'Không tìm thấy dịch vụ.'}</h1>
          {!loading && (
            <>
              <button className="sd-primary" onClick={() => setRetryCount((count) => count + 1)}>
                Thử lại
              </button>
              <Link to="/home">Về trang chủ</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const steps = getProcedureSteps(service.QUYTRINH);
  const available = service.TRANGTHAI?.trim() === 'Đang cung cấp';
  const relatedServices = services
    .filter(
      (item) =>
        item.MADV.trim() !== service.MADV.trim() && item.LOAI?.trim() === service.LOAI?.trim(),
    )
    .slice(0, 4);
  const bookingLabel = available ? 'Đặt lịch dịch vụ này' : 'Tạm ngừng cung cấp';

  return (
    <div className="dh-service-details">
      <div className="sd-wrap">
        <nav className="sd-breadcrumb" aria-label="Đường dẫn">
          <Link to="/home">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <Link to="/home#1">Dịch vụ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.TENDV}</span>
        </nav>
        <section className="sd-hero" aria-labelledby="sd-title">
          <div className="sd-hero-image">
            <ServiceImage src={service.HINH} name={service.TENDV} />
          </div>
          <div className="sd-summary">
            <span className="sd-eyebrow">DỊCH VỤ DHAIR</span>
            <h1 id="sd-title">{service.TENDV}</h1>
            <p className="sd-intro">
              {service.MOTA || 'Thông tin mô tả dịch vụ đang được cập nhật.'}
            </p>
            <div className="sd-price-row">
              <div>
                <span className="sd-label">Giá dịch vụ</span>
                <strong className="sd-price">{formatPrice(service.GIADV)}</strong>
              </div>
              <span className="sd-duration">
                <AdminIcon icon={FiClock} aria-hidden="true" />
                {service.THOIGIAN} phút
              </span>
            </div>
            <button
              type="button"
              className="sd-primary sd-book"
              disabled={!available}
              onClick={handleBooking}
            >
              <AdminIcon icon={FiCalendar} aria-hidden="true" />
              {bookingLabel}
              <AdminIcon icon={FiArrowRight} aria-hidden="true" />
            </button>
            <p className="sd-note">Chọn chi nhánh, stylist và giờ hẹn ở bước tiếp theo.</p>
          </div>
        </section>

        <section className="sd-procedure" aria-labelledby="sd-procedure-title">
          <div className="sd-section-heading">
            <span className="sd-eyebrow">TRẢI NGHIỆM TẠI SALON</span>
            <h2 id="sd-procedure-title">Quy trình dịch vụ</h2>
            <p>Từng bước chăm sóc dành cho bạn.</p>
          </div>
          {steps.length > 0 ? (
            <ol className="sd-steps">
              {steps.map((step, index) => (
                <li key={`${index}-${step}`}>
                  <span className="sd-step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>Bước {index + 1}</h3>
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="sd-muted">Quy trình chi tiết đang được cập nhật.</p>
          )}
        </section>

        {relatedServices.length > 0 && (
          <section className="sd-related" aria-labelledby="sd-related-title">
            <div className="sd-section-heading">
              <span className="sd-eyebrow">KHÁM PHÁ THÊM</span>
              <h2 id="sd-related-title">Dịch vụ liên quan</h2>
            </div>
            <div className="sd-related-grid">
              {relatedServices.map((item) => (
                <Link
                  className="sd-service-card"
                  key={item.MADV}
                  to={`/dichvuchitiet/${encodeURIComponent(item.MADV.trim())}`}
                >
                  <div className="sd-card-image">
                    <ServiceImage src={item.HINH} name={item.TENDV} />
                  </div>
                  <div className="sd-card-body">
                    <span className="sd-muted">{item.THOIGIAN} phút</span>
                    <h3>{item.TENDV}</h3>
                    <div className="sd-card-bottom">
                      <strong>{formatPrice(item.GIADV)}</strong>
                      <span>
                        Xem chi tiết <AdminIcon icon={FiArrowRight} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      {/* Chừa khoảng trống ở cuối trang để thanh cố định không che nội dung trên điện thoại. */}
      <div className="sd-mobile-book">
        <div>
          <span className="sd-label">Giá dịch vụ</span>
          <strong>{formatPrice(service.GIADV)}</strong>
        </div>
        <button className="sd-primary" disabled={!available} onClick={handleBooking}>
          {available ? 'Đặt lịch ngay' : bookingLabel}
        </button>
      </div>
    </div>
  );
}

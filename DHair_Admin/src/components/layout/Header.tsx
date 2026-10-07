import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiSearch, FiArrowUpRight, FiX } from './ShellIcons';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import '../../assets/css/client-shell.css';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
const currency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const [services, setServices] = useState<DichVu[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    dichVuApi
      .getAllDichVuClient()
      .then((response) => {
        if (!response.data.success) throw new Error();
        if (active) setServices(response.data.data || []);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reload]);

  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const term = normalize(keyword.trim());
  const amount = Number(term.replace(/[.,\s]/g, ''));
  const results = services.filter(
    (service) =>
      normalize(service.TENDV).includes(term) ||
      String(service.THOIGIAN).includes(term) ||
      (amount > 0 && service.GIADV <= amount),
  );
  const showResults = open && !!term;

  return (
    <header className="dh-shell dh-header">
      <div className="dh-shell-width dh-header-row">
        <Link className="dh-logo" to="/" aria-label="DHair - Trang chủ">
          <img src="/img/logoDHair_V1.png" alt="DHair" />
        </Link>
        <div
          className="dh-header-search"
          ref={searchRef}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              inputRef.current?.focus();
            }
          }}
        >
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
          >
            <FiSearch aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Tìm dịch vụ theo tên, thời lượng hoặc giá"
              aria-controls={showResults ? 'dh-search-results' : undefined}
              placeholder="Tìm dịch vụ, thời lượng hoặc giá…"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
            />
            {keyword && (
              <button
                type="button"
                className="dh-search-clear"
                aria-label="Xóa tìm kiếm"
                onClick={() => {
                  setKeyword('');
                  inputRef.current?.focus();
                }}
              >
                <FiX />
              </button>
            )}
            <button type="submit" className="dh-search-submit">
              Tìm
            </button>
          </form>
          {showResults && (
            <div className="dh-search-results" id="dh-search-results">
              <p className="dh-search-status" role="status">
                {loading
                  ? 'Đang tải dịch vụ…'
                  : error
                    ? 'Chưa tải được dịch vụ.'
                    : results.length
                      ? `${results.length} dịch vụ phù hợp`
                      : 'Không tìm thấy dịch vụ. Hãy thử từ khóa khác.'}
              </p>
              {error && (
                <button
                  className="dh-search-retry"
                  type="button"
                  onClick={() => setReload((value) => value + 1)}
                >
                  Thử lại
                </button>
              )}
              {!loading && !error && (
                <ul>
                  {results.map((service) => (
                    <li key={service.MADV}>
                      <Link
                        to={`/dichvuchitiet/${service.MADV.trim()}`}
                        onClick={() => {
                          localStorage.setItem('madvCanXem', service.MADV.trim());
                          setOpen(false);
                        }}
                      >
                        <img
                          src={service.HINH || '/img/logo.png'}
                          alt=""
                          onError={(event) => {
                            if (!event.currentTarget.src.endsWith('/img/logo.png'))
                              event.currentTarget.src = '/img/logo.png';
                          }}
                        />
                        <span>
                          <strong>{service.TENDV}</strong>
                          <small>
                            {currency(service.GIADV)} · {service.THOIGIAN} phút
                          </small>
                        </span>
                        <FiArrowUpRight aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="dh-header-actions">
          <Link className="dh-history" to="/lichsu" aria-label="Lịch hẹn của tôi">
            <FiCalendar aria-hidden="true" />
            <span>Lịch hẹn của tôi</span>
          </Link>
          <Link className="dh-book-button" to="/datlich">
            Đặt lịch ngay <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

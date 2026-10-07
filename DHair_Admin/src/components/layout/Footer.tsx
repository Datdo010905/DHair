import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiMail, FiPhone } from './ShellIcons';

const socials = [
  { name: 'Facebook', image: 'fb.png', url: 'https://www.facebook.com/toladatdo' },
  { name: 'Instagram', image: 'ig.png', url: 'https://www.instagram.com/_arisu.09/' },
  { name: 'YouTube', image: 'ytb.png', url: 'https://www.youtube.com/@D_awryn' },
  { name: 'TikTok', image: 'tt.png', url: 'https://www.tiktok.com/@ddany.jr' },
];

export default function Footer() {
  return (
    <footer className="dh-shell dh-footer">
      <div className="dh-shell-width">
        <div className="dh-footer-callout">
          <div>
            <p>DÀNH THỜI GIAN CHO CHÍNH BẠN</p>
            <h2>Sẵn sàng cho một diện mạo mới?</h2>
          </div>
          <Link className="dh-book-button" to="/datlich">
            Đặt lịch cùng DHair <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="dh-footer-grid">
          <div className="dh-footer-brand">
            <Link className="dh-logo" to="/" aria-label="DHair - Trang chủ">
              <img src="/img/logoDHair_V1.png" alt="DHair" loading="lazy" />
            </Link>
            <p>
              Chăm sóc mái tóc, thể hiện phong cách.
              <br />
              Đồng hành cùng bạn trong mỗi lần thay đổi.
            </p>
            <div className="dh-socials">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} DHair (mở tab mới)`}
                >
                  <img src={`/img/social/${social.image}`} alt="" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Khám phá DHair">
            <h3>Khám phá DHair</h3>
            <Link to="/home">Trang chủ</Link>
            <Link to="/about">Về DHair</Link>
            <Link to="/toptho">Đội ngũ stylist</Link>
            <Link to="/datlich">Đặt lịch làm tóc</Link>
          </nav>
          <nav aria-label="Tài khoản khách hàng">
            <h3>Dành cho bạn</h3>
            <Link to="/profile">Tài khoản của tôi</Link>
            <Link to="/lichsu">Lịch sử đặt lịch</Link>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/signup">Tạo tài khoản</Link>
          </nav>
          <div className="dh-footer-contact" id="support">
            <h3>Liên hệ & hỗ trợ</h3>
            <a href="tel:0352512556">
              <FiPhone aria-hidden="true" />
              <span>0352 512 556</span>
            </a>
            <a href="mailto:dotiendat092005@gmail.com">
              <FiMail aria-hidden="true" />
              <span>dotiendat092005@gmail.com</span>
            </a>
            <p>Liên hệ để được tư vấn dịch vụ và hỗ trợ lịch hẹn của bạn.</p>
          </div>
        </div>
        <div className="dh-footer-bottom">
          <span>© DHair. Chăm sóc tóc, định hình phong cách.</span>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth',
              })
            }
          >
            Về đầu trang ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

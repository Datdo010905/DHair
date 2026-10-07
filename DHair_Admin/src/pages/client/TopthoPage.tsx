import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/client-discovery.css';

const stylists = [
  { id: 1, name: 'Hiếu Ngô', address: '641 Cách Mạng Tháng 8, Bình Dương', region: 'Bình Dương' },
  { id: 2, name: 'Duy Lê', address: '29 Hiệp Bình, TP. Hồ Chí Minh', region: 'TP. Hồ Chí Minh' },
  { id: 3, name: 'Tú Nguyễn', address: '29 Hiệp Bình, TP. Hồ Chí Minh', region: 'TP. Hồ Chí Minh' },
  { id: 4, name: 'Lương Vũ', address: '80 Trần Phú, Thanh Hóa', region: 'Thanh Hóa' },
  { id: 5, name: 'Giang Cao', address: '641 Cách Mạng Tháng 8, Bình Dương', region: 'Bình Dương' },
  { id: 6, name: 'Đức Nguyễn', address: '641 Cách Mạng Tháng 8, Bình Dương', region: 'Bình Dương' },
  {
    id: 7,
    name: 'Hải Nguyễn',
    address: '177 Đặng Văn Bi, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
  },
  {
    id: 8,
    name: 'Phong Nguyễn',
    address: '8 Châu Văn Liêm, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
  },
  {
    id: 9,
    name: 'Đang Nguyễn',
    address: '177 Đặng Văn Bi, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
  },
  {
    id: 10,
    name: 'Nhân Huỳnh',
    address: '112 Phổ Quang, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
  },
  {
    id: 11,
    name: 'Thư Đoái',
    address: '36 đường N1, KCN Mỹ Phước 1, Bình Dương',
    region: 'Bình Dương',
  },
  {
    id: 12,
    name: 'Long Nguyễn',
    address: '8 Châu Văn Liêm, TP. Hồ Chí Minh',
    region: 'TP. Hồ Chí Minh',
  },
];
const careTeam = [
  { image: 1, address: '36 Nguyễn Ảnh Thủ, Quận 12, TP. Hồ Chí Minh' },
  { image: 3, address: '1361 Phạm Văn Thuận, TP. Biên Hòa' },
  { image: 4, address: '12 Lê Đức Thọ, Gò Vấp, TP. Hồ Chí Minh' },
  { image: 5, address: '99 Tân Sơn Nhì, Tân Phú, TP. Hồ Chí Minh' },
  { image: 6, address: '4255 Nguyễn An Ninh, Dĩ An, Bình Dương' },
  { image: 7, address: '955 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh' },
  { image: 8, address: '408 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh' },
  { image: 10, address: '147 Lê Hồng Phong, Đắk Lắk' },
];
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();

export default function Toptho() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [showCare, setShowCare] = useState(false);
  const filtered = stylists.filter(
    (stylist) =>
      (!region || stylist.region === region) &&
      normalize(`${stylist.name} ${stylist.address}`).includes(normalize(query.trim())),
  );

  return (
    <div className="dh-discovery">
      <div className="dd-wrap">
        <nav className="dd-breadcrumb" aria-label="Đường dẫn">
          <Link to="/home">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Top thợ</span>
        </nav>
        <section className="dd-team-hero" aria-labelledby="team-title">
          <div>
            <p className="dd-eyebrow">ĐỘI NGŨ STYLIST</p>
            <h1 id="team-title">
              Tìm người hiểu
              <br />
              <span>phong cách của bạn.</span>
            </h1>
            <p className="dd-intro">
              Làm quen với đội ngũ, tìm salon phù hợp và chia sẻ kiểu tóc bạn mong muốn trong lần
              hẹn tiếp theo.
            </p>
            <div className="dd-actions">
              <a className="dd-button" href="#stylist-list">
                Khám phá đội ngũ ↓
              </a>
              <Link className="dd-text-link" to="/datlich">
                Đến trang đặt lịch ↗
              </Link>
            </div>
          </div>
          <div className="dd-team-art" aria-hidden="true">
            <span className="dd-art-label">THE PEOPLE BEHIND YOUR STYLE</span>
            <div className="dd-team-portraits">
              <img src="/img/toptho/2.jpg" alt="" />
              <img src="/img/toptho/1.jpg" alt="" />
              <img src="/img/toptho/3.jpg" alt="" />
            </div>
            <span className="dd-art-caption">Lắng nghe. Tư vấn. Tạo kiểu.</span>
          </div>
        </section>

        <section className="dd-section" id="stylist-list" aria-labelledby="list-title">
          <div className="dd-section-heading">
            <div>
              <p className="dd-eyebrow">GẶP GỠ ĐỘI NGŨ</p>
              <h2 id="list-title">Stylist của bạn</h2>
            </div>
            <p>Tìm theo tên hoặc địa chỉ salon.</p>
          </div>
          <div className="dd-filters">
            <label>
              <span>Tìm stylist hoặc salon</span>
              <input
                type="search"
                placeholder="Nhập tên thợ, tên đường…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label>
              <span>Khu vực</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">Tất cả khu vực</option>
                {Array.from(new Set(stylists.map((stylist) => stylist.region))).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            {(query || region) && (
              <button
                className="dd-reset"
                type="button"
                onClick={() => {
                  setQuery('');
                  setRegion('');
                }}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
          <p className="dd-result-count" role="status">
            Hiển thị {filtered.length} / {stylists.length} stylist
          </p>
          {filtered.length ? (
            <div className="dd-stylist-grid">
              {filtered.map((stylist) => (
                <article className="dd-stylist-card" key={stylist.id}>
                  <div className="dd-stylist-photo">
                    <img
                      src={`/img/toptho/${stylist.id}.jpg`}
                      alt={`Stylist ${stylist.name}`}
                      loading="lazy"
                    />
                    <span>{stylist.region}</span>
                  </div>
                  <div className="dd-stylist-info">
                    <p className="dd-card-label">HAIR STYLIST</p>
                    <h3>{stylist.name}</h3>
                    <p className="dd-address">{stylist.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stylist.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Xem bản đồ salon tại ${stylist.address} (mở tab mới)`}
                    >
                      Xem bản đồ salon <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="dd-empty">
              <h3>Chưa tìm thấy stylist phù hợp</h3>
              <p>Thử tên khác hoặc chọn tất cả khu vực.</p>
              <button
                className="dd-button"
                type="button"
                onClick={() => {
                  setQuery('');
                  setRegion('');
                }}
              >
                Xem lại đội ngũ
              </button>
            </div>
          )}
          <p className="dd-help">
            Bạn sẽ chọn chi nhánh, stylist và giờ trống trong trang đặt lịch.
          </p>
        </section>

        <section className="dd-care-section" aria-labelledby="care-title">
          <div className="dd-section-heading">
            <div>
              <p className="dd-eyebrow">CHĂM SÓC & THƯ GIÃN</p>
              <h2 id="care-title">Đội ngũ chăm sóc</h2>
            </div>
            <button
              type="button"
              className="dd-reset"
              aria-expanded={showCare}
              aria-controls="care-team"
              onClick={() => setShowCare((value) => !value)}
            >
              {showCare ? 'Thu gọn ↑' : 'Xem đội ngũ ↓'}
            </button>
          </div>
          <p>Thêm một khoảng nghỉ cho bản thân với các dịch vụ thư giãn và chăm sóc da.</p>
          <div id="care-team" hidden={!showCare}>
            <div className="dd-care-grid">
              {careTeam.map((member) => (
                <figure key={member.image}>
                  <img
                    src={`/img/angels/${member.image}.jpg`}
                    alt={`Nhân viên chăm sóc tại ${member.address}`}
                    loading="lazy"
                  />
                  <figcaption>{member.address}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <aside className="dd-booking-note">
          <div>
            <h2>Bắt đầu từ một cuộc hẹn</h2>
            <p>Chọn dịch vụ, chi nhánh và thời gian thuận tiện cho bạn.</p>
          </div>
          <Link className="dd-button" to="/datlich">
            Đặt lịch ngay ↗
          </Link>
        </aside>
      </div>
    </div>
  );
}

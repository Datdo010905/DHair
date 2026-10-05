import { Link } from 'react-router-dom';
import '../../assets/css/client-discovery.css';

const values = [
  { number: '01', title: 'Lắng nghe trước khi tạo kiểu', text: 'Chia sẻ thói quen, sở thích và kiểu tóc bạn mong muốn để buổi tư vấn bắt đầu từ chính nhu cầu của bạn.' },
  { number: '02', title: 'Thông tin rõ ràng', text: 'Tham khảo giá và thời lượng dịch vụ trên website trước khi lựa chọn lịch hẹn phù hợp.' },
  { number: '03', title: 'Chủ động lịch hẹn', text: 'Lựa chọn chi nhánh, stylist và khung giờ còn trống; xem lại thông tin trong lịch sử đặt lịch.' },
];
const steps = [
  { title: 'Khám phá dịch vụ', text: 'Tìm hiểu dịch vụ, giá và thời gian thực hiện trên trang chủ.', url: '/home', link: 'Xem dịch vụ' },
  { title: 'Chọn lịch hẹn', text: 'Chọn dịch vụ, chi nhánh, stylist và giờ phù hợp với bạn.', url: '/datlich', link: 'Đặt lịch ngay' },
  { title: 'Sẵn sàng đến salon', text: 'Kiểm tra thông tin lịch hẹn và chuẩn bị hình mẫu tóc bạn yêu thích.', url: '/lichsu', link: 'Xem lịch hẹn' },
];

export default function About() {
  return (
    <div className="dh-discovery">
      <div className="dd-wrap">
        <nav className="dd-breadcrumb" aria-label="Đường dẫn"><Link to="/home">Trang chủ</Link><span aria-hidden="true">/</span><span aria-current="page">Về DHair</span></nav>
        <section className="dd-about-hero" aria-labelledby="about-title">
          <p className="dd-eyebrow">CÂU CHUYỆN DHAIR</p>
          <h1 id="about-title">Chăm sóc mái tóc.<br /><span>Thể hiện chính bạn.</span></h1>
          <p className="dd-intro">Một kiểu tóc phù hợp bắt đầu từ việc hiểu bạn. DHair mong muốn mỗi lần đến salon là một trải nghiệm dễ chịu, để bạn tự tin hơn với diện mạo của mình.</p>
          <div className="dd-actions"><Link className="dd-button" to="/datlich">Trải nghiệm DHair ↗</Link><Link className="dd-text-link" to="/toptho">Gặp gỡ đội ngũ →</Link></div>
        </section>
        <figure className="dd-salon-banner"><img src="/img/cuocthi/thumbnail-about.jpg" alt="Đội ngũ stylist đang tư vấn và tạo kiểu tóc tại salon" fetchPriority="high" /><figcaption>Mỗi mái tóc là một câu chuyện. Bắt đầu bằng sự lắng nghe.</figcaption></figure>
        <section className="dd-story dd-section" aria-labelledby="story-title">
          <div><p className="dd-eyebrow">ĐIỀU DHAIR HƯỚNG ĐẾN</p><h2 id="story-title">Đẹp theo cách<br />phù hợp với bạn.</h2></div>
          <div><p>Không có một kiểu tóc dành cho tất cả mọi người. Khuôn mặt, chất tóc, công việc và thói quen chăm sóc hằng ngày đều góp phần tạo nên lựa chọn phù hợp.</p><p>DHair hướng đến sự kết nối giữa khách hàng và người thợ: trao đổi điều bạn mong muốn, tìm hiểu dịch vụ và dành thời gian chăm chút cho bản thân.</p><Link className="dd-text-link" to="/toptho">Khám phá đội ngũ stylist ↗</Link></div>
        </section>
        <section className="dd-values-section" aria-labelledby="values-title">
          <div className="dd-section-heading"><div><p className="dd-eyebrow">TRẢI NGHIỆM CỦA BẠN</p><h2 id="values-title">Những điều chúng tôi chú trọng</h2></div></div>
          <div className="dd-values-grid">{values.map(value => <article key={value.number}><span>{value.number}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
        </section>
        <section className="dd-section" aria-labelledby="steps-title">
          <div className="dd-section-heading"><div><p className="dd-eyebrow">DỄ DÀNG BẮT ĐẦU</p><h2 id="steps-title">Cuộc hẹn tiếp theo của bạn</h2></div><p>Từ chọn dịch vụ đến sẵn sàng ghé salon.</p></div>
          <ol className="dd-steps">{steps.map((step, index) => <li key={step.url}><span className="dd-step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p><Link className="dd-text-link" to={step.url}>{step.link} ↗</Link></li>)}</ol>
        </section>
        <section className="dd-about-contact" id="timmap" aria-labelledby="contact-title">
          <div><p className="dd-eyebrow">KẾT NỐI VỚI DHAIR</p><h2 id="contact-title">Cần thêm một chút tư vấn?</h2><p>Liên hệ để được hỗ trợ về dịch vụ và lịch hẹn. Bạn cũng có thể xem các chi nhánh có sẵn khi đặt lịch.</p><div className="dd-actions"><a className="dd-button" href="tel:0352512556">Gọi 0352 512 556</a><a className="dd-text-link" href="mailto:dotiendat092005@gmail.com">Gửi email →</a></div></div>
          <div className="dd-brand-panel"><img src="/img/logoDHair_V1.png" alt="DHair" loading="lazy" /><p>Chăm sóc tóc, định hình phong cách.</p></div>
        </section>
      </div>
    </div>
  );
}

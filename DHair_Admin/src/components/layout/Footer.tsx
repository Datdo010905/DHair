import React from "react";
const Footer = () => {
    return(
      <>
      <div className="clear"></div>
        <div id="footer">
        <div id="fo-content">

          <div id="chinhsach">
            <h1>THÔNG TIN KHÁC</h1>
            <hr />
            <ul>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">30Shine Shop</a></li>
              <li><a href="#">Học cắt tóc</a></li>
              <li><a href="#">Liên hệ quảng cáo</a></li>
              <li><a href="#">Điều kiện giao dịch chung</a></li>
              <li><a href="#">Giấy phép giáo dục nghề nghiệp</a></li>
              <li><a href="#">Liên hệ học nghề tóc: 0352.51.2556</a></li>
              <li><a href="#">Giờ phục vụ: Thứ 2 đến Chủ Nhật, 24/7</a></li>
              <li><a href="#">Liên hệ nhượng quyền</a></li>
              <li><a href="#">Các hình thức thanh toán tại 30Shine</a></li>
              <li><a href="#">Tìm 30Shine gần nhất</a></li>
            </ul>
          </div>

          <div id="contact">
            <h1>KẾT NỐI VỚI 30SHINE!</h1>
            <hr />
            <a className="social-icons" target="_blank" href="https://www.youtube.com/@D_awryn">
              <img id="ytb" src="/img/social/ytb.png" alt="DanyLab Youtube Chanel" /> <span>Follow Youtube Chanel
                30Shine</span>
            </a>
            <a className="social-icons" target="_blank" href="https://www.facebook.com/toladatdo">
              <img src="/img/social/fb.png" alt="DanyLab Fanpage" /> <span>Follow Facebook Fanpage 30Shine</span>
            </a>
            <a className="social-icons" target="_blank" href="https://www.instagram.com/@_arisu.09/">
              <img src="/img/social/ig.png" alt="DanyLab Instagram" /> <span>Follow Instagram 30Shine</span>
            </a>
            <a className="social-icons" target="_blank" href="https://www.tiktok.com/@ddany.jr">
              <img src="/img/social/tt.png" alt="DanyLab TikTok" /> <span>Follow Tiktok 30Shine</span>
            </a>

            <h3 style={{ "padding": "0", "margin": "0", "color": "white" }}>Tải ứng dụng 30Shine</h3>
            <a className="app-download" target="_blank"
              href="https://play.google.com/store/apps/details?id=com.thirtyshine.customercare"><img id="chplay"
                src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadANDROID.png"
                alt="Tải app từ Google Play" /></a>
            <a className="app-download" target="_blank"
              href="https://apps.apple.com/vn/app/30shine/id1145746762?l=vi"><img id="appst"
                src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadiOS.png"
                alt="Tải app từ App Store" /></a>
          </div>



          <div id="support">
            <h1>ĐĂNG KÝ NHẬN KHUYẾN MÃI</h1>
            <hr />
            <p><b>(*) Nhận ngay voucher 10%</b><br />*Voucher sẽ được gửi sau 24h, chỉ áp dụng cho khách hàng mới.
            </p>
            <form>
              <input className="input-field" type="email" placeholder="Email" /><br />
              <input className="input-field" type="tel" required placeholder="Số điện thoại*" /><br />

              <br />
              <input id="btn-datlich" type="submit" value="ĐĂNG KÝ NGAY" />
            </form>
          </div>
        </div>
      </div>
      </>
    );
};

export default Footer;
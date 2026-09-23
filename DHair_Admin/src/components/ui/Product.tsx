import React from "react";
import { Link } from "react-router-dom";
import HairAndSkincare from "./HairAndSkincare";
const Product = () => {
  return (
    <>
      <div className="product">
        <HairAndSkincare />
        
        <h2 id="3" className="product-title"><i className="fa-solid fa-star"></i> Shine Collection -'Vibe' nào cũng toả sáng
        </h2>
        <div className="col-s-6 col-m-5 col-x-4">
          <div className="shine">
            <img className="shine_item" title="shine-1" alt = "sanpham" src="/img/product/shine-1.jpg" />
          </div>
        </div>
        <div className="col-s-6 col-m-5 col-x-4">
          <div className="shine">
            <img className="shine_item" title="shine-2" alt = "sanpham" src="/img/product/shine-2.jpg" />
          </div>
        </div>
        <div className="col-s-6 col-m-5 col-x-4">
          <div className="shine">
            <img className="shine_item" title="shine-3" alt = "sanpham" src="/img/product/shine-3.jpg" />
          </div>
        </div>

        <div className="clear"></div>
        <h2 id="4" className="product-title"><i className="fa-regular fa-star"></i> SAO TỎA SÁNG</h2>
        <div className="product-title-2">Đồng hành cùng Sao - Sẵn sàng tỏa sáng</div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao1" alt = "sanpham" src="/img/saotoasang/sao1.png" /> <br /><br />
            <a href="none" className="sao-name">Trần Quốc Anh</a><br /><br />
            <span className="sao-mota">Diễn viên điện ảnh Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao2" alt = "sanpham" src="/img/saotoasang/sao2.png" /> <br /><br />
            <a href="none" className="sao-name">Dương Gió Tai</a><br /><br />
            <span className="sao-mota">Hot tiktoker Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao3" alt = "sanpham" src="/img/saotoasang/sao3.jpg" /> <br /><br />
            <a href="none" className="sao-name">Nguyễn Bình An</a><br /><br />
            <span className="sao-mota">Diễn viên điện ảnh Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao4" alt = "sanpham" src="/img/saotoasang/sao4.jpg" /> <br /><br />
            <a href="none" className="sao-name">Dương Quốc Hoàng</a><br /><br />
            <span className="sao-mota">Cơ thủ Bi A số 1 Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao5" alt = "sanpham" src="/img/saotoasang/sao5.jpg" /> <br /><br />
            <a href="none" className="sao-name">Đỗ Kim Phúc</a><br /><br />
            <span className="sao-mota">Nhà Vô Địch tâng bóng nghệ thuật</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao6" alt = "sanpham" src="/img/saotoasang/sao6.png" /> <br /><br />
            <a href="none" className="sao-name">Việt Johan</a><br /><br />
            <span className="sao-mota">Thánh nhạc chế số 1 Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao7" alt = "sanpham" src="/img/saotoasang/sao7.jpg" /> <br /><br />
            <a href="none" className="sao-name">Tiến Linh</a><br /><br />
            <span className="sao-mota">Đội tuyển Quốc gia Việt Nam</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="item">
            <img className="sao-pic" title="sao8" alt = "sanpham" src="/img/saotoasang/sao8.png" /> <br /><br />
            <a href="none" className="sao-name">Phạm Anh Tuấn</a><br /><br />
            <span className="sao-mota">Diễn viên & Ca sĩ Việt Nam</span>
          </div>
        </div>
        <div className="clear"></div>
        <h2 id="nucuoidv" className="product-title"><i className="fa-regular fa-face-smile-wink"></i> Nụ cười dịch vụ</h2>
        <div className="product-title-2">30Shine - Không chỉ tóc đẹp, còn mang tới sự tận hưởng</div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="item">
            <img className="sao-pic" title="nucuoi1" alt = "sanpham" src="/img/nucuoidichvu/nucuoi1.png" /> <br /><br /><br />
            <span className="nucuoi-mota">Bí Quyết Dịch Vụ Đỉnh Cao tại 30Shine</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="item">
            <img className="sao-pic" title="nucuoi2" alt = "sanpham" src="/img/nucuoidichvu/nucuoi2.png" /> <br /><br /><br />
            <span className="nucuoi-mota">Nụ Cười Dịch Vụ: Cam Kết Trên Cả Mong Đợi</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="item">
            <img className="sao-pic" title="nucuoi3" alt = "sanpham" src="/img/nucuoidichvu/nucuoi3.png" /> <br /><br /><br />
            <span className="nucuoi-mota">Từ Trái Tim Đến Hành Động: Hài Lòng Trên Từng Điểm Chạm</span>
          </div>
        </div>
        <div className="col-s-6 col-m-6 col-x-6">
          <div className="item">
            <img className="sao-pic" title="nucuoi4" alt = "sanpham" src="/img/nucuoidichvu/nucuoi4.png" /> <br /><br /><br />
            <span className="nucuoi-mota">30Shine: Nỗ Lực Từng Ngày Để Làm Hài Lòng Khách Hàng</span>
          </div>
        </div>

        <div className="col-s-6 col-m-6 col-x-6">
          <div className="item">
            <img className="sao-pic" title="nucuoi5" alt = "sanpham" src="/img/nucuoidichvu/nucuoi5.png" /> <br /><br /><br />
            <span className="nucuoi-mota">Đội Ngũ 30Shine - Lan Tỏa Giá Trị Hoàn Hảo</span>
          </div>
        </div>

        <div className="clear"></div>
        <div className="cuocthi" id="5">
          <img className="cuocthi-img" title="cuocthi30shine" alt = "sanpham" src="/img/cuocthi/cuocthi30shine.jpg" />
        </div>

        <div className="clear"></div>

        <h2 className="product-title"><i className="fa-solid fa-fire"></i> Cuộc thi "30Shine - You're The Best"</h2>
        <div className="product-title-2">Tỏa sáng tài năng – Nâng tầm thương hiệu</div>
        <div className="cuocthi-slide">
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd1" alt = "sanpham" src="/img/cuocthi/1.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Hiếu Ngô</a><br /><br />
              <span className="sao-mota">Số báo danh: 13448</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd2" alt = "sanpham" src="/img/cuocthi/2.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Tư Đào</a><br /><br />
              <span className="sao-mota">Số báo danh: 1691</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd3" alt = "sanpham" src="/img/cuocthi/3.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Thành Lê</a><br /><br />
              <span className="sao-mota">Số báo danh: 13016</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd4" alt = "sanpham" src="/img/cuocthi/4.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Tân Phạm</a><br /><br />
              <span className="sao-mota">Số báo danh: 1870</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd5" alt = "sanpham" src="/img/cuocthi/5.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Hào Võ</a><br /><br />
              <span className="sao-mota">Số báo danh: 16798</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd6" alt = "sanpham" src="/img/cuocthi/6.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Trọng Thái</a><br /><br />
              <span className="sao-mota">Số báo danh: 10110</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd7" alt = "sanpham" src="/img/cuocthi/7.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Mạnh Kiên</a><br /><br />
              <span className="sao-mota">Số báo danh: 13708</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd8" alt = "sanpham" src="/img/cuocthi/8.jpeg" /> <br /><br />
              <a href="none" className="sao-name">Thiện Bạch</a><br /><br />
              <span className="sao-mota">Số báo danh: 14187</span>
            </div>
          </div>

          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/10.png" /> <br /><br />
              <a href="none" className="sao-name">Hậu Lê</a><br /><br />
              <span className="sao-mota">Số báo danh: 12822</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/11.jpg" /> <br /><br />
              <a href="none" className="sao-name">Long Khỉ</a><br /><br />
              <span className="sao-mota">Số báo danh: 1952</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/12.jpg" /> <br /><br />
              <a href="none" className="sao-name">Tây Ba Lô</a><br /><br />
              <span className="sao-mota">Số báo danh: 27904</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/13.jpg" /> <br /><br />
              <a href="none" className="sao-name">Thiện Xạ Thủ</a><br /><br />
              <span className="sao-mota">Số báo danh: 2805</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/25.jpg" /> <br /><br />
              <a href="none" className="sao-name">Thiện Xạ Thủ</a><br /><br />
              <span className="sao-mota">Số báo danh: 2805</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/14.jpg" /> <br /><br />
              <a href="none" className="sao-name">Đức BitCoin</a><br /><br />
              <span className="sao-mota">Số báo danh: 1256</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/15.jpg" /> <br /><br />
              <a href="none" className="sao-name">Dany Đỗ</a><br /><br />
              <span className="sao-mota">Số báo danh: 0109</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/16.jpg" /> <br /><br />
              <a href="none" className="sao-name">Tiến Đạt</a><br /><br />
              <span className="sao-mota">Số báo danh: 1905</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/17.jpg" /> <br /><br />
              <a href="none" className="sao-name">Đạt Đỗ</a><br /><br />
              <span className="sao-mota">Số báo danh: 1925</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/19.jpg" /> <br /><br />
              <a href="none" className="sao-name">Trùm Fi5</a><br /><br />
              <span className="sao-mota">Số báo danh: 1599</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/21.jpg" /> <br /><br />
              <a href="none" className="sao-name">Trùm LiQi</a><br /><br />
              <span className="sao-mota">Số báo danh: 9753</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/18.jpg" /> <br /><br />
              <a href="none" className="sao-name">Dũng Sadboy</a><br /><br />
              <span className="sao-mota">Số báo danh: 23976</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/20.jpg" /> <br /><br />
              <a href="none" className="sao-name">Dũng Sadboy</a><br /><br />
              <span className="sao-mota">Số báo danh: 23976</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/22.jpg" /> <br /><br />
              <a href="none" className="sao-name">Chiến Tỏi</a><br /><br />
              <span className="sao-mota">Số báo danh: 1986</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/23.jpg" /> <br /><br />
              <a href="none" className="sao-name">Trường Pho</a><br /><br />
              <span className="sao-mota">Số báo danh: 3451</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="item">
              <img className="sao-pic" title="sbd10" alt = "sanpham" src="/img/cuocthi/24.jpg" /> <br /><br />
              <a href="none" className="sao-name">Tiểu đội sát thủ</a><br /><br />
              <span className="sao-mota">Số báo danh: 9999</span>
            </div>
          </div>
        </div>
        <div className="clear"></div>
        <h2 id="6" className="product-title"><i className="fa-solid fa-newspaper"></i> TIN TỨC VỀ 30SHINE</h2>
        <div className="col-s-6 col-m-6 col-x-6">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="tintuc1" alt = "sanpham" src="/img/tintuc/1.png" /> <br /><br />
            <span className="tintuc-mota">CEO 30Shine kể chuyện từ bỏ công nghiệp hóa tay nghề stylist, khẳng định
              không phải cứ có tiền là mua được nhượng quyền</span>
          </div>
        </div>
        <div className="col-s-6 col-m-6 col-x-6">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="tintuc2" alt = "sanpham" src="/img/tintuc/2.png" /> <br /><br />
            <span className="tintuc-mota">30Shine đặt mục tiêu 100 triệu USD doanh thu vào 2028</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="tintuc3" alt = "sanpham" src="/img/tintuc/3.png" /> <br /><br />
            <span className="tintuc-mota">Thói quen bình thường tạo ra những điều phi thường ở 30Shine</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="tintuc4" alt = "sanpham" src="/img/tintuc/4.png" /> <br /><br />
            <span className="tintuc-mota">Chuỗi cắt tóc nam lớn nhất Việt Nam với 1000 thợ: Đi 1 vòng thế giới tìm
              đường xuất ngoại, sắp thuê Giám đốc sáng tạo ngoại quốc</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="tintuc5" alt = "sanpham" src="/img/tintuc/5.png" /> <br /><br />
            <span className="tintuc-mota">Mục tiêu doanh thu 100 triệu USD của 30Shine</span>
          </div>
        </div>

        <div className="clear"></div>
        <h2 id="7" className="product-title"><i className="fa-solid fa-crown"></i> CHẤT LƯỢNG & UY TÍN</h2>
        <div className="product-title-2">Kết hợp với các đối tác lớn, uy tín, bao gồm các nhãn sản phẩm chất lượng được
          sử dụng trong quy trình các dịch vụ đang vận hành tại hệ thống salon.</div>
        <div className="chatluong-slide">
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong1" alt = "sanpham" src="/img/chatluong_uytin/1.jpeg" /> <br />
              <a href="none" className="sao-name">Glanzen</a><br />
              <span className="sao-mota">Sản phẩm tạo kiểu đạt chứng nhận FDA Hoa Kỳ</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong2" alt = "sanpham" src="/img/chatluong_uytin/2.jpeg" /> <br />
              <a href="none" className="sao-name">Dr for Skin</a><br />
              <span className="sao-mota">Thương hiệu mỹ phẩm có 11 năm nghiên cứu từ các chuyên gia đầu ngành về
                da mụn tại Hàn Quốc</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong3" alt = "sanpham" src="/img/chatluong_uytin/3.png" /> <br />
              <a href="none" className="sao-name">Laborie</a><br />
              <span className="sao-mota">Chăm tóc khoa học, khỏe chuẩn salon</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong4" alt = "sanpham" src="/img/chatluong_uytin/4.png" /> <br />
              <a href="none" className="sao-name">Vichy</a><br />
              <span className="sao-mota">Với hơn 200 bằng sáng chế, 80 năm kinh nghiệm, 3000 kiểm nghiệm lâm sàng
                và bảng tự đánh giá và đang có mặt tại 5 Châu lục</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong5" alt = "sanpham" src="/img/chatluong_uytin/5.png" /> <br />
              <a href="none" className="sao-name">Glatika</a><br />
              <span className="sao-mota">Thương hiệu mỹ phẩm chăm sóc tóc đến từ Pháp, với các sản phẩm chăm sóc
                tóc tự nhiên và hiệu quả</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong6" alt = "sanpham" src="/img/chatluong_uytin/6.png" /> <br />
              <a href="none" className="sao-name">Simplicity</a><br />
              <span className="sao-mota">Giải pháp bảo vệ và chăm sóc da ứng dụng công nghệ hiện đại cho công thức
                sản phẩm vượt trội và đáng tin cậy</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong7" alt = "sanpham" src="/img/chatluong_uytin/7.jpeg" /> <br />
              <a href="none" className="sao-name">Dr.FORHAIR</a><br />
              <span className="sao-mota">Top dầu gội ngăn rụng tóc chứng nhận bởi Viện nghiên cứu da liễu quốc tế
                - chứng nhận DERMATEST EXCELLENT</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong8" alt = "sanpham" src="/img/chatluong_uytin/8.jpeg" /> <br />
              <a href="none" className="sao-name">Blairsom</a><br />
              <span className="sao-mota">Được phát triển bởi chuyên gia với hơn 50 năm kinh nghiệm trong ngành hóa
                mỹ phẩm</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong9" alt = "sanpham" src="/img/chatluong_uytin/9.jpeg" /> <br />
              <a href="none" className="sao-name">LoveWarmth</a><br />
              <span className="sao-mota">Thương hiệu xuất sắc về các sản phẩm chăm sóc tóc chuyên nghiệp trong
                ngành mỹ phẩm Trung Quốc</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong10" alt = "sanpham" src="/img/chatluong_uytin/11.jpeg" /> <br />
              <a href="none" className="sao-name">Echosline</a><br />
              <span className="sao-mota">Màu nhuộm cao cấp - Công thức thuần chay</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong11" alt = "sanpham" src="/img/chatluong_uytin/12.jpeg" /> <br />
              <a href="none" className="sao-name">Sea Venus</a><br />
              <span className="sao-mota">Hơn 24 năm dẫn đầu ngành tóc chuyên nghiệp tại Trung Quốc</span>
            </div>
          </div>
          <div className="col-s-6 col-m-4 col-x-3">
            <div className="tintuc-item">
              <img className="tintuc-pic" title="chatluong12" alt = "sanpham" src="/img/chatluong_uytin/10.jpeg" /> <br />
              <a href="none" className="sao-name">ATS for man</a><br />
              <span className="sao-mota">Thương hiệu mỹ phẩm Hàn Quốc có hơn 32 năm kinh nghiệm trong ngành làm
                đẹp</span>
            </div>
          </div>
        </div>
        <div className="clear"></div>

        <h2 id="8" className="product-title"><i className="fa-solid fa-shop"></i> 30Shine shop</h2>
        <div className="product-title-2">Mỹ phẩm nam cao cấp chính hãng</div>
        <div className="clear"></div>
        <div className="banner">
          <img className="cuocthi-img" title="cuocthi30shine" alt = "sanpham" src="/img/30shine_shop/banner.jpg" />
        </div>
        <div className="clear"></div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="sanpham-item">
            <img className="sanpham-pic" title="sp1" alt = "sanpham" src="/img/30shine_shop/30SWVL22-GLANZEN  premium 2025.jpg" />
            <br /><br />
            <a href="none" className="sao-name">Xịt tạo kiểu tóc Glanzen X2 Booster 2025 tạo phồng dành riêng cho tóc mỏng,
              xẹp</a><br /><br />
            <span className="sanpham-gia">276.000 VNĐ</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="sanpham-item">
            <img className="sanpham-pic" title="sp1" alt = "sanpham" src="/img/30shine_shop/xittaophong.jpg" /> <br /><br />
            <a href="none" className="sao-name">Xịt tạo phồng Glanzen Booster Pre-Styling - Tạo phồng, Giảm bết tóc & Bảo vệ tóc
              khỏi nhiệt độ cao</a><br /><br />
            <span className="sanpham-gia">199.000 VNĐ</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="sanpham-item">
            <img className="sanpham-pic" title="sp1"
              alt = "sanpham" src="/img/30shine_shop/30S3X12Q-vn-11134207-7r98o-lof4ti1963efc4.jpg" /> <br /><br />
            <a href="none" className="sao-name">Gôm xịt giữ nếp tóc Glanzen 30Shine phân phối chính hãng giữ nếp tạo kiểu đỉnh
              cao 380ml</a><br /><br />
            <span className="sanpham-gia">189.000 VNĐ</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="sanpham-item">
            <img className="sanpham-pic" title="sp1" alt = "sanpham" src="/img/30shine_shop/30S8CAQM-Dưỡng da Dr.FORSKIN 7in1.jpg" />
            <br /><br />
            <a href="none" className="sao-name">Tinh chất dưỡng da cho nam Serum Dr.FORSKIN 7IN1 120ml - Kem dưỡng ẩm dưỡng
              trắng da nam 2025</a><br /><br />
            <span className="sanpham-gia">499.000 VNĐ</span>
          </div>
        </div>


        <div className="clear"></div>
        <h2 id="9" className="product-title"><i className="fa-solid fa-handshake"></i> An tâm & Tin tưởng</h2>
        <div className="product-title-2">Thấu hiểu nhu cầu, hỗ trợ nhiệt tình</div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="antam1" alt = "sanpham" src="/img/antam/1.png" /> <br /><br />
            <span className="tintuc-mota">Những câu hỏi thường gặp</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="antam2" alt = "sanpham" src="/img/antam/2.png" /> <br /><br />
            <span className="tintuc-mota">Nói gì để có kiểu tóc ưng ý</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="tintuc-item">
            <img className="tintuc-pic" title="antam3" alt = "sanpham" src="/img/antam/3.png" /> <br /><br />
            <span className="tintuc-mota">Bảo quản xe cộ, đồ đạc</span>
          </div>
        </div>

        <div className="clear"></div>
        <h2 id="10" className="product-title"><i className="fa-solid fa-atom"></i> Không gian & công nghệ</h2>
        <div className="product-title-2">Trải nghiệm không gian mở</div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="kg1" alt = "sanpham" src="/img/khonggian_congnghe/1.jpg" /> <br /><br />
            <span className="tintuc-mota">Không gian thoáng, mát, sạch</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="kg1" alt = "sanpham" src="/img/khonggian_congnghe/2.png" /> <br /><br />
            <span className="tintuc-mota">Trang thiết bị hiện đại</span>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-4">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="kg1" alt = "sanpham" src="/img/khonggian_congnghe/3.png" /> <br /><br />
            <span className="tintuc-mota">Ứng dụng đặt lịch độc quyền</span>
          </div>
        </div>
        <div className="clear"></div>
        <h2 id="timmap" className="product-title"><i className="fa-solid fa-map-location-dot"></i> TÌM 30SHINE GẦN NHẤT</h2>
        <div className="product-title-2">Để xe thuận tiện an toàn, bản đồ dẫn đường chi tiết (hàng trăm Salon)</div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="diadiem1" alt = "sanpham" src="/img/diadiem/hanoi.png" /> <br /><br />
            <a href="none" className="diadiem-name">HÀ NỘI</a>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="diadiem2" alt = "sanpham" src="/img/diadiem/hochiminh.jpg" /> <br /><br />
            <a href="none" className="diadiem-name">HỒ CHÍ MINH</a>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="diadiem2" alt = "sanpham" src="/img/diadiem/danang.jpg" /> <br /><br />
            <a href="none" className="diadiem-name">ĐÀ NẴNG</a>
          </div>
        </div>
        <div className="col-s-6 col-m-4 col-x-3">
          <div className="diadiem-item">
            <img className="tintuc-pic" title="diadiem2" alt = "sanpham" src="/img/diadiem/hungyen.jpg" /> <br /><br />
            <a href="none" className="diadiem-name">ĐỊA ĐIỂM KHÁC</a>
          </div>
        </div>

        <div id="map" className="col-s-6 col-m-4 col-x-3">
          <h1><i className="fa-solid fa-map-pin"></i> SƠ ĐỒ ĐƯỜNG ĐI & CHỈ DẪN</h1>
          <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d277.1304035601194!2d105.95617343116322!3d20.84755407092782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDUwJzUxLjEiTiAxMDXCsDU3JzIyLjIiRQ!5e0!3m2!1svi!2s!4v1741235241242!5m2!1svi!2s"
            width="100%" height="360"></iframe>
        </div>
      </div>
    </>
  );
};

export default Product;
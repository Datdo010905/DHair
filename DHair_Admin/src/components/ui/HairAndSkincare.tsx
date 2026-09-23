import React, { useState } from "react";
import { Link } from "react-router-dom";
import dichVuApi, { DichVu } from "../../api/dichvuApi";
import { toast } from "react-toastify";
import { useEffect } from "react";
const HairAndSkincare = () => {

    const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
    const [dichVuCSDList, setDichVuCSDList] = useState<DichVu[]>([]);
    //up data từ api lên bảng
    const fetchDichVu = async () => {
        try {
            const [resToc, resCSD] = await Promise.all([
                dichVuApi.getAllClient(),
                dichVuApi.getAllCSDClient()
                
            ]);
            setDichVuList(resToc.data.data);
            setDichVuCSDList(resCSD.data.data);
        } catch (err) {
            toast.error("Không thể tải dữ liệu từ máy chủ.");
        }
    };
    // Tải dữ liệu khi component mount
    useEffect(() => {
        fetchDichVu();
    }, []);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };
    return (
        <>
            <h2 id="1" className="product-title"><i className="fa-solid fa-scissors"></i> DỊCH Vụ TÓC</h2>
            <div className="row" id="ds-dichvu">
                {/* 3. Duyệt mảng dịch vụ tóc*/}
                {dichVuList.map((item) => (
                    <div className="col-s-6 col-m-4 col-x-3" key={item.MADV}>
                        <div className="item">
                            <br />

                            <img className="pic_item" title={item.TENDV} src={`${item.HINH}`} alt={item.TENDV} />
                            <br /><br />
                            {/* Chuyển hướng đến trang chi tiết kèm mã dịch vụ */}
                            <Link className="product-name" to={`/dichvuchitiet/${item.MADV}`}>{item.TENDV}</Link><br /><br />
                            <span className="giamgia">{item.THOIGIAN} phút</span>
                            <br />
                            <div className="gia"><span className="product-price">{formatPrice(item.GIADV)}</span></div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="clear"></div>
            <h2 id="2" className="product-title"><i className="fa-solid fa-spa"></i> THƯ GIÃN VÀ CHĂM SÓC DA</h2>
            <div className="row" id="ds-chamsoc">
                {/* 4. Duyệt mảng dịch vụ chăm sóc da */}
                {dichVuCSDList.map((item) => (
                    <div className="col-s-6 col-m-4 col-x-3" key={item.MADV}>
                        <div className="item">
                            <br />
                            <img className="pic_item" title={item.TENDV} src={`${item.HINH}`} alt={item.TENDV} /> <br /><br />
                            <Link className="product-name" to={`/dichvuchitiet/${item.MADV}`}>{item.TENDV}</Link><br /><br />
                            <span className="giamgia">{item.THOIGIAN} phút</span>
                            <br />
                            <div className="gia"><span className="product-price">{formatPrice(item.GIADV)}</span></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="clear"></div>
        </>
    )
};

export default HairAndSkincare;
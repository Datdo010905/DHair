
import StatCard from "../../components/ui/StatCard";
import React, { useEffect, useState } from "react";
import CustomerApi from "../../api/customerApi";
import BookingApi from "../../api/bookingApi";
import StaffApi from "../../api/staffApi"
import dichVuApi from "../../api/dichvuApi";
import TaiKhoanApi from "../../api/taikhoanApi";
import KhuyenMaiApi from "../../api/khuyenmaiApi";
import "../../assets/css/booking-admin.css";
import "../../assets/css/admin-pages.css";

const DashboardPage: React.FC = () => {

    //lưu state để dùng
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalNV, setTotalNV] = useState(0);
    const [totalDV, setTotalDV] = useState(0);
    const [totalTK, setTotalTK] = useState(0);
    const [totalKM, setTotalKM] = useState(0);
    const [bookingsToday, setTotalBookingsToday] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [time, setTime] = useState("");

    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();

    const [xinchao, setxinchao] = useState<string>("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
        const [resKH, resNV, resDV, resCSD, resTK, resKM, resBooking] = await Promise.all([
            CustomerApi.getAll(), StaffApi.getAll(), dichVuApi.getAll(), dichVuApi.getAllCSD(),
            TaiKhoanApi.getAll(), KhuyenMaiApi.getAll(), BookingApi.getAll()
        ]);
        if ([resKH, resNV, resDV, resCSD, resTK, resKM, resBooking].some(res => !res.data.success)) throw new Error();
        if (resKH.data.success) {
            setTotalCustomers(resKH.data.data.length);
        }
        if (resKM.data.success) {
            setTotalKM(resKM.data.data.length);
        }
        if (resTK.data.success) {
            setTotalTK(resTK.data.data.length);
        }

        if (resNV.data.success) {
            setTotalNV(resNV.data.data.length);
        }
        if (resDV.data.success && resCSD.data.success) {
            setTotalDV(resDV.data.data.length + resCSD.data.data.length);
        }
        if (resBooking.data.success) {
            const homnay = resBooking.data.data;
            const Todaybookings = homnay.filter(
                (lich: any) => lich.NGAYHEN.split('T')[0] === today
            );
            setTotalBookingsToday(Todaybookings.length);
        }

        if (hour < 12) {
            setxinchao("Chào buổi sáng");
        }
        else if (hour < 18) {
            setxinchao("Chào buổi chiều");
        }
        else {
            setxinchao("Chào buổi tối");
        }

        } catch {
            setError("Không tải được số liệu tổng quan. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };
    // Tải dữ liệu khi component mount
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString("vi-VN"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div id="dashboard" className="section active-section admin-page">
                <header className="ba-heading"><div><p className="ba-eyebrow">QUẢN LÝ SALON</p><h2>Tổng quan</h2><p>{xinchao || "Xin chào"} · {today} {time}</p></div><button className="ba-button" disabled={loading} onClick={fetchData}>Làm mới</button></header>
                {error && <div className="ba-empty ba-error" role="alert">{error}<button className="ba-button" onClick={fetchData}>Thử lại</button></div>}
                {loading && <p role="status">Đang tải số liệu…</p>}
                <div className="cards">
                    <StatCard
                        title="Đặt lịch hôm nay"
                        icon="fas fa-calendar-check"
                        value={loading || error ? "—" : bookingsToday}
                        subText={`Cập nhật ngày: ${today}`}
                    />
                    <StatCard
                        title="Tổng khách"
                        icon="fas fa-users"
                        value={loading || error ? "—" : totalCustomers}
                    />
                    <StatCard
                        title="Tổng nhân viên"
                        icon="fas fa-user-tie"
                        value={loading || error ? "—" : totalNV}
                    />
                    <StatCard
                        title="Tổng dịch vụ"
                        icon="fas fa-concierge-bell"
                        value={loading || error ? "—" : totalDV}
                    />
                    <StatCard
                        title="Tổng khuyến mại"
                        icon="fas fa-tags"
                        value={loading || error ? "—" : totalKM}
                    />
                    <StatCard
                        title="Tổng người dùng"
                        icon="fas fa-user-shield"
                        value={loading || error ? "—" : totalTK}
                    />
                </div>


            </div>
        </>
    );
};

export default DashboardPage;
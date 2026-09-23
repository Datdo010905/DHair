import React  from "react";

// Khai báo các thuộc tính StatCard 
interface StatCardProps {
    title: string;               // Tiêu đề (VD: "Tổng khách")
    icon: string;
    value: string | number;      // Giá trị (VD: 150 hoặc "99.000đ")
    valueColor?: string;         // (Tùy chọn) Màu sắc của số, dùng cho chữ tiền màu xanh
    subText?: React.ReactNode;   // (Tùy chọn) Chữ nhỏ ở dưới cùng (VD: "Thành công: 310")
}
  
const StatCard: React.FC<StatCardProps> = ({ title, icon, value, valueColor, subText }) => {
    return (
        <div className="card">
            <h3><i className={icon}></i> {title}</h3>
            {/* Nếu có thì truyền valueColor, không thì mặc định CSS */}
            <p style={{ color: valueColor }}>{value}</p>
            
            {/* Nếu có thì truyền subText thì mới hiển thị thẻ <small> */}
            {subText && <small>{subText}</small>}
            
        </div>
    );
};

export default StatCard;
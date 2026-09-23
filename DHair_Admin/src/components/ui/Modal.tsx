import React  from "react";

//định nghĩa
interface ModalProps {
    isOpen: boolean;         // Trạng thái mở/đóng
    onClose: () => void;     // Hàm chạy khi bấm nút X hoặc nút Hủy
    title: string;           
    children: React.ReactNode; // Nội dung Form bên trong
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    //đóng
    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <span className="close-btn" onClick={onClose}>&times;</span>
                </div>
                <div className="modal-body">
                    {/* form cần thêm */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
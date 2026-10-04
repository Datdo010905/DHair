import AdminIcon from '../ui/AdminIcon';
import React, { useState } from "react";
import { useSearch } from "../../context/SearchContext"; // Import hook

import { FiMenu, FiSearch } from 'react-icons/fi';
const TopBarAdmin = ({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) => {
    // Lấy setSearchTerm từ SearchContext để cập nhật từ khóa tìm kiếm
    const {setSearchTerm } = useSearch();
    const [inputValue, setInputValue] = useState('');
    const handleExecuteSearch = () => {
        setSearchTerm(inputValue);
    };
    //bấm enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleExecuteSearch();
        }
    };
    return (
        <>
            <header className="topbar">
                <button id="toggleSidebar" className="icon-btn" aria-label="Mở menu quản trị" aria-expanded={sidebarOpen} aria-controls="sidebar" onClick={onToggleSidebar}><AdminIcon icon={FiMenu} aria-hidden="true" /></button><span className="admin-topbar-title">Không gian quản trị</span>
                <div className="topbar-right">
                    <input 
                        id="adminSearch" 
                        placeholder="Tìm theo ID hoặc Tên..." 
                        aria-label="Tìm kiếm" 
                        value={inputValue} // Trỏ vào state dùng chung
                        onChange={(e) => setInputValue(e.target.value)} // Cập nhật state chung
                        onKeyDown={handleKeyDown} // Xử lý sự kiện nhấn phím
                    />
                    <button className="icon-btn" aria-label="Thực hiện tìm kiếm" onClick={handleExecuteSearch}>
                        <AdminIcon icon={FiSearch} aria-hidden="true" />
                    </button>
                </div>
            </header>
        </>
    );
};

export default TopBarAdmin;
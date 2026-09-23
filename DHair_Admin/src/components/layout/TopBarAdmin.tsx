import React, { useState } from "react";
import { useSearch } from "../../context/SearchContext"; // Import hook

const TopBarAdmin = () => {
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
                <button id="toggleSidebar" className="icon-btn"><i className="fas fa-bars"></i></button>
                <div className="topbar-right">
                    <input 
                        id="adminSearch" 
                        placeholder="Tìm theo ID hoặc Tên..." 
                        aria-label="Tìm kiếm" 
                        value={inputValue} // Trỏ vào state dùng chung
                        onChange={(e) => setInputValue(e.target.value)} // Cập nhật state chung
                        onKeyDown={handleKeyDown} // Xử lý sự kiện nhấn phím
                    />
                    <button className="icon-btn" onClick={handleExecuteSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </header>
        </>
    );
};

export default TopBarAdmin;
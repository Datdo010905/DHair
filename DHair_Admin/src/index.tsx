import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <App />
          {/* đóng sau 1,5 giây */}
          <ToastContainer
            position="top-right"
            autoClose={1500}    
            newestOnTop={true}      // Thông báo mới nhất sẽ hiện lên trên cùng
            closeOnClick            // Tắt ngay khi người dùng click vào
            rtl={false}             
            theme="colored"         //màu sắc đồng bộ
            transition={Slide}      //Hiệu ứng trượt ngang
            style={{ width: '350px', fontSize: '15px', fontWeight: '500' }}
          />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

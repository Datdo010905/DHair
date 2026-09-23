import React from 'react';
// Định nghĩa cấu trúc của một Cột
export interface Column<T> {
  tieude: string; 
  cotnhandulieu: keyof T;
  //custom cách hiển thị
  render?: (row: T) => React.ReactNode; 
}

interface DataTableProps<T> {
  columns: Column<T>[]; // Danh sách các cột
  data: T[];            // Mảng dữ liệu từ API
  isLoading?: boolean;  // Trạng thái đang tải
}

//Component DataTable sử dụng Generic <T>
const DataTable = <T extends object>({ columns, data, isLoading }: DataTableProps<T>) => {
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }
  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu.</div>;
    
  }
  return (
    <>
      <table className='table'>  
        <thead>
          <tr>
            {/* duyệt các cột để tạo tiêu đề bảng */}
            {columns.map((col, index) => (
              <th key={index}>
                {col.tieude}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* duyệt dữ liệu để tạo các hàng trong bảng */}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* duyệt các cột để tạo ô dữ liệu */}
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {/* hiển thị dữ liệu, có thể dùng render để custom */}
                  {col.render ? col.render(row) : (row[col.cotnhandulieu] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;


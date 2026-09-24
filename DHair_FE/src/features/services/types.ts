// Giữ tên trường giống dữ liệu DICHVU từ backend để dễ đối chiếu.
export interface Service {
  MADV: string;
  LOAI: string;
  TENDV: string;
  MOTA: string | null;
  THOIGIAN: number;
  GIADV: number;
  TRANGTHAI: string | null;
  HINH: string | null;
  QUYTRINH: string | null;
}

export type ServiceCategory = 'all' | 'hair' | 'skinCare';

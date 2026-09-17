// Field names match the DICHVU records returned by the backend.
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

export type ServiceCategory = 'hair' | 'skinCare';

import axiosClient from './axiosClient';

export interface TaiKhoan {
    MATK: string;
    PHANQUYEN: number;
    TRANGTHAI: string;
}

export interface CreateTaiKhoanPayload {
    MATK: string;
    PASS: string;
    PHANQUYEN: number;
    TRANGTHAI: string;
}

export interface UpdateTaiKhoanPayload {
    PHANQUYEN: number;
    TRANGTHAI: string;
}

const TaiKhoanApi = {
    getAll() {
        return axiosClient.get('/api/taikhoan/get-all-taikhoan');
    },

    getById(id: string) {
        return axiosClient.get(`/api/taikhoan/get-byId-taikhoan/${id}`);
    },

    create(data: CreateTaiKhoanPayload) {
        return axiosClient.post('/api/taikhoan/insert-taikhoan', data);
    },

    update(id: string, data: UpdateTaiKhoanPayload) {
        return axiosClient.put(
            `/api/taikhoan/update-taikhoan/${id}`,
            data
        );
    },

    delete(id: string) {
        return axiosClient.delete(
            `/api/taikhoan/delete-taikhoan/${id}`
        );
    },

    forgotPassword(data: { sdt: string; email: string }) {
        return axiosClient.post(
            '/api/taikhoan/forgot-password',
            data
        );
    }
};

export default TaiKhoanApi;
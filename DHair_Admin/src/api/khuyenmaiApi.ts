import axiosClient from './axiosClient';

export interface KhuyenMai {
    MAKM: string;
    TENKM: string;
    MOTA: string;
    NGAYBD: string;
    NGAYKT: string;
    GIATRI: number;
    TRANGTHAI: string;
};

const KhuyenMaiApi = {
    getAll() {
        return axiosClient.get('/api/khuyenmai/get-all-KhuyenMai');
    },
    getById(id: string) {
        return axiosClient.get(`/api/khuyenmai/get-byId-KhuyenMai/${id}`);
    },
    create(data: KhuyenMai) {
        return axiosClient.post('/api/khuyenmai/insert-KhuyenMai', data);
    },
    update(id: string, data: KhuyenMai) {
        return axiosClient.put(`/api/khuyenmai/update-KhuyenMai/${id}`, data);
    },
    delete(id: string) {
        return axiosClient.delete(`/api/khuyenmai/delete-KhuyenMai/${id}`);
    }
};

export default KhuyenMaiApi;
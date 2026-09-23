import axiosClient from './axiosClient';

// export interface DichVu {
//     madv: string;
//     loaidv: string;
//     tendv: string;
//     mota: string;
//     thoigian: number;
//     giadv: number;
//     trangthai: string;
//     hinh: string;
//     quytrinh: string;
// };
export interface DichVu{
    MADV: string;
    LOAI: string;
    TENDV: string;
    MOTA: string;
    THOIGIAN: number;
    GIADV: number;
    TRANGTHAI: string;
    HINH: string;
    QUYTRINH: string;
}
export interface TopDVData {
    madv: string;
    tendv: string;
    mota: string;
    thoigian: number;
    giadv: number;
    trangthai: string;
    hinh: string;
    quytrinh: string;
    solan: number;
};

const dichVuApi = {
    // Hàm lấy danh sách tất cả dịch vụ cả đang và ngừng cung cấp
    getAll() {
        //const url = '/api-admin/DichVu_/get-all-DichVuToc';
        const url = '/api/dichvu/get-all-DichVu';
        return axiosClient.get<{ success: boolean; message: string; data: DichVu[] }>(url);
    },
    // Hàm lấy danh sách tất cả dịch vụ CSD cả đang và ngừng cung cấp
    getAllCSD() {
        //const url = '/api-admin/DichVu_/get-all-DichVuCSD';
        const url = '/api/dichvu/get-all-DichVuChamSocDA';
        return axiosClient.get<{ success: boolean; message: string; data: DichVu[] }>(url);
    },
    // Hàm lấy danh sách tất cả dịch vụ cả đang cung cấp
    getAllClient() {
        //const url = '/api-common/DichVu_/get-all-DichVuToc';
        const url = '/api/dichvu/get-all-DichVuToc';
        return axiosClient.get<{ success: boolean; message: string; data: DichVu[] }>(url);
    },
    // Hàm lấy danh sách tất cả dịch vụ CSD cả đang cung cấp
    getAllCSDClient() {
        //const url = '/api-common/DichVu_/get-all-DichVuCSD';
        const url = '/api/dichvu/get-all-DichVuCSD';
        return axiosClient.get<{ success: boolean; message: string; data: DichVu[] }>(url);
    },
    // Hàm lấy dịch vụ theo ID
    getById(id: string) {
        //const url = `/api-common/DichVu_/get-byId-DichVu?ma=${id}`;
        const url = `/api/dichvu/get-DichVuByID/${id}`;
        return axiosClient.get<{ success: boolean; message: string; data: DichVu }>(url);
    },
    // Hàm thêm dịch vụ
    create(data: FormData) {
        //const url = '/api-admin/DichVu_/insert-DichVu';
        const url = '/api/dichvu/create-DichVu';
        return axiosClient.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    // Hàm sửa dịch vụ
    update(data: FormData) {
        //const url = '/api-admin/DichVu_/update-DichVu';
        const url = '/api/dichvu/update-DichVu';
        return axiosClient.put(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    // Hàm xoá dịch vụ
    delete(id: string) {
        //const url = `/api-admin/DichVu_/delete-DichVu?ma=${id}`;
        const url = `/api/dichvu/delete-DichVu/${id}`;
        return axiosClient.delete(url); 
    },
    getAllDichVuClient() {
        const url = '/api/dichvu/get-all-DichVuCungCap';
        return axiosClient.get<{ success: boolean; message: string; data: DichVu[] }>(url);
    },
};

export default dichVuApi;
import React, { useEffect, useState, useRef } from "react";
import Modal from "../../components/ui/Modal";
import { Column } from '../../components/ui/DataTable';
import AdminList from '../../components/ui/AdminList';
import dichVuApi, { DichVu } from "../../api/dichvuApi";
import { dichVuSchema } from '../../utils/dichVuSchema';
import { toast } from 'react-toastify';

const DichVuPage: React.FC = () => {
    //Gộp state
    const [modalType, setModalType] = useState<'add' | 'edit' | 'none'>('none');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null); // Lưu ID cần xóa

    //State dùng chung cho tìm kiếm

    //Dữ liệu dịch vụ
    const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
    const [dichVuCSDList, setDichVuCSDList] = useState<DichVu[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savingStatuses, setSavingStatuses] = useState<Set<string>>(new Set());
    const statusLocks = useRef(new Set<string>());
    const serviceStatuses = ['Đang cung cấp', 'Ngừng cung cấp'] as const;
    const handleStatusChange = async (row: DichVu, nextStatus: typeof serviceStatuses[number]) => {
        const id = row.MADV;
        if (statusLocks.current.has(id) || row.TRANGTHAI?.trim() === nextStatus || isLoading) return;
        statusLocks.current.add(id);
        setSavingStatuses(new Set(statusLocks.current));
        try {
            const response = await dichVuApi.updateStatus(id, nextStatus);
            if (!response.data.success) throw new Error(response.data.message);
            const update = (rows: DichVu[]) => rows.map(item => item.MADV === id
                ? { ...item, TRANGTHAI: response.data.data.TRANGTHAI } : item);
            setDichVuList(update);
            setDichVuCSDList(update);
            toast.success('Đã cập nhật trạng thái dịch vụ.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Không đổi được trạng thái. Vui lòng thử lại.');
        } finally {
            statusLocks.current.delete(id);
            setSavingStatuses(new Set(statusLocks.current));
        }
    };
    //Form data và lỗi
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        serviceID: '', serviceName: '', serviceType: 'CT',
        serviceDesc: '', serviceTime: '', servicePrice: '',
        serviceStatus: 'Đang cung cấp', serviceProcedure: '',
    });
    //Xử lý preview ảnh
    const [previewImg, setPreviewImg] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);




    //up data từ api lên bảng
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [resToc, resCSD] = await Promise.all([
                dichVuApi.getAll(),
                dichVuApi.getAllCSD()
            ]);
            setDichVuList(resToc.data.data);
            setDichVuCSDList(resCSD.data.data);
        } catch (err) {
            setError("Không thể tải dữ liệu từ máy chủ.");
        } finally {
            setIsLoading(false);
        }
    };
    // Tải dữ liệu khi component mount
    useEffect(() => {
        fetchData();
    }, []);

    //xử lý thay đổi form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        // Cập nhật dữ liệu người dùng nhập vào formData
        setFormData((prev) => ({ ...prev, [id]: value }));

        //Tự động xóa lỗi của chính field đang được gõ
        if (formErrors[id]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id]; // Xóa thông báo lỗi của field này
                return newErrors;
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewImg(URL.createObjectURL(file));

            //Tự động xóa lỗi nếu đã chọn ảnh
            if (formErrors.serviceImg) {
                setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.serviceImg;
                    return newErrors;
                });
            }
        }

    };

    // Chuẩn bị form rỗng khi Thêm 
    const handleOpenAdd = () => {
        setFormData({
            serviceID: '', serviceName: '', serviceType: 'CT',
            serviceDesc: '', serviceTime: '', servicePrice: '',
            serviceStatus: 'Đang cung cấp', serviceProcedure: '',
        });
        setPreviewImg('');
        setImageFile(null);
        setFormErrors({}); // Xóa lỗi cũ
        setModalType('add');
    };

    //click nút sửa
    const handleEditClick = (row: DichVu) => {
        setFormData({
            serviceID: row.MADV || '',
            serviceName: row.TENDV || '',
            serviceType: row.LOAI || 'CT',
            serviceDesc: row.MOTA || '',
            serviceTime: row.THOIGIAN ? String(row.THOIGIAN) : '',
            servicePrice: row.GIADV ? String(row.GIADV) : '',
            serviceStatus: row.TRANGTHAI || 'Đang cung cấp',
            serviceProcedure: row.QUYTRINH || '',
        });
        setPreviewImg(row.HINH ? (row.HINH.startsWith('/') ? row.HINH : `/${row.HINH}`) : '');
        setFormErrors({}); // Xóa lỗi cũ
        setImageFile(null);
        setModalType('edit');

    };
    const handleDeleteClick = (row: DichVu) => {
        if (row.TRANGTHAI !== 'Ngừng cung cấp') {
            toast.error('Lỗi: Chỉ có thể xóa dịch vụ khi trạng thái là "Ngừng cung cấp"!');
            return;
        }
        setIdToDelete(row.MADV);
        setIsDeleteModalOpen(true);
    };

    //HÀM SUBMIT CHO CẢ THÊM VÀ SỬA
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        //Kiểm tra dữ liệu với Zod
        const validationResult = dichVuSchema.safeParse(formData);

        //có lỗi
        if (!validationResult.success) {
            const fieldErrors = validationResult.error.flatten().fieldErrors;
            const newErrors: Record<string, string> = {};

            // Lấy thông báo lỗi đầu tiên của mỗi trường
            for (const key in fieldErrors) {
                newErrors[key] = fieldErrors[key as keyof typeof fieldErrors]?.[0] || '';
            }

            setFormErrors(newErrors);
            return; // Dừng hàm lại, không gọi API
        }
        //hợp lệ
        setFormErrors({});
        //tạo FormData để gửi kèm file ảnh
        const submitData = new FormData();
        submitData.append('maDV', formData.serviceID);
        submitData.append('tenDV', formData.serviceName);
        submitData.append('moTa', formData.serviceDesc);
        submitData.append('thoiGian', String(formData.serviceTime));
        submitData.append('giaDV', String(formData.servicePrice));
        submitData.append('trangThai', formData.serviceStatus);
        submitData.append('quyTrinh', formData.serviceProcedure);
        submitData.append('loai', formData.serviceType);

        if (imageFile)
            submitData.append('fileAnh', imageFile);

        try {
            if (modalType === 'add') {

                await dichVuApi.create(submitData);
                toast.success("Thêm dịch vụ thành công!");
            } else {
                await dichVuApi.update(submitData);
                toast.success("Cập nhật dịch vụ thành công!");
            }
            setModalType('none'); // Đóng form
            fetchData(); // Tải lại dữ liệu
        } catch (error: any) {
            // HỨNG LỖI TỪ BACKEND
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Thao tác thất bại, vui lòng kiểm tra lại!");
            }
        }
    };

    // Xoá dịch vụ
    const handleDeleteConfirm = async () => {
        if (!idToDelete) return;
        try {
            await dichVuApi.delete(idToDelete);
            toast.success("Xóa dịch vụ thành công!");
            setIsDeleteModalOpen(false);
            fetchData(); // Load lại bảng
        } catch (error: any) {
            // HỨNG LỖI TỪ BACKEND
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Thao tác thất bại, vui lòng kiểm tra lại!");
            }
        }
    };
    //Định nghĩa cột cho DataTable
    const dichVuColumns: Column<DichVu>[] = [
        { tieude: "ID", cotnhandulieu: "MADV" },
        { tieude: "Tên dịch vụ", cotnhandulieu: "TENDV" },
        { tieude: "Thời gian", cotnhandulieu: "THOIGIAN", render: (row) => `${row.THOIGIAN} phút` },
        {
            tieude: "Giá", cotnhandulieu: "GIADV", render: (row) => {
                const value = parseFloat(row.GIADV as any);
                return value ? value.toLocaleString('vi-VN') + '₫' : "0₫";
            }

        },
        {
            tieude: "Trạng thái", cotnhandulieu: "TRANGTHAI", render: (row) => {
                return <fieldset className="service-status-options" aria-label={`Trạng thái ${row.TENDV}`} disabled={savingStatuses.has(row.MADV) || isLoading || modalType !== 'none' || isDeleteModalOpen}>
                    {serviceStatuses.map(value => <label key={value}>
                        <input type="radio" name={`service-status-${row.MADV}`} value={value}
                            checked={row.TRANGTHAI?.trim() === value}
                            onChange={() => handleStatusChange(row, value)} />
                        {value}
                    </label>)}
                    {savingStatuses.has(row.MADV) && <small role="status">Đang lưu…</small>}
                </fieldset>;
            }
        },
        {
            tieude: "Ảnh", cotnhandulieu: "HINH", render: (row) => {
                const imgPath = row.HINH?.startsWith('/') ? row.HINH : `/${row.HINH}`;
                return row.HINH ? <img src={imgPath} alt={row.TENDV} height="60" width="70" style={{ objectFit: 'cover', borderRadius: '4px' }} /> : <span style={{ color: '#999', fontSize: '12px' }}>Không có ảnh</span>;
            }
        },
        {
            tieude: "Hành động", cotnhandulieu: "MADV", render: (row) => (
                <>
                    <button className="ba-button" disabled={savingStatuses.has(row.MADV)} onClick={() => handleEditClick(row)}>Sửa</button>
                    <button
                        className="ba-button ba-danger"
                        disabled={savingStatuses.has(row.MADV)}
                        onClick={() => handleDeleteClick(row)}
                        title="Chỉ xoá những dịch vụ đã ngừng cung cấp!"
                    >
                        Xóa
                    </button>
                </>
            )
        },
    ];

    //HÀM RENDER FORM CHUNG CHO CẢ THÊM VÀ SỬA
    const renderFormContent = () => (
        <>
            <div className="form-group">
                <label htmlFor="serviceID">Mã dịch vụ:</label>
                {/* Khóa input ID nếu đang sửa */}
                <input type="text" id="serviceID" disabled={modalType === 'edit'} placeholder="VD: CSD001" value={formData.serviceID} onChange={handleChange} />
                {formErrors.serviceID && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceID}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="serviceName">Tên dịch vụ:</label>
                <input type="text" id="serviceName" value={formData.serviceName} onChange={handleChange} />
                {formErrors.serviceName && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceName}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="serviceType">Loại dịch vụ:</label>
                <select id="serviceType" value={formData.serviceType} onChange={handleChange}>
                    <option value="CT">Dịch vụ tóc</option>
                    <option value="CSD">Chăm sóc da</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="serviceDesc">Mô tả:</label>
                <textarea id="serviceDesc" rows={3} value={formData.serviceDesc} onChange={handleChange} />
                {formErrors.serviceDesc && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceDesc}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="serviceTime">Thời gian (phút):</label>
                <input type="number" id="serviceTime" value={formData.serviceTime} onChange={handleChange} />
                {formErrors.serviceTime && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceTime}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="servicePrice">Giá (VND):</label>
                <input type="number" id="servicePrice" value={formData.servicePrice} onChange={handleChange} />
                {formErrors.servicePrice && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.servicePrice}</span>}
            </div>
            <fieldset className="service-status-options">
                <legend>Trạng thái dịch vụ</legend>
                {serviceStatuses.map(value => <label key={value}>
                    <input type="radio" name="form-service-status" value={value}
                        checked={formData.serviceStatus === value}
                        onChange={() => setFormData(prev => ({ ...prev, serviceStatus: value }))} />
                    {value}
                </label>)}
            </fieldset>
            <div className="form-group">
                <label htmlFor="serviceImg">Ảnh (Chọn để thay đổi):</label>
                {formErrors.serviceImg && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceImg}</span>}
                <input type="file" accept="image/*" id="serviceImg" onChange={handleImageChange} />
                {previewImg && <img src={previewImg} alt="Preview" style={{ marginTop: '10px', maxWidth: '200px' }} />}
            </div>
            <div className="form-group">
                <label htmlFor="serviceProcedure">Quy trình:</label>
                <textarea id="serviceProcedure" rows={3} value={formData.serviceProcedure} onChange={handleChange} />
                {formErrors.serviceProcedure && <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.serviceProcedure}</span>}

            </div>
            <button type="submit" className="ba-button ba-primary">{modalType === 'add' ? 'Lưu mới' : 'Cập nhật'}</button>
        </>
    );

    return (
        <div id="services" className="section admin-page">
            <header className="ba-heading"><div><p className="ba-eyebrow">QUẢN LÝ SALON</p><h2>Dịch vụ</h2><p>Quản lý dịch vụ tóc, chăm sóc da và thư giãn.</p></div><div className="ba-actions"><button className="ba-button" disabled={isLoading || savingStatuses.size > 0} onClick={fetchData}>Làm mới</button><button className="ba-button ba-primary" onClick={handleOpenAdd}>Thêm dịch vụ</button></div></header>

            <AdminList<DichVu> title="Dịch vụ tóc" columns={dichVuColumns} data={dichVuList} rowKey="MADV" searchKeys={["MADV", "TENDV"]} statusKey="TRANGTHAI"  isLoading={isLoading} error={error} onRetry={fetchData} />

            <AdminList<DichVu> title="Chăm sóc da & Thư giãn" columns={dichVuColumns} data={dichVuCSDList} rowKey="MADV" searchKeys={["MADV", "TENDV"]} statusKey="TRANGTHAI"  isLoading={isLoading} error={error} onRetry={fetchData} />

            {/* DÙNG CHUNG MODAL CHO CẢ THÊM VÀ SỬA */}
            <Modal isOpen={modalType !== 'none'} onClose={() => setModalType('none')} title={modalType === 'add' ? "Thêm mới dịch vụ" : "Sửa thông tin dịch vụ"}>
                <form className="ba-form" onSubmit={handleSubmitForm}>
                    {renderFormContent()}
                </form>
            </Modal>

            {/* Modal xóa */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Xác nhận Xóa">
                <p>Bạn có chắc chắn muốn xóa dịch vụ mã <strong>{idToDelete}</strong> không?</p><br />
                <button className="ba-button ba-danger" onClick={handleDeleteConfirm}>Xóa ngay</button>
            </Modal>
        </div>
    );
};

export default DichVuPage;

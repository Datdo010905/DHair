// Tra cứu hóa đơn tự sinh từ lịch hoàn thành; gửi lựa chọn thu tiền để backend tính lại.
import React, { useEffect, useState, useRef } from 'react';
import Modal from '../../components/ui/Modal';
import { useSearch } from '../../context/SearchContext';
import { toast } from 'react-toastify';
import DataTable, { Column } from '../../components/ui/DataTable';
import bookingApi, { Booking } from '../../api/bookingApi';
import hoadonApi, { HoaDon, HoaDonDetails } from '../../api/hoadonApi';
import axiosClient from '../../api/axiosClient';
import customerApi, { Customer } from '../../api/customerApi';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import staffApi, { NhanVien } from '../../api/staffApi';
import KhuyenMaiApi, { KhuyenMai } from '../../api/khuyenmaiApi';
import '../../assets/css/booking-admin.css';
import '../../assets/css/invoice-admin.css';
const money = (value: number) => Number(value || 0).toLocaleString('vi-VN') + ' ₫';
const dateKey = (value: string) => (value ? value.slice(0, 10) : '');
const HoaDonPage = () => {
  const [modalType, setModalType] = useState<'addDetails' | 'edit' | 'none'>('none');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null); // Lưu ID cần xóa
  const [IDtoView, setIDtoView] = useState<string | null>(null); // Lưu ID cần xem chi tiết
  const today = new Date().toISOString().split('T')[0];
  const quyenHientai = localStorage.getItem('phanquyen') || 0;
  const { searchTerm } = useSearch();
  const [hoadonList, setHoadonList] = useState<HoaDon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
  const [nhanVienList, setNhanVienList] = useState<NhanVien[]>([]);
  const [khuyenMaiList, setKhuyenMaiList] = useState<KhuyenMai[]>([]);
  const [viewDetailsList, setViewDetailsList] = useState<HoaDonDetails[]>([]);
  const [editSubtotal, setEditSubtotal] = useState<number | null>(null);
  const [editPriceError, setEditPriceError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [branches, setBranches] = useState<{ MACHINHANH: string; TENCHINHANH: string | null }[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const fetchVersion = useRef(0);
  const detailVersion = useRef(0);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const customers = new Map(customerList.map((item) => [item.MAKH?.trim(), item]));
  const staff = new Map(nhanVienList.map((item) => [item.MANV?.trim(), item]));
  const bookings = new Map(bookingList.map((item) => [item.MALICH.trim(), item]));
  const branchNames = new Map(branches.map((item) => [item.MACHINHANH.trim(), item.TENCHINHANH]));
  // Doanh thu thuộc chi nhánh của lịch, không suy ra từ nơi làm việc hiện tại của thu ngân.
  const invoiceBranch = (invoice: HoaDon) =>
    bookings.get(invoice.MALICH?.trim())?.MACHINHANH?.trim() || '';
  const branchLabel = (id: string) => branchNames.get(id) || id || 'Chưa xác định chi nhánh';
  const branchIds = Array.from(new Set([
    ...branches.map((item) => item.MACHINHANH.trim()),
    ...hoadonList.map(invoiceBranch).filter(Boolean),
  ])).sort();
  const selectedBranchLabel = branchFilter === 'unknown'
    ? 'Chưa xác định chi nhánh'
    : branchFilter ? branchLabel(branchFilter) : 'Tất cả chi nhánh';
  const matchingInvoices = hoadonList
    .filter((hd) => {
      const customer = customers.get(hd.MAKH?.trim());
      const cashier = staff.get(hd.MANV?.trim());
      const haystack = [
        hd.MAHD,
        hd.MALICH,
        hd.MAKH,
        hd.MANV,
        customer?.HOTEN,
        customer?.SDT,
        cashier?.HOTEN,
        hd.TRANGTHAI,
      ]
        .join(' ')
        .toLocaleLowerCase('vi');
      const day = dateKey(hd.NGAYTHANHTOAN);
      return (
        [searchTerm, query].every((term) =>
          haystack.includes(term.trim().toLocaleLowerCase('vi')),
        ) &&
        (!paymentFilter || hd.HINHTHUCTHANHTOAN?.trim() === paymentFilter) &&
        (!branchFilter || (branchFilter === 'unknown' ? !invoiceBranch(hd) : invoiceBranch(hd) === branchFilter)) &&
        (!dateRange.start || day >= dateRange.start) &&
        (!dateRange.end || (!!day && day <= dateRange.end))
      );
    })
    .sort(
      (a, b) =>
        (b.NGAYTHANHTOAN || '').localeCompare(a.NGAYTHANHTOAN || '') ||
        b.MAHD.localeCompare(a.MAHD),
    );
  const filteredHoadonList = matchingInvoices.filter(
    (row) => !statusFilter || row.TRANGTHAI?.trim() === statusFilter,
  );
  const invoiceStatuses = ['', 'Chưa thanh toán', 'Đã thanh toán', 'Đã huỷ'];
  const statusClass = (status: string) =>
    status === 'Chưa thanh toán' ? 2 : status === 'Đã thanh toán' ? 3 : 4;
  const totalPages = Math.max(1, Math.ceil(filteredHoadonList.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredHoadonList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paid = filteredHoadonList.filter((row) => row.TRANGTHAI?.trim() === 'Đã thanh toán');
  const unpaid = filteredHoadonList.filter((row) => row.TRANGTHAI?.trim() === 'Chưa thanh toán');
  useEffect(() => {
    setPage(1);
  }, [searchTerm, query, statusFilter, paymentFilter, branchFilter, dateRange, pageSize]);
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);
  const fetchData = async () => {
    const version = ++fetchVersion.current;
    setIsLoading(true);
    setError(null);
    try {
      const responses = await Promise.all([
        hoadonApi.getAll(),
        staffApi.getAll(),
        customerApi.getAll(),
        dichVuApi.getAll(),
        bookingApi.getAll(),
        KhuyenMaiApi.getAll(),
        dichVuApi.getAllCSD(),
        axiosClient.get('/api/lichhen/booking-options'),
      ]);
      if (version !== fetchVersion.current) return;
      if (responses.some((res) => !res.data.success)) throw new Error('Không thể tải dữ liệu');
      const [invoices, employees, clients, hairServices, bookings, promotions, skinServices, options] =
        responses;
      setHoadonList(invoices.data.data || []);
      setNhanVienList(employees.data.data || []);
      setCustomerList(clients.data.data || []);
      // Hai API tách riêng dịch vụ tóc và chăm sóc da, gồm cả dịch vụ đã ngừng cung cấp cho hóa đơn cũ.
      setDichVuList([...(hairServices.data.data || []), ...(skinServices.data.data || [])]);
      setBookingList(bookings.data.data || []);
      setKhuyenMaiList(promotions.data.data || []);
      setBranches(options.data.data.branches || []);
    } catch {
      if (version === fetchVersion.current)
        setError('Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại.');
    } finally {
      if (version === fetchVersion.current) setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // Giữ các ref bộ đếm, rồi tăng giá trị mới nhất để vô hiệu hóa request khi rời trang.
    const requestVersions = [fetchVersion, detailVersion];
    return () => {
      requestVersions.forEach((version) => version.current++);
    };
  }, []);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    hoadonID: '',
    khachhangID: '',
    khuyenmaiID: '',
    bookingID: '',
    nhanvienID: '',
    sum: '',
    methodPayment: '',
    status: '',
    branchID: '',
    dateThanhToan: today,
  });
  const [formDataDetails, setFormDataDetails] = useState({
    hoadonID: '',
    dichvuID: '',
    soluongdung: '',
    dongiadv: '',
    thanhtiendv: '',
  });
  const [formDataTK, setFormDataTK] = useState({
    start: '',
    end: '',
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormDataDetails((prev) => ({ ...prev, [id]: value }));
    setFormDataTK((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id]; // Xóa thông báo lỗi của field này
        return newErrors;
      });
    }
  };
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveLock.current) return;
    if (
      modalType !== 'edit' &&
      (!Number.isInteger(Number(formDataDetails.soluongdung)) ||
        Number(formDataDetails.soluongdung) < 1)
    ) {
      setFormErrors({ soluongdung: 'Số lượng phải là số nguyên lớn hơn 0.' });
      return;
    }
    if (modalType === 'edit' && formData.status === 'Đã thanh toán') {
      if (!formData.nhanvienID) {
        setFormErrors({ nhanvienID: 'Thu ngân không được để trống' });
        return;
      }
      if (!formData.methodPayment) {
        setFormErrors({ methodPayment: 'Hình thức thanh toán không được để trống' });
        return;
      }
    }
    setFormErrors({});
    const finalTongTien = Math.round(Number(formData.sum || 0));
    const ngayTT = formData.dateThanhToan; // Lấy lại ngày cũ đã lưu trong state khi sửa
    const submitData: HoaDon = {
      MAHD: formData.hoadonID.trim(),
      MAKH: formData.khachhangID.trim() || '',
      MAKM: formData.khuyenmaiID.trim() || '',
      MALICH: formData.bookingID.trim() || '',
      MANV: formData.nhanvienID.trim(),
      TONGTIEN: finalTongTien,
      HINHTHUCTHANHTOAN: formData.methodPayment.trim(),
      TRANGTHAI: formData.status.trim() || 'Chưa thanh toán',
      NGAYTT: ngayTT,
    } as any; // Ép kiểu vì có biến phụ NGAYTT
    const dichVuChon = dichVuList.find(
      (dv) => dv.MADV?.trim() === formDataDetails.dichvuID?.trim(),
    );
    const donGiaCT = dichVuChon ? Number(dichVuChon.GIADV) : 0;
    const submitDataCT: HoaDonDetails = {
      MAHD: formData.hoadonID.trim(),
      MADV: formDataDetails.dichvuID.trim(),
      SOLUONG: Number(formDataDetails.soluongdung),
      DONGIA: donGiaCT,
      THANHTIEN: (donGiaCT * Number(formDataDetails.soluongdung)).toString(),
    };
    const trangthaiHienTai = hoadonList
      .find((b) => b.MAHD?.trim() === formData.hoadonID?.trim())
      ?.TRANGTHAI?.trim();
    saveLock.current = true;
    setSaving(true);
    try {
      if (modalType === 'edit') {
        if (trangthaiHienTai === 'Đã huỷ' || trangthaiHienTai === 'Đã thanh toán') {
          toast.error('Hóa đơn đã ' + trangthaiHienTai + ', không thể thay đổi trạng thái nữa!');
          return;
        }
        await hoadonApi.update(formData.hoadonID, submitData);
        toast.success('Cập nhật hóa đơn thành công!');
      } else {
        if (trangthaiHienTai !== 'Chưa thanh toán') {
          toast.error('Chỉ có thể thêm chi tiết cho hóa đơn ở trạng thái Chưa thanh toán!');
          return;
        }
        if (!formDataDetails.dichvuID || !formDataDetails.soluongdung) {
          toast.error('Dịch vụ, số lượng không được để trống!');
          return;
        }
        await hoadonApi.createCT(submitDataCT);
        toast.success('Thêm chi tiết hóa đơn thành công!');
      }
      setModalType('none'); // Đóng form
      fetchData(); // Tải lại dữ liệu
    } catch (error: any) {
      console.error('Lỗi:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Thao tác thất bại, vui lòng kiểm tra lại!');
      }
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!idToDelete) return;
    if (quyenHientai !== '1' && quyenHientai !== '2') {
      toast.error('Bạn không có quyền xóa hoá đơn!');
      return;
    }
    try {
      const hoadon = hoadonList.find((b) => b.MAHD.trim() === idToDelete.trim());
      if (hoadon?.TRANGTHAI.trim() !== 'Đã huỷ') {
        toast.error('Chỉ có thể xóa những hóa đơn đã huỷ!');
        return;
      }
      const response = await hoadonApi.deleteFull(idToDelete);
      if (response.data.success) {
        toast.success(response.data.message || 'Xóa hóa đơn thành công!');
        setIsDeleteModalOpen(false);
        fetchData(); // Load lại bảng
      }
      if (idToDelete === IDtoView) {
        setIDtoView(null);
        setViewDetailsList([]);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Thao tác thất bại, vui lòng kiểm tra lại!');
      }
    }
  };
  const handleDeleteClick = (row: HoaDon) => {
    setIdToDelete(row.MAHD.trim() || null);
    setIsDeleteModalOpen(true);
  };
  const handleViewClick = async (row: HoaDon) => {
    const version = ++detailVersion.current;
    setIDtoView(row.MAHD.trim());
    setViewDetailsList([]);
    setDetailsLoading(true);
    try {
      const response = await hoadonApi.getByIdCT(row.MAHD.trim());
      if (version !== detailVersion.current) return;
      if (!response.data.success) throw new Error();
      const data = response.data.data;
      setViewDetailsList(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      if (version === detailVersion.current)
        toast.error('Không tải được chi tiết hóa đơn. Vui lòng thử lại.');
    } finally {
      if (version === detailVersion.current) setDetailsLoading(false);
    }
  };
  const handleEditClick = async (row: HoaDon) => {
    const thuNgan = nhanVienList.find((nv) => nv.MANV?.trim() === row.MANV?.trim());
    const machiNhanh = thuNgan ? thuNgan.MACHINHANH?.trim() : '';
    setFormData({
      hoadonID: String(row.MAHD || '').trim(),
      khachhangID: String(row.MAKH || '').trim(),
      khuyenmaiID: String(row.MAKM || '').trim(),
      bookingID: String(row.MALICH || '').trim(),
      nhanvienID: String(row.MANV || '').trim(),
      sum: row.TONGTIEN != null ? String(row.TONGTIEN) : '',
      methodPayment: String(row.HINHTHUCTHANHTOAN || ''),
      status: String(row.TRANGTHAI || '').trim() || 'Chưa thanh toán',
      branchID: machiNhanh,
      dateThanhToan: row.NGAYTHANHTOAN ? String(row.NGAYTHANHTOAN).split('T')[0] : '',
    });
    setFormErrors({}); // Xóa lỗi cũ
    setModalType('edit');
  };
  // Hóa đơn gắn lịch lấy giá từ lịch; hóa đơn lẻ lấy chi tiết đã lưu.
  useEffect(() => {
    if (modalType !== 'edit') return;
    let active = true;
    setEditSubtotal(null);
    setEditPriceError('');
    const request = formData.bookingID
      ? bookingApi.getByIdCT(formData.bookingID)
      : hoadonApi.getByIdCT(formData.hoadonID);
    request
      .then((response) => {
        if (!active) return;
        if (!response.data.success || !Array.isArray(response.data.data)) throw new Error();
        const total = response.data.data.reduce(
          (sum: number, item: any) =>
            sum + Number(formData.bookingID ? item.GIA_DUKIEN : item.THANHTIEN),
          0,
        );
        if (!Number.isFinite(total)) throw new Error();
        setEditSubtotal(total);
      })
      .catch(() => {
        if (active) setEditPriceError('Không tải được số tiền. Đóng và mở lại hóa đơn để thử lại.');
      });
    return () => {
      active = false;
    };
  }, [modalType, formData.hoadonID, formData.bookingID]);
  const selectedDiscount = Number(
    khuyenMaiList.find((item) => item.MAKM.trim() === formData.khuyenmaiID)?.GIATRI || 0,
  );
  const previewTotal =
    editSubtotal === null ? null : Math.round(editSubtotal * (1 - selectedDiscount / 100));
  const handleAddDetailsClick = async (row: HoaDon) => {
    const thuNgan = nhanVienList.find((nv) => nv.MANV.trim() === row.MANV.trim());
    const machiNhanh = thuNgan?.MACHINHANH?.trim() || '';
    setFormData({
      hoadonID: String(row.MAHD || '').trim(),
      khachhangID: String(row.MAKH || '').trim(),
      khuyenmaiID: String(row.MAKM || '').trim(),
      bookingID: String(row.MALICH || '').trim(),
      nhanvienID: String(row.MANV || '').trim(),
      sum: String(row.TONGTIEN) || '',
      methodPayment: String(row.HINHTHUCTHANHTOAN || ''),
      status: String(row.TRANGTHAI || '').trim() || 'Chưa thanh toán',
      branchID: machiNhanh,
      dateThanhToan: String(row.NGAYTHANHTOAN) || 'Không xác định',
    });
    setFormDataDetails({
      hoadonID: String(row.MAHD || ''),
      dichvuID: '',
      soluongdung: '',
      dongiadv: '',
      thanhtiendv: '',
    });
    setFormErrors({}); // Xóa lỗi cũ
    setModalType('addDetails');
  };
  const chiNhanhhoacLich =
    formData.bookingID && formData.bookingID !== ''
      ? bookingList.find((b) => b.MALICH.trim() === formData.bookingID?.trim())?.MACHINHANH
      : formData.branchID;
  const renderFormContent = () => (
    <>
      <div className="form-group">
        <label>Mã hoá đơn:</label>
        <input
          type="text"
          id="hoadonID"
          placeholder="Nhập mã hoá đơn..."
          value={formData.hoadonID.trim() || formDataDetails.hoadonID.trim()}
          onChange={handleChange}
          disabled={true}
        />
        {formErrors.hoadonID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.hoadonID}</span>
        )}
      </div>
      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Lịch hẹn:</label>
        <select
          id="bookingID"
          disabled={modalType === 'edit'}
          value={formData.bookingID}
          onChange={handleChange}
        >
          <option value="">Không có lịch hẹn</option>
          {formData.bookingID && formData.bookingID !== '' && (
            <option value={formData.bookingID?.trim()}>{formData.bookingID?.trim()}</option>
          )}
        </select>
        {formErrors.bookingID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.bookingID}</span>
        )}
      </div>

      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Khách hàng:</label>
        <select
          disabled={true}
          id="khachhangID"
          value={formData.khachhangID}
          onChange={handleChange}
        >
          <option value="">-- Chọn khách hàng --</option>
          {customerList.map((customer) => (
            <option key={customer.MAKH?.trim()} value={customer.MAKH?.trim()}>
              ({customer.SDT}) {customer.HOTEN}
            </option>
          ))}
        </select>
        {formErrors.khachhangID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.khachhangID}</span>
        )}
      </div>
      <div hidden={modalType === 'edit' || modalType === 'addDetails'} className="form-group">
        <label>Chi Nhánh:</label>
        <select id="branchID" value={formData.branchID} onChange={handleChange}>
          <option value="">-- Chọn chi nhánh --</option>
          <option value="CN001">DHair - Nguyễn Trãi</option>
          <option value="CN002">DHair - Cầu Giấy</option>
          <option value="CN003">DHair - Tân Bình</option>
          <option value="CN004">DHair - Đà Nẵng</option>
        </select>
        {formErrors.branchID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.branchID}</span>
        )}
      </div>
      <div hidden={modalType === 'edit'} className="form-group">
        <label>Dịch vụ:</label>
        <select id="dichvuID" value={formDataDetails.dichvuID} onChange={handleChange}>
          <option value="">-- Chọn dịch vụ --</option>
          {dichVuList.map((dv) => (
            <option key={dv.MADV?.trim()} value={dv.MADV?.trim()}>
              {dv.TENDV} - {Number(dv.GIADV).toLocaleString('vi-VN')}₫
            </option>
          ))}
        </select>
        {formErrors.dichvuID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.dichvuID}</span>
        )}
      </div>
      <div hidden={modalType === 'edit'} className="form-group">
        <label>Số lượng:</label>
        <input
          type="number"
          id="soluongdung"
          placeholder="Nhập số lượng..."
          value={formDataDetails.soluongdung}
          onChange={handleChange}
        />
        {formErrors.soluongdung && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.soluongdung}</span>
        )}
      </div>

      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Khuyến mại:</label>
        <select id="khuyenmaiID" value={formData.khuyenmaiID} onChange={handleChange}>
          <option value="">-- Chọn khuyến mại --</option>
          {khuyenMaiList
            .filter(
              (km) =>
                km.TRANGTHAI?.trim() === 'Đang áp dụng' || km.MAKM?.trim() === formData.khuyenmaiID,
            )
            .map((km) => (
              <option key={km.MAKM?.trim()} value={km.MAKM?.trim()}>
                {km.TENKM} ({km.MOTA})
              </option>
            ))}
          ;
        </select>
        {formErrors.khuyenmaiID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.khuyenmaiID}</span>
        )}
      </div>

      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Thu ngân:</label>
        <select id="nhanvienID" value={formData.nhanvienID} onChange={handleChange}>
          <option value="">-- Chọn thu ngân --</option>
          {/* lọc nhân viên theo chi nhánh đã chọn và chức vụ */}
          {/* hoặc chọn lịch thì lọc theo thu ngân từ chi nhánh của lịch đó */}
          {nhanVienList
            .filter(
              (nv) =>
                nv.MACHINHANH?.trim() === chiNhanhhoacLich?.trim() &&
                nv.CHUCVU?.trim() === 'Thu ngân',
            )
            .map((nv) => (
              <option key={nv.MANV?.trim()} value={nv.MANV?.trim()}>
                {nv.MANV} - {nv.HOTEN} {`(${nv.SDT})`}
              </option>
            ))}
        </select>
        {formErrors.nhanvienID && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.nhanvienID}</span>
        )}
      </div>
      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Tổng tiền:</label>
        <input
          readOnly
          type="text"
          id="sum"
          value={previewTotal === null ? 'Đang tải…' : money(previewTotal)}
        />
        {editSubtotal !== null && (
          <small>
            Tiền dịch vụ: {money(editSubtotal)} · Giảm: {selectedDiscount}%
          </small>
        )}
        {editPriceError && <p role="alert">{editPriceError}</p>}
        {formData.bookingID && <small>Dịch vụ và giá được lấy đầy đủ từ lịch hẹn.</small>}
        {formErrors.sum && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.sum}</span>
        )}
      </div>

      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Ngày thanh toán:</label>
        <p>
          Tự ghi nhận khi xác nhận “Đã thanh toán”. Hóa đơn chưa thanh toán chưa có ngày thu tiền.
        </p>
      </div>
      <div hidden={modalType === 'addDetails'} className="form-group">
        <label>Hình thức thanh toán:</label>
        <select id="methodPayment" value={formData.methodPayment} onChange={handleChange}>
          <option value="">-- Chọn hình thức --</option>
          <option value="Tiền mặt">Tiền mặt</option>
          <option value="Thẻ tín dụng">Thẻ tín dụng</option>
          <option value="Chuyển khoản">Chuyển khoản</option>
          <option value="Ví điện tử">Ví điện tử</option>
        </select>
        {formErrors.methodPayment && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.methodPayment}</span>
        )}
      </div>

      <div hidden={modalType !== 'edit'} className="form-group">
        <label>Trạng thái:</label>
        <select id="status" value={formData.status} onChange={handleChange}>
          <option value="Chưa thanh toán">Chưa thanh toán</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
          <option value="Đã huỷ">Đã huỷ</option>
        </select>
        {formErrors.status && (
          <span style={{ color: 'red', fontSize: '0.85rem' }}>{formErrors.status}</span>
        )}
      </div>
      <button
        disabled={
          saving || (modalType === 'edit' && formData.status !== 'Đã huỷ' && editSubtotal === null)
        }
        type="submit"
        className="ba-button ba-primary"
      >
        {saving
          ? 'Đang lưu…'
          : formData.status === 'Đã thanh toán'
            ? 'Xác nhận thanh toán'
            : 'Cập nhật'}
      </button>
    </>
  );
  const hoadonColumns: Column<HoaDon>[] = [
    { tieude: 'Mã hóa đơn', cotnhandulieu: 'MAHD' },
    {
      tieude: 'Chi nhánh',
      cotnhandulieu: 'MALICH',
      render: (row) => branchLabel(invoiceBranch(row)),
    },
    {
      tieude: 'Ngày thanh toán',
      cotnhandulieu: 'NGAYTHANHTOAN',
      render(row) {
        return row.NGAYTHANHTOAN
          ? new Date(row.NGAYTHANHTOAN).toLocaleDateString('vi-VN')
          : 'Chưa có';
      },
    },
    {
      tieude: 'Khách hàng',
      cotnhandulieu: 'MAKH',
      render: (row) => {
        const tenkh = customerList.find((kh) => kh.MAKH?.trim() === row.MAKH?.trim())?.HOTEN;
        return (
          <div>
            <strong>{tenkh || 'Khách vãng lai'}</strong>
            <small>{customers.get(row.MAKH?.trim())?.SDT || row.MAKH || '—'}</small>
          </div>
        );
      },
    },
    {
      tieude: 'Thu ngân',
      cotnhandulieu: 'MANV',
      render: (row) => {
        const tennv = nhanVienList.find((nv) => nv.MANV?.trim() === row.MANV?.trim())?.HOTEN;
        return tennv || row.MANV || '—';
      },
    },
    {
      tieude: 'Tổng tiền',
      cotnhandulieu: 'TONGTIEN',
      render(row) {
        const value = parseFloat(row.TONGTIEN as any);
        return value ? value.toLocaleString('vi-VN') + '₫' : '0₫';
      },
    },
    {
      tieude: 'Hình thức thanh toán',
      cotnhandulieu: 'HINHTHUCTHANHTOAN',
      render: (row) => {
        const method = row.HINHTHUCTHANHTOAN || 'Không xác định';
        return <span className="ba-status">{method}</span>;
      },
    },
    {
      tieude: 'Trạng thái',
      cotnhandulieu: 'TRANGTHAI',
      render: (row) => {
        const status = row.TRANGTHAI?.trim();
        return (
          <span className={`ba-status ${status ? 'ba-status-' + statusClass(status) : ''}`}>
            {status || 'Không xác định'}
          </span>
        );
      },
    },
    {
      tieude: 'Hành động',
      cotnhandulieu: 'MALICH',
      render: (row) => (
        <div className="ba-row-actions">
          <button onClick={() => handleViewClick(row)}>Chi tiết</button>
          {row.TRANGTHAI?.trim() === 'Chưa thanh toán' && (
            <>
              {!row.MALICH && (
                <button onClick={() => handleAddDetailsClick(row)}>Thêm dịch vụ</button>
              )}
              <button onClick={() => handleEditClick(row)}>Cập nhật</button>
            </>
          )}
          {row.TRANGTHAI?.trim() === 'Đã huỷ' && ['1', '2'].includes(String(quyenHientai)) && (
            <button className="ba-danger" onClick={() => handleDeleteClick(row)}>
              Xóa
            </button>
          )}
        </div>
      ),
    },
  ];
  const hoadonDetailsColumns: Column<HoaDonDetails>[] = [
    { tieude: 'Mã hóa đơn', cotnhandulieu: 'MAHD' },
    {
      tieude: 'Mã dịch vụ',
      cotnhandulieu: 'MADV',
      render(row) {
        const dichVu = dichVuList.find((dv) => dv.MADV?.trim() === row.MADV?.trim());
        return dichVu ? dichVu.TENDV : 'Không xác định';
      },
    },
    { tieude: 'Số lượng', cotnhandulieu: 'SOLUONG' },
    {
      tieude: 'Đơn giá',
      cotnhandulieu: 'DONGIA',
      render(row) {
        const value = parseFloat(row.DONGIA as any);
        return value ? value.toLocaleString('vi-VN') + '₫' : '0₫';
      },
    },
    {
      tieude: 'Thành tiền',
      cotnhandulieu: 'THANHTIEN',
      render(row) {
        const value = parseFloat(row.THANHTIEN as any);
        return value ? value.toLocaleString('vi-VN') + '₫' : '0₫';
      },
    },
  ];
  const handleClickReport = () => {
    if (formDataTK.start && formDataTK.end && formDataTK.start > formDataTK.end) {
      toast.warn('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
      return;
    }
    setDateRange({ ...formDataTK });
  };
  const resetFilters = () => {
    setQuery('');
    setStatusFilter('');
    setPaymentFilter('');
    setBranchFilter('');
    setFormDataTK({ start: '', end: '' });
    setDateRange({ start: '', end: '' });
  };
  return (
    <>
      <div id="invoices" className="section invoice-admin">
        <header className="ba-heading">
          <div>
            <p className="ba-eyebrow">QUẢN LÝ SALON</p>
            <h2>Hóa đơn</h2>
            <p>Tra cứu hóa đơn, theo dõi thanh toán và dịch vụ của khách hàng.</p>
          </div>
          <div className="ba-actions">
            <button className="ba-button" disabled={isLoading} onClick={fetchData}>
              Làm mới
            </button>
          </div>
        </header>
        <div className="invoice-summary" aria-label="Thống kê hóa đơn">
          <article>
            <span>Hóa đơn phù hợp</span>
            <strong>{isLoading || error ? '—' : filteredHoadonList.length}</strong>
            <small>Theo bộ lọc đang áp dụng</small>
          </article>
          <article className="paid">
            <span>Đã thu · {selectedBranchLabel}</span>
            <strong>
              {isLoading || error
                ? '—'
                : money(paid.reduce((sum, row) => sum + Number(row.TONGTIEN), 0))}
            </strong>
            <small>{paid.length} hóa đơn</small>
          </article>
          <article className="unpaid">
            <span>Chưa thanh toán</span>
            <strong>
              {isLoading || error
                ? '—'
                : money(unpaid.reduce((sum, row) => sum + Number(row.TONGTIEN), 0))}
            </strong>
            <small>{unpaid.length} hóa đơn</small>
          </article>
          <article>
            <span>Đã huỷ</span>
            <strong>
              {isLoading || error
                ? '—'
                : filteredHoadonList.filter((row) => row.TRANGTHAI?.trim() === 'Đã huỷ').length}
            </strong>
            <small>Không tính vào số tiền thanh toán</small>
          </article>
        </div>
        <section className="ba-card" aria-label="Danh sách hóa đơn" aria-busy={isLoading}>
          <div className="ba-filters" aria-label="Bộ lọc hóa đơn">
            <label className="ba-search">
              Tìm hóa đơn
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mã hóa đơn, tên khách, SĐT, thu ngân…"
              />
            </label>
            <label>
              Chi nhánh
              <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)}>
                <option value="">Tất cả chi nhánh</option>
                {branchIds.map((id) => <option key={id} value={id}>{branchLabel(id)}</option>)}
                <option value="unknown">Chưa xác định chi nhánh</option>
              </select>
            </label>
            <label>
              Hình thức thanh toán
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="">Tất cả hình thức</option>
                {['Tiền mặt', 'Thẻ tín dụng', 'Chuyển khoản', 'Ví điện tử'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Từ ngày
              <input
                value={formDataTK.start}
                onChange={(e) => setFormDataTK((prev) => ({ ...prev, start: e.target.value }))}
                type="date"
              />
            </label>
            <label>
              Đến ngày
              <input
                value={formDataTK.end}
                onChange={(e) => setFormDataTK((prev) => ({ ...prev, end: e.target.value }))}
                type="date"
              />
            </label>
            <div className="ba-actions">
              <button onClick={handleClickReport} className="ba-button ba-primary">
                Áp dụng ngày
              </button>
              <button onClick={resetFilters} className="ba-button">
                Xóa bộ lọc
              </button>
            </div>
            <p className="invoice-filter-note">
              Chi nhánh: {selectedBranchLabel}.{' '}
              Ngày thanh toán: {dateRange.start || 'Từ đầu'} → {dateRange.end || 'Đến nay'}. Thống
              kê tính trên tất cả kết quả phù hợp, bao gồm các trang khác.
              {' '}Đã thu chỉ bao gồm hóa đơn đã thanh toán và chịu ảnh hưởng của các bộ lọc đang chọn.
              {searchTerm && ` Tìm kiếm chung: “${searchTerm}”.`}
            </p>
          </div>
          <div className="ba-status-filters" aria-label="Lọc nhanh theo trạng thái">
            {invoiceStatuses.map((status) => (
              <button
                key={status}
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                <span className={`ba-dot ba-dot-${status ? statusClass(status) + 1 : 0}`} />
                {status || 'Tất cả'}{' '}
                <b>
                  {isLoading || error
                    ? '…'
                    : matchingInvoices.filter((row) => !status || row.TRANGTHAI?.trim() === status)
                        .length}
                </b>
              </button>
            ))}
          </div>
          <div className="ba-list-heading">
            <h3>Danh sách hóa đơn</h3>
            <span>Mới nhất trước</span>
          </div>
          {isLoading ? (
            <div className="ba-empty" role="status">
              Đang tải hóa đơn…
            </div>
          ) : error ? (
            <div className="ba-empty ba-error" role="alert">
              {error}
              <button className="ba-button" onClick={fetchData}>
                Thử lại
              </button>
            </div>
          ) : !pageItems.length ? (
            <div className="ba-empty">
              <strong>Không có hóa đơn phù hợp</strong>
              <p>Thử đổi khoảng ngày hoặc xóa bộ lọc để xem thêm.</p>
            </div>
          ) : (
            <div className="ba-table-scroll">
              <table className="ba-table invoice-table">
                <thead>
                  <tr>
                    {hoadonColumns.map((column) => (
                      <th key={column.tieude}>{column.tieude}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((row) => (
                    <tr key={row.MAHD}>
                      {hoadonColumns.map((column) => (
                        <td key={column.tieude}>
                          {column.render ? column.render(row) : row[column.cotnhandulieu]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="ba-pagination">
            <span>
              {filteredHoadonList.length ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filteredHoadonList.length)} /{' '}
              {filteredHoadonList.length} hóa đơn
            </span>
            <label>
              Số dòng
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <div className="ba-actions">
              <button
                className="ba-button"
                disabled={isLoading || !!error || currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Trước
              </button>
              <span>
                Trang {currentPage}/{totalPages}
              </span>
              <button
                className="ba-button"
                disabled={isLoading || !!error || currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </section>
        <Modal
          isOpen={!!IDtoView}
          onClose={() => {
            detailVersion.current++;
            setIDtoView(null);
            setViewDetailsList([]);
          }}
          title={`Chi tiết hóa đơn ${IDtoView || ''}`}
        >
          <div className="ba-detail">
            <div className="ba-detail-item">
              <strong>
                {customers.get(
                  hoadonList.find((row) => row.MAHD.trim() === IDtoView)?.MAKH?.trim() || '',
                )?.HOTEN || 'Khách vãng lai'}
              </strong>
              <p>
                Tổng tiền:{' '}
                {money(hoadonList.find((row) => row.MAHD.trim() === IDtoView)?.TONGTIEN || 0)}
              </p>
            </div>
            <div className="ba-table-scroll invoice-detail-table">
              <DataTable<HoaDonDetails>
                columns={hoadonDetailsColumns}
                data={viewDetailsList}
                isLoading={detailsLoading}
              />
            </div>
            <div className="ba-actions">
              <button
                className="ba-button"
                onClick={() => {
                  detailVersion.current++;
                  setIDtoView(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
        {/* DÙNG CHUNG MODAL CHO CẢ THÊM VÀ SỬA */}
        <Modal
          isOpen={modalType === 'edit'}
          onClose={() => setModalType('none')}
          title={'Sửa thông tin hoá đơn'}
        >
          <form className="ba-form" onSubmit={handleSubmitForm}>
            {renderFormContent()}
          </form>
        </Modal>
        {/* modal thêm chi tiết */}
        <Modal
          isOpen={modalType === 'addDetails'}
          onClose={() => setModalType('none')}
          title="Thêm chi tiết hoá đơn"
        >
          <form className="ba-form" onSubmit={handleSubmitForm}>
            {renderFormContent()}
          </form>
        </Modal>

        {/* Modal xóa */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Xác nhận Xóa"
        >
          <p>
            Bạn có chắc chắn muốn xóa hoá đơn <strong>{idToDelete}</strong> không?
          </p>
          <br />
          <button className="ba-button ba-danger" onClick={handleDeleteConfirm}>
            <i className="fas fa-trash"></i> Xóa ngay
          </button>
        </Modal>
      </div>
    </>
  );
};
export default HoaDonPage;

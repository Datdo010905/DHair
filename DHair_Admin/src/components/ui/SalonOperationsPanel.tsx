import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { AdminBooking, AdminBookingResult } from '../../api/bookingApi';
import dichVuApi, { DichVu } from '../../api/dichvuApi';
import Modal from './Modal';

type Stylist = { MANV: string; HOTEN: string };
type QueueBooking = AdminBooking & {
    HANGDOI: { VAOLUC: string; GOILUC: string | null; TRANGTHAI: string };
    available: Stylist[];
};
type Board = {
    queue: QueueBooking[];
    bookings: AdminBooking[];
    stylists: Stylist[];
    warnings: { id: string; relatedId?: string; message: string }[];
    leaves: { ID: string; BATDAU: string; KETTHUC: string; resumeAt: string; LYDO: string; NHANVIEN: { HOTEN: string } }[];
    now: string;
};
type Action = 'walk-in' | 'leave' | 'reschedule' | 'extend' | 'join' | null;
type Props = { branches: AdminBookingResult['branches']; revision: number; onChanged: () => void; requestedBooking: AdminBooking | null };
const endpoint = '/api/lichhen/operations';
const localDay = (value: string) => new Date(value).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' });
const localTime = (value: string) => new Date(value).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false });

type OperationsIconName = 'queue' | 'calendar' | 'clock' | 'plus' | 'swap';
function OperationsIcon({ name }: { name: OperationsIconName }) {
    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {name === 'queue' && <><circle cx="9" cy="7" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 4a3 3 0 0 1 0 6M21 20v-2a6 6 0 0 0-4-5" /></>}
        {name === 'calendar' && <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2M8 18h2" /></>}
        {name === 'clock' && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
        {name === 'plus' && <><circle cx="9" cy="7" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M19 7v6M16 10h6" /></>}
        {name === 'swap' && <><path d="M4 7h16l-4-4M20 17H4l4 4M20 7l-4 4M4 17l4-4" /></>}
    </svg>;
}
const message = (error: any) => error.response?.data?.message || 'Không thể xử lý, vui lòng thử lại.';
const blank = { name: '', phone: '', serviceId: '', staffId: '', quantity: '1', bookingId: '', date: '', time: '', start: '', end: '', reason: '', minutes: '15', queue: false };
function bookingForm(booking?: AdminBooking) {
    if (!booking) return { ...blank };
    return {
        ...blank,
        bookingId: booking.MALICH,
        date: booking.NGAYHEN.slice(0, 10),
        // GIOHEN là TIME của MySQL, không đổi múi giờ như thời điểm thực tế.
        time: (booking.GIOHEN.includes('T') ? booking.GIOHEN.split('T')[1] : booking.GIOHEN).slice(0, 5),
        staffId: booking.CHITIETLICHHEN[0]?.MANV?.trim() || '',
    };
}
const titles = { 'walk-in': 'Nhận khách trực tiếp', leave: 'Ghi nhận nhân viên nghỉ', reschedule: 'Đổi giờ / stylist', extend: 'Cập nhật thời gian cần thêm', join: 'Đưa khách đã đến vào hàng đợi' };
const operationButtons: { action: Exclude<Action, null>; icon: OperationsIconName; label: string; description: string }[] = [
    { action: 'walk-in', icon: 'plus', label: 'Nhận khách trực tiếp', description: 'Tiếp nhận khách chưa đặt lịch' },
    { action: 'join', icon: 'queue', label: 'Đưa vào hàng đợi', description: 'Xếp lượt cho khách đã đến' },
    { action: 'reschedule', icon: 'swap', label: 'Đổi giờ / stylist', description: 'Sắp xếp lại lịch phục vụ' },
    { action: 'extend', icon: 'clock', label: 'Thêm thời gian', description: 'Cập nhật lượt đang thực hiện' },
    { action: 'leave', icon: 'calendar', label: 'Nhân viên nghỉ', description: 'Ghi nhận khoảng nghỉ và đệm' },
];

export default function SalonOperationsPanel({ branches, revision, onChanged, requestedBooking }: Props) {
    const [branchId, setBranchId] = useState('');
    const [board, setBoard] = useState<Board | null>(null);
    const [error, setError] = useState('');
    const [action, setAction] = useState<Action>(null);
    const [form, setForm] = useState(blank);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [services, setServices] = useState<DichVu[]>([]);
    const [queueStaff, setQueueStaff] = useState<Record<string, string>>({});
    const [tick, setTick] = useState(0);
    const lock = useRef(false);

    // Mở từ dòng lịch: lấy đúng chi nhánh trước khi tải danh sách để đổi giờ.
    useEffect(() => {
        if (!requestedBooking) return;
        setBranchId(requestedBooking.MACHINHANH.trim());
        setBoard(null);
        setForm(bookingForm(requestedBooking));
        setFormError('');
        setAction('reschedule');
        setTick(value => value + 1);
    }, [requestedBooking]);

    useEffect(() => { if (!branchId && branches.length) setBranchId(branches[0].MACHINHANH.trim()); }, [branches, branchId]);
    useEffect(() => {
        const timer = setInterval(() => setTick(value => value + 1), 30000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (!branchId) return;
        const controller = new AbortController();
        axiosClient.get(endpoint + '/board', { params: { branchId }, signal: controller.signal }).then(response => {
            if (!controller.signal.aborted) { setBoard(response.data.data); setError(''); }
        }).catch(err => { if (!controller.signal.aborted) setError(message(err)); });
        return () => controller.abort();
    }, [branchId, revision, tick]);
    useEffect(() => {
        if (action !== 'walk-in') return;
        let active = true;
        dichVuApi.getAllDichVuClient().then(response => { if (active) setServices(response.data.data); })
            .catch(err => { if (active) setFormError(message(err)); });
        return () => { active = false; };
    }, [action]);

    function open(next: Action, bookingId = '') {
        const selected = board?.bookings.find(item => item.MALICH === bookingId);
        setForm(next === 'reschedule' ? bookingForm(selected) : { ...blank, bookingId });
        setFormError(''); setAction(next);
    }
    // Dùng cùng khóa cho nút gọi khách và nút lưu để chặn bấm lặp trên màn hình.
    // Backend vẫn kiểm tra lại trong transaction khi nhiều lễ tân thao tác.
    async function execute(path: string, body: object, close = false) {
        if (lock.current) return;
        lock.current = true; setSaving(true); setFormError('');
        try {
            const response = await axiosClient.post(endpoint + path, body);
            const data = response.data.data;
            toast.success(data.message || 'Đã lưu.');
            if (data.conflicts?.length) toast.warning(`Lịch bị ảnh hưởng: ${data.conflicts.map((item: { id: string }) => item.id).join(', ')}. Xem cảnh báo để xử lý.`);
            if (close) setAction(null);
            onChanged(); setTick(value => value + 1);
        } catch (err) { if (close) setFormError(message(err)); else toast.error(message(err)); }
        finally { lock.current = false; setSaving(false); }
    }
    function submit(event: React.FormEvent) {
        event.preventDefault();
        if (action === 'walk-in') return execute('/walk-in', { ...form, branchId }, true);
        if (action === 'leave') return execute('/leave', { branchId, staffId: form.staffId, reason: form.reason,
            start: `${form.start}:00+07:00`, end: `${form.end}:00+07:00` }, true);
        if (action === 'join') return execute(`/${form.bookingId}/queue`, { action: 'join' }, true);
        if (action) return execute(`/${form.bookingId}/${action}`, form, true);
    }
    const bookings = (board?.bookings || []).filter(item => action === 'extend' ? item.TRANGTHAI === 'Đang thực hiện'
        : action === 'join' ? item.TRANGTHAI === 'Đã đến' : ['Đã đặt', 'Đang chờ', 'Đã đến'].includes(item.TRANGTHAI.trim()));
    const staffSelect = (required = true) => <label>Stylist<select required={required} value={form.staffId} onChange={e => setForm({ ...form, staffId: e.target.value })}>
        <option value="">{required ? 'Chọn stylist' : 'Chưa chọn — vào hàng đợi'}</option>
        {board?.stylists.map(item => <option key={item.MANV} value={item.MANV}>{item.HOTEN}</option>)}
    </select></label>;

    return <section className="ba-card salon-operations">
        <header className="salon-command-heading">
            <div className="salon-command-title"><span className="salon-command-icon"><OperationsIcon name="queue" /></span><div><p className="salon-eyebrow">VẬN HÀNH HẰNG NGÀY</p><h3>Điều phối tại salon</h3><p>Tiếp nhận khách và sắp xếp công việc cho đội ngũ.</p></div></div>
            <label className="salon-branch-picker">Chi nhánh đang điều phối<select disabled={saving} value={branchId} onChange={e => { setBranchId(e.target.value); setBoard(null); setQueueStaff({}); }}>
                <option value="">Chọn chi nhánh</option>{branches.map(item => <option key={item.MACHINHANH} value={item.MACHINHANH.trim()}>{item.TENCHINHANH}</option>)}
            </select></label>
        </header>
        <div className="salon-command-meta"><span><span className={`salon-sync-dot ${error ? 'has-error' : ''}`} />{error ? 'Chưa cập nhật được dữ liệu' : !board ? 'Đang tải dữ liệu' : 'Tự cập nhật mỗi 30 giây'}</span><span><OperationsIcon name="clock" />Giờ Việt Nam · UTC+7</span></div>
        {error && <p className="ba-error" role="alert">{error}</p>}
        <div className="salon-command-actions" aria-label="Thao tác điều phối">
            {operationButtons.map(item => <button type="button" className={`salon-command-button ${item.action === 'walk-in' ? 'is-primary' : ''}`} key={item.action} disabled={!board || saving || !!error} onClick={() => open(item.action)}>
                <span className="salon-action-icon"><OperationsIcon name={item.icon} /></span><span className="salon-action-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
            </button>)}
        </div>
        {!!board?.warnings.length && <div className="salon-warnings" role="status"><h4>Lịch cần xử lý</h4>{board.warnings.map((item, index) => <p key={index}>
            <strong>{item.id}</strong>: {item.message} <button className="ba-button" onClick={() => open('reschedule', item.relatedId || item.id)}>Sắp xếp lại</button>
        </p>)}</div>}
        <div className="salon-overview">
        <section className="salon-section" aria-label="Hàng đợi">
            <header className="salon-section-heading">
                <span className="salon-section-icon"><OperationsIcon name="queue" /></span>
                <div><h4>Hàng đợi <span className="salon-count">{board ? board.queue.length : '—'}</span></h4><p>Khách đang chờ được phục vụ</p></div>
            </header>
        {!board && <p className="salon-placeholder" role="status">{error ? 'Chưa tải được hàng đợi.' : 'Đang tải hàng đợi…'}</p>}
        {board && !board.queue.length && <div className="salon-empty-state">
            <span className="salon-empty-icon"><OperationsIcon name="queue" /></span>
            <strong>Chưa có khách chờ</strong>
            <p>Khách được xếp hàng sẽ xuất hiện tại đây<br />theo thứ tự tiếp nhận.</p>
        </div>}
        {board?.queue.map((item, index) => <article className="salon-queue-item" key={item.MALICH}>
            <div className="salon-customer">
                <span className="salon-position">{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.KHACHHANG?.HOTEN || 'Khách hàng'}</strong><p>{item.KHACHHANG?.SDT}</p></div>
                <span className={`salon-queue-status ${item.HANGDOI.TRANGTHAI === 'DA_GOI' ? 'is-called' : ''}`}>{item.HANGDOI.TRANGTHAI === 'DA_GOI' ? 'Đã gọi khách' : 'Chờ gọi'}</span>
            </div>
            <p className="salon-services">{item.CHITIETLICHHEN.map(d => d.DICHVU?.TENDV).join(', ')}</p>
            <div className="salon-queue-meta"><span><OperationsIcon name="clock" />Chờ {Math.max(0, Math.floor((new Date(board.now).getTime() - new Date(item.HANGDOI.VAOLUC).getTime()) / 60000))} phút</span><small>{item.MALICH}</small></div>
            <div className="ba-actions salon-queue-actions">
                <select aria-label={`Stylist nhận ${item.KHACHHANG?.HOTEN}`} value={queueStaff[item.MALICH] || ''} onChange={e => setQueueStaff({ ...queueStaff, [item.MALICH]: e.target.value })}>
                    <option value="">{item.available.length ? 'Thợ có thể nhận ngay' : 'Chưa có thợ đủ thời gian trống'}</option>
                    {item.available.map(s => <option key={s.MANV} value={s.MANV}>{s.HOTEN}</option>)}
                </select>
                <button className="ba-button" disabled={saving || item.HANGDOI.TRANGTHAI !== 'CHO'} onClick={() => execute(`/${item.MALICH}/queue`, { action: 'call' })}>Gọi khách</button>
                <button className="ba-button ba-primary" disabled={saving || !item.available.some(s => s.MANV === queueStaff[item.MALICH])} onClick={() => execute(`/${item.MALICH}/queue`, { action: 'assign', staffId: queueStaff[item.MALICH] })}>Nhận phục vụ</button>
                <button className="ba-button" disabled={saving} onClick={() => { if (window.confirm('Xác nhận khách rời hàng đợi và hủy lượt này?')) execute(`/${item.MALICH}/queue`, { action: 'leave' }); }}>Khách rời hàng</button>
            </div>
        </article>)}
        </section>
        <section className="salon-section salon-leaves" aria-label="Lịch nghỉ nhân viên">
            <header className="salon-section-heading">
                <span className="salon-section-icon"><OperationsIcon name="calendar" /></span>
                <div><h4>Lịch nghỉ <span className="salon-count">{board ? board.leaves.length : '—'}</span></h4><p>Đã tính 30 phút đệm sau giờ nghỉ</p></div>
            </header>
            {!board && <p className="salon-placeholder" role="status">{error ? 'Chưa tải được lịch nghỉ.' : 'Đang tải lịch nghỉ…'}</p>}
            {board && !board.leaves.length && <div className="salon-empty-state"><span className="salon-empty-icon"><OperationsIcon name="calendar" /></span><strong>Chưa có lịch nghỉ</strong><p>Các khoảng nghỉ sắp tới sẽ hiển thị tại đây.</p></div>}
            <div className="salon-leave-list">
                {board?.leaves.map(item => <article className="salon-leave-card" key={item.ID}>
                    <div className="salon-leave-person"><span className="salon-avatar" aria-hidden="true">{item.NHANVIEN.HOTEN.trim().split(/\s+/).slice(-2).map(part => part[0]).join('')}</span><div><strong>{item.NHANVIEN.HOTEN}</strong><p>{localDay(item.BATDAU)}</p></div></div>
                    <div className="salon-leave-times">
                        <div><span>Khoảng nghỉ</span><strong>{localTime(item.BATDAU)} – {localTime(item.KETTHUC)}</strong>{localDay(item.BATDAU) !== localDay(item.KETTHUC) && <small>Đến ngày {localDay(item.KETTHUC)}</small>}</div>
                        <div className="salon-resume"><span><OperationsIcon name="clock" />Nhận khách lại</span><strong>{localTime(item.resumeAt)}</strong>{localDay(item.BATDAU) !== localDay(item.resumeAt) && <small>{localDay(item.resumeAt)}</small>}</div>
                    </div>
                    <p className="salon-leave-reason"><span>Lý do</span>{item.LYDO}</p>
                </article>)}
            </div>
        </section>
        </div>
        <Modal isOpen={!!action} title={action ? titles[action] : ''} onClose={() => { if (!saving) setAction(null); }}>
            <form className="ba-form" onSubmit={submit}>
                {action === 'reschedule' && <>
                    <label>Chi nhánh của lịch<select required disabled={saving} value={branchId} onChange={e => {
                        setBranchId(e.target.value); setBoard(null); setForm({ ...blank }); setFormError('');
                    }}>
                        {branches.map(item => <option key={item.MACHINHANH} value={item.MACHINHANH.trim()}>{item.TENCHINHANH}</option>)}
                    </select></label>
                    {!board && !error && <p role="status">Đang tải lịch của chi nhánh…</p>}
                    {error && <p className="ba-error" role="alert">{error}</p>}
                    {board && !bookings.length && <p role="status">Chi nhánh này không có lịch được phép đổi giờ. Hãy chọn chi nhánh khác. Lịch đang thực hiện, đã hoàn thành hoặc đã hủy không thể đổi giờ.</p>}
                </>}
                {action === 'walk-in' && <>
                    <p>Tìm khách theo số điện thoại. Nếu chưa có, hệ thống tạo khách mới. Nếu không đủ chỗ, khách được đưa vào hàng đợi.</p>
                    <label>Số điện thoại<input required pattern="0[0-9]{9}" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
                    <label>Họ tên (dùng khi tạo khách mới)<input required maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
                    <label>Dịch vụ<select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}><option value="">Chọn dịch vụ</option>{services.map(s => <option key={s.MADV} value={s.MADV}>{s.TENDV} · {s.THOIGIAN} phút</option>)}</select></label>
                    <label>Số lượng<input required type="number" min={1} max={20} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></label>
                    {staffSelect(false)}
                    <label><input type="checkbox" checked={form.queue} onChange={e => setForm({ ...form, queue: e.target.checked })} /> Chỉ xếp hàng, chưa bắt đầu phục vụ</label>
                </>}
                {['reschedule', 'extend', 'join'].includes(action || '') && <label>Lịch hẹn<select required disabled={!board || saving} value={form.bookingId} onChange={e => {
                    const selected = bookings.find(item => item.MALICH === e.target.value);
                    setForm(action === 'reschedule' ? bookingForm(selected) : { ...form, bookingId: e.target.value });
                    setFormError('');
                }}>
                    <option value="">Chọn lịch</option>{bookings.map(b => <option key={b.MALICH} value={b.MALICH}>{b.KHACHHANG?.HOTEN || b.MAKH} · {b.NGAYHEN.slice(0, 10)} {bookingForm(b).time} · {b.MALICH} · {b.TRANGTHAI}</option>)}
                </select></label>}
                {action === 'reschedule' && <>
                    <p>Toàn bộ dịch vụ trong lịch được chuyển cho stylist đã chọn. Backend kiểm tra trùng trước khi lưu.</p>
                    {staffSelect()}
                    <label>Ngày mới<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
                    <label>Giờ mới<input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label>
                </>}
                {action === 'extend' && <><p>Nếu có lịch bị ảnh hưởng, hệ thống sẽ cảnh báo để lễ tân xử lý.</p><label>Số phút cần thêm<input required type="number" min={1} max={240} value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })} /></label></>}
                {action === 'join' && <p>Khách đã đến sẽ chờ được phân công lại. Giờ cũ được giải phóng; hệ thống kiểm tra chỗ khi nhận phục vụ.</p>}
                {action === 'leave' && <>
                    <p>Hệ thống dành thêm 30 phút sau giờ kết thúc nghỉ. Ví dụ nghỉ 11:00–12:30 thì nhận khách lại từ 13:00.</p>
                    {staffSelect()}
                    <label>Nghỉ từ<input required type="datetime-local" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} /></label>
                    <label>Đến<input required type="datetime-local" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} /></label>
                    <label>Lý do<input required maxLength={200} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></label>
                </>}
                {formError && <p className="ba-error" role="alert">{formError}</p>}
                <div className="ba-actions"><button type="button" className="ba-button" disabled={saving} onClick={() => setAction(null)}>Đóng</button><button className="ba-button ba-primary" disabled={saving || (action === 'reschedule' && (!board || !!error || !bookings.some(item => item.MALICH === form.bookingId)))}>{saving ? 'Đang lưu…' : 'Xác nhận'}</button></div>
            </form>
        </Modal>
    </section>;
}

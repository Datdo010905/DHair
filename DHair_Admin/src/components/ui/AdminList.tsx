import React, { useEffect, useState } from 'react';
import { Column } from './DataTable';
import { useSearch } from '../../context/SearchContext';
import '../../assets/css/booking-admin.css';
import '../../assets/css/admin-pages.css';

interface Filter<T> {
    key: keyof T;
    label: string;
    format?: (value: string) => string;
}
interface Props<T> {
    title: string;
    columns: Column<T>[];
    data: T[];
    rowKey: keyof T;
    searchKeys: (keyof T)[];
    filters?: Filter<T>[];
    statusKey?: keyof T;
    isLoading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}
const normalize = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase('vi');

// Map by value so colors stay the same when sorting or filtering the list.
const statusColors: Record<string, string> = {
    'Đang cung cấp': 'success',
    'Ngừng cung cấp': 'danger',
    'Đang áp dụng': 'success',
    'Chưa áp dụng': 'warning',
    'Hết hạn': 'danger',
    'Hoạt động': 'success',
    'Khoá': 'danger',
    'Khóa': 'danger',
};

export default function AdminList<T extends object>({ title, columns, data, rowKey, searchKeys, filters = [], statusKey, isLoading, error, onRetry }: Props<T>) {
    const { searchTerm } = useSearch();
    const [search, setSearch] = useState('');
    const [values, setValues] = useState<Record<string, string>>({});
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const matching = data.filter(row => {
        const text = searchKeys.map(key => normalize(row[key])).join(' ');
        return [search, searchTerm].every(term => text.includes(normalize(term)))
            && filters.every(filter => !values[String(filter.key)] || String(row[filter.key] ?? '').trim() === values[String(filter.key)]);
    });
    const statuses = statusKey ? Array.from(new Set(data.map(row => String(row[statusKey] ?? '').trim()).filter(Boolean))).sort() : [];
    const filtered = matching.filter(row => !status || (statusKey && String(row[statusKey] ?? '').trim() === status));
    const pages = Math.max(1, Math.ceil(filtered.length / size));
    const currentPage = Math.min(page, pages);
    useEffect(() => { setPage(1); }, [search, searchTerm, values, status, size]);
    useEffect(() => { if (!isLoading && !error) setPage(currentPage); }, [currentPage, isLoading, error]);
    const reset = () => { setSearch(''); setValues({}); setStatus(''); };
    return <section className="ba-card admin-list" aria-label={title} aria-busy={isLoading}>
        <div className="ba-filters">
            <label className="ba-search">Tìm kiếm<input type="search" placeholder="Nhập mã, tên hoặc thông tin cần tìm…" value={search} onChange={event => setSearch(event.target.value)} /></label>
            {filters.map(filter => <label key={String(filter.key)}>{filter.label}
                <select value={values[String(filter.key)] || ''} onChange={event => setValues({ ...values, [String(filter.key)]: event.target.value })}>
                    <option value="">Tất cả</option>
                    {Array.from(new Set(data.map(row => String(row[filter.key] ?? '').trim()).filter(Boolean))).sort().map(value => <option key={value} value={value}>{filter.format ? filter.format(value) : value}</option>)}
                </select>
            </label>)}
            <button className="ba-button" onClick={reset}>Xóa bộ lọc</button>
            {searchTerm && <p className="admin-search-note">Tìm kiếm chung đang áp dụng: “{searchTerm}”</p>}
        </div>
        {statusKey && <div className="ba-status-filters" aria-label="Lọc trạng thái">
            {['', ...statuses].map(value => <button key={value} className={`admin-status-${statusColors[value] || 'neutral'}`} aria-pressed={status === value} onClick={() => setStatus(value)}>
                <span className="ba-dot" />{value || 'Tất cả'} <b>{isLoading || error ? '…' : matching.filter(row => !value || String(row[statusKey] ?? '').trim() === value).length}</b>
            </button>)}
        </div>}
        <div className="ba-list-heading"><h3>{title}</h3><span>{isLoading || error ? '—' : filtered.length} kết quả</span></div>
        {isLoading ? <div className="ba-empty" role="status">Đang tải dữ liệu…</div>
            : error ? <div className="ba-empty ba-error" role="alert">{error}{onRetry && <button className="ba-button" onClick={onRetry}>Thử lại</button>}</div>
            : !filtered.length ? <div className="ba-empty"><strong>Không có kết quả phù hợp</strong><p>Thử thay đổi tìm kiếm hoặc xóa bộ lọc.</p></div>
            : <div className="ba-table-scroll"><table className="ba-table">
                <thead><tr>{columns.map((column, index) => <th key={index}>{column.tieude}</th>)}</tr></thead>
                <tbody>{filtered.slice((currentPage - 1) * size, currentPage * size).map(row => <tr key={String(row[rowKey])}>
                    {columns.map((column, index) => <td key={index}>{column.render ? column.render(row) : String(row[column.cotnhandulieu] ?? '—')}</td>)}
                </tr>)}</tbody>
            </table></div>}
        <footer className="ba-pagination">
            <span>{filtered.length ? (currentPage - 1) * size + 1 : 0}–{Math.min(currentPage * size, filtered.length)} / {filtered.length} kết quả</span>
            <label>Số dòng<select value={size} onChange={event => setSize(Number(event.target.value))}>{[10, 20, 50].map(value => <option key={value}>{value}</option>)}</select></label>
            <div className="ba-actions"><button className="ba-button" disabled={isLoading || !!error || currentPage === 1} onClick={() => setPage(currentPage - 1)}>Trước</button><span>Trang {currentPage}/{pages}</span><button className="ba-button" disabled={isLoading || !!error || currentPage === pages} onClick={() => setPage(currentPage + 1)}>Sau</button></div>
        </footer>
    </section>;
}

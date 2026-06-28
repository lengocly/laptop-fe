import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import {
    getAdminVouchers,
    deleteVoucher,
    toggleVoucherActive,
} from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
function formatHsd(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
function discountText(v) {
    if (v.discount_type === 'fixed') return formatVnd(v.discount_value);
    const max = v.max_discount ? ` (tối đa ${formatVnd(v.max_discount)})` : '';
    return `${v.discount_value}%${max}`;
}
function getPageNumbers(current, last) {
    if (last <= 1) return last === 1 ? [1] : [];
    const pages = [];
    let start = Math.max(1, current - 2);
    let end = Math.min(last, current + 2);
    if (end - start < 4) {
        if (start === 1) end = Math.min(last, start + 4);
        else if (end === last) start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
}
function AdminVouchersPage() {
    const navigate = useNavigate();
    const [vouchers, setVouchers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const loadVouchers = async () => {
        try {
            const params = { page, per_page: perPage };
            if (keyword.trim()) params.keyword = keyword.trim();
            if (activeFilter === '1') params.is_active = true;
            if (activeFilter === '0') params.is_active = false;
            const { data } = await getAdminVouchers(params);
            const items = data.data || [];
            const last = data.last_page || 1;
            if (items.length === 0 && page > 1 && page > last) {
                setPage(last);
                return;
            }
            setVouchers(items);
            setTotalPages(last);
            setTotal(data.total || 0);
            setError('');
        } catch {
            setError('Không tải được danh sách voucher.');
        }
    };
    useEffect(() => {
        loadVouchers();
    }, [page, keyword, activeFilter]);
    const handleDelete = async (voucher) => {
        if (!window.confirm(`Xóa voucher "${voucher.code}"?`)) return;
        try {
            await deleteVoucher(voucher.id);
            setToast('Đã xóa voucher.');
            await loadVouchers();
        } catch {
            setError('Không xóa được voucher.');
        }
    };
    const handleToggle = async (voucher) => {
        try {
            await toggleVoucherActive(voucher.id);
            setToast(voucher.is_active ? 'Đã tắt voucher.' : 'Đã bật voucher.');
            await loadVouchers();
        } catch {
            setError('Không đổi trạng thái được.');
        }
    };
    return (
        <AdminRoute>
            <AdminLayout title="Quản lý voucher">
                {error && <p className={styles.err}>{error}</p>}
                <div className={styles.toolbar}>
                    <input
                        placeholder="Tìm mã, tiêu đề..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />
                    <select
                        value={activeFilter}
                        onChange={(e) => {
                            setActiveFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Ẩn</option>
                    </select>
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => navigate('/admin/voucher/tao')}
                    >
                        + Thêm voucher
                    </button>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tiêu đề</th>
                                <th>Giảm</th>
                                <th>Đơn tối thiểu</th>
                                <th>HSD</th>
                                <th>Đã dùng</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className={styles.empty}>
                                        Chưa có voucher.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((v) => (
                                    <tr key={v.id}>
                                        <td><strong>{v.code}</strong></td>
                                        <td>{v.title}</td>
                                        <td>{discountText(v)}</td>
                                        <td>{formatVnd(v.min_order_amount)}</td>
                                        <td>{formatHsd(v.expires_at)}</td>
                                        <td>
                                            {v.used_count}
                                            {v.usage_limit ? ` / ${v.usage_limit}` : ''}
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    v.is_active
                                                        ? styles.badgeActive
                                                        : styles.badgeInactive
                                                }
                                            >
                                                {v.is_active ? 'Hoạt động' : 'Ẩn'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                type="button"
                                                className={styles.iconBtn}
                                                title="Sửa"
                                                onClick={() =>
                                                    navigate(`/admin/voucher/${v.id}`)
                                                }
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.iconBtn}
                                                title="Bật/tắt"
                                                onClick={() => handleToggle(v)}
                                            >
                                                {v.is_active ? '⏸' : '▶'}
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.iconBtn} ${styles.dangerBtn}`}
                                                title="Xóa"
                                                onClick={() => handleDelete(v)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <span className={styles.paginationInfo}>
                            {total} voucher · Trang {page}/{totalPages}
                        </span>
                        <div className={styles.paginationControls}>
                            <button
                                type="button"
                                className={styles.pageBtn}
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ‹
                            </button>
                            {getPageNumbers(page, totalPages).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={
                                        n === page
                                            ? `${styles.pageBtn} ${styles.pageBtnActive}`
                                            : styles.pageBtn
                                    }
                                    onClick={() => setPage(n)}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={styles.pageBtn}
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
                {toast && <p className={styles.toast}>{toast}</p>}
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminVouchersPage;


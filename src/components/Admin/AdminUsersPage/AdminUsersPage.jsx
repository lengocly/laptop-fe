import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye } from 'react-icons/fi';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminUsers } from '@/apis/adminUserService';
import styles from './styles.module.scss';
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
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
function AdminUsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [appliedKeyword, setAppliedKeyword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = { page, per_page: perPage };
            if (appliedKeyword.trim()) params.keyword = appliedKeyword.trim();
            const { data } = await getAdminUsers(params);
            const items = data.data || [];
            const last = data.last_page || 1;
            if (items.length === 0 && page > 1 && page > last) {
                setPage(last);
                return;
            }
            setUsers(items);
            setTotalPages(last);
            setTotal(data.total || 0);
            setError('');
        } catch {
            setError('Không tải được danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUsers();
    }, [page, appliedKeyword]);
    const handleSearch = (e) => {
        e?.preventDefault();
        setAppliedKeyword(keyword);
        setPage(1);
    };
    return (
        <AdminRoute>
            <AdminLayout
                title="Quản lý người dùng"
                subtitle="Xem danh sách khách hàng và tài khoản admin"
            >
                {error && <p className={styles.err}>{error}</p>}
                <form className={styles.toolbar} onSubmit={handleSearch}>
                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} aria-hidden />
                        <input
                            placeholder="Tìm kiếm theo tên, email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.searchBtn}>
                        Tìm kiếm
                    </button>
                </form>
                <div className={styles.summary}>
                    <span>{total} người dùng</span>
                    {appliedKeyword && (
                        <span className={styles.summaryFilter}>
                            Kết quả cho &quot;{appliedKeyword}&quot;
                        </span>
                    )}
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Người dùng</th>
                                <th>Vai trò</th>
                                <th>Email</th>
                                <th>Đơn hàng</th>
                                <th>Ngày đăng ký</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.empty}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.empty}>
                                        Không tìm thấy người dùng.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <span
                                                    className={styles.avatar}
                                                    aria-hidden
                                                >
                                                    {getInitials(user.name)}
                                                </span>
                                                <div>
                                                    <strong>{user.name}</strong>
                                                    <small>
                                                        {user.email_verified_at
                                                            ? 'Đã xác thực email'
                                                            : 'Chưa xác thực email'}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    user.is_admin
                                                        ? styles.badgeAdmin
                                                        : styles.badgeCustomer
                                                }
                                            >
                                                {user.is_admin ? 'Admin' : 'Khách hàng'}
                                            </span>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={styles.orderCount}>
                                                {user.orders_count ?? 0}
                                            </span>
                                        </td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className={styles.viewBtn}
                                                onClick={() =>
                                                    navigate(`/admin/nguoi-dung/${user.id}`)
                                                }
                                            >
                                                <FiEye size={16} aria-hidden />
                                                Chi tiết
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
                            Trang {page}/{totalPages}
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
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminUsersPage;


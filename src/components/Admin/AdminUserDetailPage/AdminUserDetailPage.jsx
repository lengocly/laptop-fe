import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import { getAdminUser } from '@/apis/adminUserService';
import { formatVnd } from '@/utils/price';
import {
    ORDER_STATUS_LABEL,
    PAYMENT_STATUS_LABEL,
} from '@/constants/orderStatus';
import styles from './styles.module.scss';
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
function formatDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('vi-VN');
}
const paymentMethodLabel = {
    cod: 'COD',
    stripe: 'Stripe',
};
function AdminUserDetailPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const loadUser = async () => {
        try {
            setLoading(true);
            const { data: res } = await getAdminUser(userId);
            setData(res);
            setError('');
        } catch {
            setError('Không tải được thông tin người dùng.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUser();
    }, [userId]);
    const user = data?.user;
    return (
        <AdminRoute>
            <AdminLayout title="Chi tiết người dùng">
                <button
                    type="button"
                    className={styles.back}
                    onClick={() => navigate('/admin/nguoi-dung')}
                >
                    <FiArrowLeft size={16} aria-hidden />
                    Quay lại danh sách
                </button>
                {error && <p className={styles.err}>{error}</p>}
                {loading && <p className={styles.loading}>Đang tải...</p>}
                {!loading && user && (
                    <>
                        <section className={styles.profileCard}>
                            <div className={styles.profileMain}>
                                <span className={styles.avatar} aria-hidden>
                                    {getInitials(user.name)}
                                </span>
                                <div>
                                    <h2>{user.name}</h2>
                                    <p className={styles.email}>
                                        <FiMail size={15} aria-hidden />
                                        {user.email}
                                    </p>
                                    <div className={styles.badges}>
                                        <span
                                            className={
                                                user.is_admin
                                                    ? styles.badgeAdmin
                                                    : styles.badgeCustomer
                                            }
                                        >
                                            {user.is_admin ? 'Admin' : 'Khách hàng'}
                                        </span>
                                        <span
                                            className={
                                                user.email_verified_at
                                                    ? styles.badgeVerified
                                                    : styles.badgeUnverified
                                            }
                                        >
                                            {user.email_verified_at
                                                ? 'Đã xác thực email'
                                                : 'Chưa xác thực email'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <FiShoppingBag className={styles.statIcon} aria-hidden />
                                    <div>
                                        <span>Đơn hàng</span>
                                        <strong>{user.orders_count ?? 0}</strong>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statMoney}>₫</span>
                                    <div>
                                        <span>Tổng chi tiêu</span>
                                        <strong>{formatVnd(data.total_spent || 0)}</strong>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <FiCalendar className={styles.statIcon} aria-hidden />
                                    <div>
                                        <span>Ngày đăng ký</span>
                                        <strong>{formatDateTime(user.created_at)}</strong>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className={styles.ordersSection}>
                            <h3>Lịch sử đơn hàng</h3>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng</th>
                                            <th>Trạng thái</th>
                                            <th>Thanh toán</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.orders || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className={styles.empty}>
                                                    Chưa có đơn hàng nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            data.orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <strong>{order.order_code}</strong>
                                                        <small>
                                                            {paymentMethodLabel[order.payment_method]
                                                                || order.payment_method}
                                                        </small>
                                                    </td>
                                                    <td>{formatDateTime(order.created_at)}</td>
                                                    <td>{formatVnd(order.subtotal)}</td>
                                                    <td>
                                                        <StatusBadge
                                                            type="order"
                                                            value={order.status}
                                                            label={
                                                                ORDER_STATUS_LABEL[order.status]
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <StatusBadge
                                                            type="payment"
                                                            value={order.payment_status}
                                                            label={
                                                                PAYMENT_STATUS_LABEL[
                                                                    order.payment_status
                                                                ]
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className={styles.linkBtn}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/don-hang/${order.id}`,
                                                                    {
                                                                        state: {
                                                                            from: `/admin/nguoi-dung/${userId}`,
                                                                        },
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Xem đơn
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminUserDetailPage;


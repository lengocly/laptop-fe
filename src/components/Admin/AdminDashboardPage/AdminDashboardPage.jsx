import { useEffect, useState } from 'react';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminOrders } from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import {
    ORDER_STATUS_LABEL,
    PAYMENT_STATUS_LABEL
} from '@/constants/orderStatus';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import { buildRevenueByDay } from '@/utils/revenueByDay';
import RevenueByDayChart from '../RevenueByDayChart/RevenueByDayChart';

// Bảng điều khiển Admin
function AdminDashboardPage() {

    const [orders, setOrders] = useState([]);

    // Tải danh sách đơn hàng
    useEffect(() => {
        getAdminOrders()
            .then(({ data }) => setOrders(data))
            .catch(() => {});
    }, []);

    // Đếm số đơn hàng chờ xử lý
    const pendingCount = orders.filter((o) => o.status === 'pending').length;

    // Tính tổng doanh thu từ các đơn đã thanh toán
    const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.subtotal), 0);

    // Lấy 5 đơn hàng gần đây
    const recentOrders = orders.slice(0, 5);

        //tính tổng doanh thu theo ngày
        const revenueByDay = buildRevenueByDay(orders, 7);

    return (
        <AdminRoute>
            <AdminLayout title="Bảng điều khiển Admin">

                {/* Biểu đồ doanh thu theo ngày */}
            <section className={styles.charts}>
                <RevenueByDayChart data={revenueByDay} />
            </section>

                {/* Thống kê */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span>Tổng doanh thu</span>
                        <strong>{formatVnd(totalRevenue)}</strong>
                    </div>

                    <div className={styles.statCard}>
                        <span>Tổng đơn hàng</span>
                        <strong>{orders.length}</strong>
                    </div>

                    <div className={styles.statCard}>
                        <span>Chờ xử lý</span>
                        <strong>{pendingCount}</strong>
                    </div>
                </div>

                {/* Thông báo đơn hàng chờ xử lý */}
                {pendingCount > 0 && (
                    <div className={styles.alert}>
                        Bạn có {pendingCount} đơn hàng chờ xử lý.{' '}
                        <Link to="/admin/don-hang?status=pending">
                            Xem đơn hàng →
                        </Link>
                    </div>
                )}

                {/* Đơn hàng gần đây */}
                <section className={styles.section}>
                    <h2>Đơn hàng gần đây</h2>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách</th>
                                    <th>Tổng</th>
                                    <th>Trạng thái</th>
                                    <th>Thanh toán</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className={styles.empty}>
                                            Chưa có đơn hàng.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <strong>{order.order_code}</strong>
                                            </td>

                                            <td>{order.user?.name || 'Khách hàng'}</td>

                                            <td>{formatVnd(order.subtotal)}</td>

                                            <td>
                                                <StatusBadge
                                                    type="order"
                                                    value={order.status}
                                                    label={ORDER_STATUS_LABEL[order.status]}
                                                />
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    type="payment"
                                                    value={order.payment_status}
                                                    label={PAYMENT_STATUS_LABEL[order.payment_status]}
                                                />
                                            </td>

                                            <td>
                                            <Link
                                                to={`/admin/don-hang/${order.id}`}
                                                state={{ from: '/admin/dashboard' }}
                                                className={styles.detailBtn}
                                            >
                                                Xem chi tiết
                                            </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminDashboardPage;
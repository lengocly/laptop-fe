import { useEffect, useState } from 'react';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminOrders } from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

function AdminDashboardPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getAdminOrders().then(({ data }) => setOrders(data)).catch(() => {});
    }, []);

    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.subtotal), 0);

    const recentOrders = orders.slice(0, 5);

    return (
        <AdminRoute>
            <AdminLayout title="Bảng điều khiển Admin">
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

                {pendingCount > 0 && (
                    <div className={styles.alert}>
                        Bạn có {pendingCount} đơn hàng chờ xử lý.{' '}
                        <Link to="/admin/don-hang">Xem đơn hàng →</Link>
                    </div>
                )}

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
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.order_code}</td>
                                        <td>{order.user?.name}</td>
                                        <td>{formatVnd(order.subtotal)}</td>
                                        <td>{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminDashboardPage;
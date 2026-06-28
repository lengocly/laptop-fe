import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiAlertCircle,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiPackage,
} from 'react-icons/fi';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminOrders, getAdminProducts } from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
import {
    ORDER_STATUS_LABEL,
    PAYMENT_STATUS_LABEL,
} from '@/constants/orderStatus';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import { buildRevenueByDay } from '@/utils/revenueByDay';
import { buildOrderStatusChart } from '@/utils/orderStatusChart';
import RevenueByDayChart from '../RevenueByDayChart/RevenueByDayChart';
import OrderStatusPieChart from '../OrderStatusPieChart/OrderStatusPieChart';
const LOW_STOCK_THRESHOLD = 5;
function AdminDashboardPage() {
    const [orders, setOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getAdminOrders(),
            getAdminProducts({ per_page: 50, is_active: 1 }),
        ])
            .then(([ordersRes, productsRes]) => {
                if (cancelled) return;
                const orderList = ordersRes.data ?? [];
                setOrders(orderList);
                const products = productsRes.data?.data ?? productsRes.data ?? [];
                const lowStock = products
                    .filter((p) => Number(p.stock) <= LOW_STOCK_THRESHOLD)
                    .slice(0, 5);
                setLowStockProducts(lowStock);
            })
            .catch(() => {
                if (!cancelled) {
                    setOrders([]);
                    setLowStockProducts([]);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const completedCount = orders.filter((o) => o.status === 'delivered').length;
    const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.subtotal), 0);
    const recentOrders = orders.slice(0, 5);
    const revenueByDay = buildRevenueByDay(orders, 7);
    const orderStatusChart = buildOrderStatusChart(orders);
    return (
        <AdminRoute>
            <AdminLayout
                title="Bảng điều khiển"
                subtitle="Tổng quan về hoạt động bán hàng"
            >
                {loading ? (
                    <p className={styles.loading}>Đang tải dữ liệu…</p>
                ) : (
                    <>
                        <div className={styles.stats}>
                            <div className={`${styles.statCard} ${styles.statRevenue}`}>
                                <span className={styles.statIcon} aria-hidden>
                                    <FiDollarSign size={22} />
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Tổng doanh thu</span>
                                    <strong>{formatVnd(totalRevenue)}</strong>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon} aria-hidden>
                                    <FiPackage size={22} />
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Tổng đơn hàng</span>
                                    <strong>{orders.length}</strong>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statSuccess}`}>
                                <span className={styles.statIcon} aria-hidden>
                                    <FiCheckCircle size={22} />
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Đơn hoàn thành</span>
                                    <strong>{completedCount}</strong>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statWarning}`}>
                                <span className={styles.statIcon} aria-hidden>
                                    <FiClock size={22} />
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Đơn chờ xử lý</span>
                                    <strong>{pendingCount}</strong>
                                </div>
                            </div>
                        </div>
                        <section className={styles.chartsRow}>
                            <div className={styles.chartCol}>
                                <OrderStatusPieChart data={orderStatusChart} />
                            </div>
                            <div className={styles.chartColWide}>
                                <RevenueByDayChart data={revenueByDay} />
                            </div>
                        </section>
                        {pendingCount > 0 && (
                            <div className={styles.alert}>
                                <div className={styles.alertBody}>
                                    <span className={styles.alertIcon} aria-hidden>
                                        <FiAlertCircle size={22} />
                                    </span>
                                    <p>
                                        Bạn có <strong>{pendingCount}</strong> đơn hàng
                                        chờ xử lý.
                                    </p>
                                </div>
                                <Link
                                    to="/admin/don-hang?status=pending"
                                    className={styles.alertBtn}
                                >
                                    Xem đơn hàng
                                    <FiArrowRight size={16} aria-hidden />
                                </Link>
                            </div>
                        )}
                        {lowStockProducts.length > 0 && (
                            <section className={styles.section}>
                                <h2>Sản phẩm sắp hết hàng (≤ {LOW_STOCK_THRESHOLD})</h2>
                                <div className={styles.lowStockList}>
                                    {lowStockProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/admin/san-pham/${product.id}`}
                                            className={styles.lowStockItem}
                                        >
                                            <span className={styles.lowStockName}>
                                                {product.name}
                                            </span>
                                            <span className={styles.lowStockBadge}>
                                                Còn {product.stock}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                                <div className={styles.sectionFooter}>
                                    <Link to="/admin/san-pham" className={styles.sectionAction}>
                                        Quản lý sản phẩm
                                        <FiArrowRight size={16} aria-hidden />
                                    </Link>
                                </div>
                            </section>
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
                    </>
                )}
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminDashboardPage;


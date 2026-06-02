import { useEffect, useState } from 'react';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminOrders, updateOrderStatus } from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';

const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
];

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const loadOrders = async () => {
        try {
            const { data } = await getAdminOrders();
            setOrders(data);
            setError('');
        } catch {
            setError('Không tải được danh sách đơn hàng.');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleChangeStatus = async (orderId, status) => {
        try {
            setUpdatingId(orderId);
            await updateOrderStatus(orderId, status);
            await loadOrders();
        } catch {
            setError('Không thể cập nhật trạng thái.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <AdminRoute>
            <AdminLayout title="Quản lý đơn hàng">
                {error && <p className={styles.err}>{error}</p>}

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái giao hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.empty}>Chưa có đơn hàng.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.order_code}</strong></td>
                                        <td>
                                            <div>{order.user?.name}</div>
                                            <small>{order.user?.email}</small>
                                        </td>
                                        <td>
                                            {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </td>
                                        <td>{formatVnd(order.subtotal)}</td>
                                        <td>
                                            <span className={
                                                order.payment_status === 'paid'
                                                    ? styles.payPaid
                                                    : styles.payUnpaid
                                            }>
                                                {order.payment_status === 'paid' ? 'Đã TT' : 'Chưa TT'}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className={styles.select}
                                                value={order.status}
                                                disabled={updatingId === order.id}
                                                onChange={(e) =>
                                                    handleChangeStatus(order.id, e.target.value)
                                                }
                                            >
                                                {statusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminOrdersPage;
import { useEffect, useState } from 'react';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminOrders, updateOrderStatus } from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import {
    ORDER_STATUS_LABEL,
    PAYMENT_STATUS_LABEL,
    ORDER_STATUS_OPTIONS
} from '@/constants/orderStatus';
import OrderStatusModal from '../OrderStatusModal/OrderStatusModal';


function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    //tìm kiếm, lọc trạng thái, modal cập nhật trạng thái, toast thành công
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [modalOrder, setModalOrder] = useState(null);
    const [toast, setToast] = useState('');

    //lọc danh sách đơn hàng theo từ khóa và trạng thái
    const filteredOrders = orders.filter((order) => {
        const matchStatus = !statusFilter || order.status === statusFilter;
        const kw = keyword.trim().toLowerCase();
        const matchKw =
            !kw ||
            [order.order_code, order.user?.name, order.user?.email].some((x) =>
                String(x || '').toLowerCase().includes(kw)
            );
        return matchStatus && matchKw;
    });

    //tải danh sách đơn hàng
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

    //lọc danh sách đơn hàng theo trạng thái
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const s = searchParams.get('status');
        if (s) setStatusFilter(s);
    }, [searchParams]);
    
    //cập nhật trạng thái đơn hàng
    const handleModalSubmit = async (orderId, status, note) => {
        try {
            setUpdatingId(orderId);
            await updateOrderStatus(orderId, status, note);
            setModalOrder(null);
            setToast('Cập nhật trạng thái thành công.');
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

                {/* toolbar tìm kiếm, lọc trạng thái */}
                <div className={styles.toolbar}>
                    <input
                        placeholder="Tìm mã đơn, tên, email..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        {ORDER_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng</th>
                                <th>Trạng thái</th>
                                <th>Thanh toán</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.empty}>Chưa có đơn hàng.</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.empty}>
                                        Không tìm thấy đơn phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order)  => (
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
                                        

                                        {/* trạng thái giao hàng */}
                                        <td>
                                            <StatusBadge
                                                type="order"
                                                value={order.status}
                                                label={ORDER_STATUS_LABEL[order.status]}
                                            />
                                        </td>
                                        
                                        {/* thanh toán */}
                                        <td>
                                            <StatusBadge
                                                type="payment"
                                                value={order.payment_status}
                                                label={PAYMENT_STATUS_LABEL[order.payment_status]}
                                            />
                                        </td>

                                        {/* hành động: xem chi tiết, sửa trạng thái */}   
                                        <td className={styles.actions}>
                                            <button
                                                type="button"
                                                className={styles.iconBtn}
                                                title="Xem chi tiết"
                                                onClick={() => navigate(`/admin/don-hang/${order.id}`)}
                                            >
                                                👁
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.iconBtn}
                                                title="Sửa trạng thái"
                                                onClick={() => setModalOrder(order)}
                                            >
                                                ✏️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* modal cập nhật trạng thái */}
                <OrderStatusModal
                    open={!!modalOrder}
                    order={modalOrder}
                    onClose={() => setModalOrder(null)}
                    onSubmit={handleModalSubmit}
                    loading={updatingId === modalOrder?.id}
                />

                {/* toast thành công */}
                {toast && <p className={styles.toast}>{toast}</p>}
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminOrdersPage;
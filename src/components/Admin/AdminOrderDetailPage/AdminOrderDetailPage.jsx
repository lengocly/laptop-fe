import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import {
    getAdminOrder,
    cancelAdminOrder,
    updateOrderStatus,
} from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import {
    ORDER_STATUS_LABEL,
    PAYMENT_STATUS_LABEL,
} from '@/constants/orderStatus';
import OrderStatusModal from '../OrderStatusModal/OrderStatusModal';
import styles from './styles.module.scss';
import { sendOrderInvoice } from '@/apis/adminOrderService';

const STORE = {
    name: 'BetaTech Shop',
    address: 'Tây Sơn, Đống Đa, Hà Nội',
    phone: '0909090909',
    email: 'beta.shop@gmail.com',
};

const paymentMethodLabel = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    stripe: 'Thẻ / Stripe',
};

function AdminOrderDetailPage() {
    const { orderId } = useParams(); //lấy id đơn hàng từ url
    const navigate = useNavigate();
    const [order, setOrder] = useState(null); //đơn hàng
    const [error, setError] = useState(''); //lỗi
    const [toast, setToast] = useState(''); //thông báo
    const [statusModalOpen, setStatusModalOpen] = useState(false); //modal cập nhật trạng thái
    const [loading, setLoading] = useState(false); //loading

    const location = useLocation(); //lấy location từ url
    const backTo = location.state?.from || '/admin/don-hang'; //lấy từ url hoặc mặc định là trang đơn hàng


    //tải đơn hàng
    const loadOrder = async () => {
        try {
            const { data } = await getAdminOrder(orderId);
            setOrder(data);
            setError('');
        } catch {
            setError('Không tải được đơn hàng.');
        }
    };

    //tải đơn hàng khi component mount
    useEffect(() => {
        loadOrder();
    }, [orderId]);

    //kiểm tra xem đơn hàng có thể hủy không
    const canAdminCancel =
        order && !['delivered', 'cancelled'].includes(order.status);

        //hủy đơn hàng
    const handleCancel = async () => {
        if (!window.confirm('Bạn chắc chắn muốn hủy đơn này?')) return;
        try {
            setLoading(true);
            await cancelAdminOrder(order.id);
            setToast('Đã hủy đơn hàng.');
            await loadOrder();
        } catch (err) {
            setError(err.response?.data?.message || 'Không hủy được đơn.');
        } finally {
            setLoading(false);
        }
    };

    //cập nhật trạng thái đơn hàng
    const handleStatusSubmit = async (id, status, note) => {
        await updateOrderStatus(id, status, note);
        setStatusModalOpen(false);
        setToast('Cập nhật trạng thái thành công.');
        await loadOrder();
    };

    //gửi hóa đơn qua email cho khách hàng
    const handleSendInvoice = async () => {
        try {
            setLoading(true);
            const { data } = await sendOrderInvoice(order.id);
            setToast(data.message);
        } catch {
            setError('Gửi email thất bại.');
        } finally {
            setLoading(false);
        }
    };

    //loading hoặc chưa login → không hiển thị
    if (!order && !error) return <AdminRoute><AdminLayout title="Hóa đơn">Đang tải...</AdminLayout></AdminRoute>;

    return (
        <AdminRoute>
            <AdminLayout title="Hóa đơn">
                {/* nút quay lại */}
                <button onClick={() => navigate(backTo)}>
                    ← Quay lại
                </button>

                {error && <p className={`${styles.err} ${styles.noPrint}`}>{error}</p>}
                {toast && <p className={`${styles.toast} ${styles.noPrint}`}>{toast}</p>}

                {order && (
                    <div className={styles.invoice} id="invoice-print">
                        <header className={styles.invoiceHead}>
                            <h2>Hóa đơn</h2>
                            <p>Ngày tạo: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                            <p>Mã đơn: <strong>{order.order_code}</strong></p>
                        </header>

                        <div className={styles.addressGrid}>
                            <div>
                                <h4>Từ (cửa hàng)</h4>
                                <p>{STORE.name}</p>
                                <p>{STORE.address}</p>
                                <p>SĐT: {STORE.phone}</p>
                                <p>{STORE.email}</p>
                               
                            </div>
                            <div>
                                <h4>Đến (khách hàng)</h4>
                                <p>{order.full_name}</p>
                                <p>{order.address}</p>
                                <p>SĐT: {order.phone}</p>
                            </div>
                            <div>
                                <h4>Thông tin tài khoản</h4>
                                <p>Email: {order.user?.email}</p>
                                <p>Tài khoản: {order.user?.name}</p>
                                <p>
                                    Trạng thái:{' '}
                                    <StatusBadge value={order.status} label={ORDER_STATUS_LABEL[order.status]} />
                                </p>
                                <p>
                                    Thanh toán:{' '}
                                    <StatusBadge
                                        value={order.payment_status}
                                        label={PAYMENT_STATUS_LABEL[order.payment_status]}
                                    />
                                </p>
                            </div>
                        </div>

                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>SL</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.product_name}
                                            {item.option_label ? ` (${item.option_label})` : ''}
                                        </td>
                                        <td>{formatVnd(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatVnd(item.line_total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.paymentBlock}>
                            <h4>Phương thức thanh toán</h4>
                            <p>{paymentMethodLabel[order.payment_method] || order.payment_method}</p>
                        </div>

                        <div className={styles.summary}>
                            <div>
                                <span>Tiền hàng</span>
                                <span>
                                    {formatVnd(
                                        (order.items ?? []).reduce(
                                            (sum, item) => sum + (item.line_total ?? 0),
                                            0
                                        )
                                    )}
                                </span>
                            </div>
                            {(order.voucher_discount ?? 0) > 0 && (
                                <div>
                                    <span>Giảm voucher</span>
                                    <span>-{formatVnd(order.voucher_discount)}</span>
                                </div>
                            )}
                            <div>
                                <span>Phí vận chuyển</span>
                                <span>
                                    {(order.shipping_fee ?? 0) > 0
                                        ? formatVnd(order.shipping_fee)
                                        : 'Miễn phí'}
                                </span>
                            </div>
                            <div className={styles.total}>
                                <span>Tổng tiền</span>
                                <span>{formatVnd(order.subtotal)}</span>
                            </div>
                        </div>

                        <div className={`${styles.footerActions} ${styles.noPrint}`}>
                            <button type="button" onClick={() => window.print()}>
                                In hóa đơn
                            </button>
                            {canAdminCancel && (
                                <button
                                    type="button"
                                    className={styles.danger}
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.primary}
                                onClick={() => setStatusModalOpen(true)}
                            >
                                Cập nhật trạng thái
                            </button>
                            {/* nút Gửi hóa đơn */}
                            <button
                                type="button"
                                className={styles.send}
                                onClick={handleSendInvoice}
                                disabled={loading}
                            >
                                Gửi hóa đơn
                            </button>
                        </div>
                    </div>
                )}

                {/* modal cập nhật trạng thái */}
                <OrderStatusModal
                    open={statusModalOpen}
                    order={order}
                    onClose={() => setStatusModalOpen(false)}
                    onSubmit={handleStatusSubmit}
                    loading={loading}
                />

            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminOrderDetailPage;
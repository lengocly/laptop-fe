import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { AuthContext } from '@/contexts/AuthProvider';
import { formatVnd } from '@/utils/price';
import { getMyOrders } from '@/apis/orderService';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { FiCheckCircle, FiX, FiPackage } from 'react-icons/fi';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from '@/constants/orderStatus';
import { cancelOrder } from '@/apis/orderService';
import { canCustomerCancelOrder, canRetryStripePayment } from '@/constants/orderStatus';
const paymentLabel = {
    cod: 'Thanh toán khi nhận hàng',
    stripe: 'Thẻ (Stripe)',
};
function formatOrderDate(iso) {
    return new Date(iso).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
function MyOrdersPage() {
    const [cancellingId, setCancellingId] = useState(null);
    const { loading, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [newOrderCode, setNewOrderCode] = useState('');
    const toggleOrderDetail = (orderId) => {
        setExpandedOrderId((currentId) =>
            currentId === orderId ? null : orderId
        );
    };
    useEffect(() => {
        const raw = sessionStorage.getItem('order_success');
        if (!raw) return;
        try {
            const { orderCode } = JSON.parse(raw);
            setShowSuccess(true);
            setNewOrderCode(orderCode || '');
        } catch {
        } finally {
            sessionStorage.removeItem('order_success');
        }
    }, []);
    useEffect(() => {
        if (!showSuccess) return undefined;
        const timer = setTimeout(() => setShowSuccess(false), 5000);
        return () => clearTimeout(timer);
    }, [showSuccess]);
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/don-hang-cua-toi', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);
    useEffect(() => {
        if (loading || !isAuthenticated) return;
        const fetchOrders = async () => {
            try {
                const { data } = await getMyOrders();
                setOrders(data);
            } catch {
                setError('Không thể tải đơn hàng.');
            }
        };
        fetchOrders();
    }, [loading, isAuthenticated, showSuccess]);
    const handleCancelOrder = async (order) => {
        if (!canCustomerCancelOrder(order)) return;
        const ok = window.confirm(
            `Bạn có chắc muốn hủy đơn ${order.order_code}?`
        );
        if (!ok) return;
        try {
            setCancellingId(order.id);
            setError('');
            await cancelOrder(order.id);
            const { data } = await getMyOrders();
            setOrders(data);
            if (expandedOrderId === order.id) {
                setExpandedOrderId(null);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể hủy đơn hàng.';
            setError(msg);
        } finally {
            setCancellingId(null);
        }
    };
    if (loading || !isAuthenticated) return null;
    return (
        <>
            <MyHeader />
            {showSuccess && (
                <div className={styles.toast}>
                    <FiCheckCircle className={styles.toastIcon} />
                    <span>Đơn hàng của bạn đã được đặt thành công!</span>
                    {newOrderCode && (
                        <small className={styles.toastCode}>Mã đơn: {newOrderCode}</small>
                    )}
                    <button
                        type="button"
                        className={styles.toastClose}
                        onClick={() => setShowSuccess(false)}
                        aria-label="Đóng"
                    >
                        <FiX />
                    </button>
                </div>
            )}
            <main className={styles.wrap}>
                <div className={styles.pageHead}>
                    <h1>Đơn hàng của tôi</h1>
                    <span>{orders.length} đơn hàng tổng cộng</span>
                </div>
                {error && <p className={styles.err}>{error}</p>}
                {orders.length === 0 ? (
                    <p className={styles.empty}>Chưa có đơn hàng.</p>
                ) : (
                    orders.map((order) => {
                        const canCancel = canCustomerCancelOrder(order);
                        const canPayStripe = canRetryStripePayment(order);
                        const isExpanded = expandedOrderId === order.id;
                        const firstItem = order.items?.[0];
                        const itemCount = order.items?.length || 0;
                        return (
                        <article key={order.id} className={styles.card}>
                             <div className={styles.cardHeader}>
                                    <div className={styles.cardHeaderLeft}>
                                        <strong className={styles.orderCode}>
                                            {order.order_code}
                                        </strong>
                                        <StatusBadge
                                            value={order.status}
                                            label={
                                                ORDER_STATUS_LABEL[order.status] ||
                                                order.status
                                            }
                                        />
                                    </div>
                                    <div className={styles.cardHeaderRight}>
                                        <div className={styles.priceRow}>
                                            <strong className={styles.amount}>
                                                {formatVnd(order.subtotal)}
                                            </strong>
                                            <StatusBadge
                                                value={order.payment_status}
                                                label={
                                                    PAYMENT_STATUS_LABEL[
                                                        order.payment_status
                                                    ] || order.payment_status
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.detailToggle}
                                            onClick={() => toggleOrderDetail(order.id)}
                                        >
                                            {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                        </button>
                                    </div>
                                </div>
                                <p className={styles.orderDate}>
                                    Đặt hàng vào {formatOrderDate(order.created_at)}
                                </p>
                                {!isExpanded && firstItem && (
                                    <div className={styles.preview}>
                                        <div className={styles.previewThumb}>
                                            <FiPackage size={22} />
                                        </div>
                                        <div className={styles.previewInfo}>
                                            <span className={styles.previewQty}>
                                                {itemCount} sản phẩm
                                            </span>
                                            <span className={styles.previewName}>
                                                {firstItem.product_name}
                                                {itemCount > 1 &&
                                                    ` +${itemCount - 1} sản phẩm khác`}
                                            </span>
                                        </div>
                                        {canPayStripe && (
                                            <button
                                                type="button"
                                                className={styles.payBtnCompact}
                                                onClick={() =>
                                                    navigate(`/thanh-toan/${order.id}`, {
                                                        state: {
                                                            orderCode: order.order_code,
                                                            subtotal: order.subtotal,
                                                        },
                                                    })
                                                }
                                            >
                                                Thanh toán ngay
                                            </button>
                                        )}
                                    </div>
                                )}
                                {isExpanded && (
                                    <>
                                    <div className={styles.detailWrap}>
                                        <div className={styles.detailGrid}>
                                            <section className={styles.detailBlock}>
                                                <h3>Sản phẩm đặt hàng</h3>
                                                <ul className={styles.itemList}>
                                                    {order.items?.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className={styles.itemRow}
                                                        >
                                                            <div className={styles.itemLeft}>
                                                                <div
                                                                    className={
                                                                        styles.itemThumb
                                                                    }
                                                                >
                                                                    <FiPackage size={18} />
                                                                </div>
                                                                <div>
                                                                    <p
                                                                        className={
                                                                            styles.itemName
                                                                        }
                                                                    >
                                                                        {item.product_name}
                                                                    </p>
                                                                    <span
                                                                        className={
                                                                            styles.itemQty
                                                                        }
                                                                    >
                                                                        Qty: {item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <strong>
                                                                {formatVnd(item.line_total)}
                                                            </strong>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className={styles.paymentMethod}>
                                                    {paymentLabel[order.payment_method] ||
                                                        order.payment_method}
                                                </p>
                                            </section>
                                            <section className={styles.detailBlock}>
                                                <h3>Địa chỉ giao hàng</h3>
                                                <p className={styles.addressName}>
                                                    {order.full_name}
                                                </p>
                                                <p>{order.address}</p>
                                                <p>{order.phone}</p>
                                                {order.note && (
                                                    <p className={styles.note}>
                                                        Ghi chú: {order.note}
                                                    </p>
                                                )}
                                            </section>
                                            <section className={styles.detailBlock}>
                                                <h3>Tóm tắt đơn hàng</h3>
                                                <div className={styles.summaryRow}>
                                                    <span>Tạm tính</span>
                                                    <span>
                                                        {formatVnd(
                                                            (order.items ?? []).reduce(
                                                                (sum, item) =>
                                                                    sum + (item.line_total ?? 0),
                                                                0
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                                {(order.voucher_discount ?? 0) > 0 && (
                                                    <div className={styles.summaryRow}>
                                                        <span>Giảm voucher</span>
                                                        <span>
                                                            -{formatVnd(order.voucher_discount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={styles.summaryRow}>
                                                    <span>Phí vận chuyển</span>
                                                    <span>
                                                        {(order.shipping_fee ?? 0) > 0
                                                            ? formatVnd(order.shipping_fee)
                                                            : 'Miễn phí'}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`${styles.summaryRow} ${styles.summaryTotal}`}
                                                >
                                                    <span>Tổng cộng</span>
                                                    <strong>
                                                        {formatVnd(order.subtotal)}
                                                    </strong>
                                                </div>
                                            </section>
                                        </div>
                                        <div className={styles.orderActions}>
                                            {canPayStripe && (
                                                <button
                                                    type="button"
                                                    className={styles.payBtnLarge}
                                                    onClick={() =>
                                                        navigate(`/thanh-toan/${order.id}`, {
                                                            state: {
                                                                orderCode: order.order_code,
                                                                subtotal: order.subtotal,
                                                            },
                                                        })
                                                    }
                                                >
                                                    Thanh toán ngay
                                                </button>
                                            )}
                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtnLarge}
                                                    disabled={cancellingId === order.id}
                                                    onClick={() => handleCancelOrder(order)}
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                            )}
                                        </div>
                                        </div>
                                    </>
                                )}
                        </article>
                    );
                })
                )}
                <Link to="/" className={styles.backLink}>← Về trang chủ</Link>
            </main>
            <MyFooter />
        </>
    );
}
export default MyOrdersPage;
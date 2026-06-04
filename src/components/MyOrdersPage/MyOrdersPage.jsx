// lịch sử mua hàng
//status là trạng thái giao hàng, còn payment_status là trạng thái thanh toán

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
import { canCustomerCancelOrder } from '@/constants/orderStatus';

const paymentLabel = {
    cod: 'Thanh toán khi nhận hàng',
    stripe: 'Thẻ (Stripe)',
};

//format ngày tháng giờ
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

    // id đơn hàng đang hủy
    const [cancellingId, setCancellingId] = useState(null);

    const { loading, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    //id đơn hàng được mở rộng
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    //lỗi
    const [error, setError] = useState('');

    // hiện toast thành công
    const [showSuccess, setShowSuccess] = useState(false);
    const [newOrderCode, setNewOrderCode] = useState('');

    //bật tắt chi tiết đơn hàng
    const toggleOrderDetail = (orderId) => {
        setExpandedOrderId((currentId) =>
            currentId === orderId ? null : orderId
        );
    };

        // hiện toast thành công (đọc từ sessionStorage, 1 lần khi mount)
    useEffect(() => {
        //Mount trang → đọc order_success từ sessionStorage
        const raw = sessionStorage.getItem('order_success');
        if (!raw) return;

        try {
            const { orderCode } = JSON.parse(raw);
            setShowSuccess(true); //có dữ liệu mã đơn hàng
            setNewOrderCode(orderCode || '');
        } catch {
            // bỏ qua nếu JSON lỗi
        } finally {
            sessionStorage.removeItem('order_success');
        }
    }, []);


    // tự động ẩn toast sau 5 giây
    useEffect(() => {
        if (!showSuccess) return undefined;
        const timer = setTimeout(() => setShowSuccess(false), 5000);
        return () => clearTimeout(timer);
    }, [showSuccess]);

    // chưa login → về login
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/don-hang-cua-toi', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // lấy đơn hàng
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

        fetchOrders(); // gọi API lấy đơn hàng
    }, [loading, isAuthenticated, showSuccess]);

    // hủy đơn hàng
    const handleCancelOrder = async (order) => {
        if (!canCustomerCancelOrder(order.status)) return;
    
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

    //loading hoặc chưa login → không hiển thị
    if (loading || !isAuthenticated) return null;

    return (
        <>
            <MyHeader />

            {/* hiện toast thành công */}
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

                {/* hiện lỗi */}
                {error && <p className={styles.err}>{error}</p>}

                {orders.length === 0 ? (
                    <p className={styles.empty}>Chưa có đơn hàng.</p>
                ) : (

                    //hiển thị danh sách đơn hàng
                    orders.map((order) => {

                        //kiểm tra đơn hàng có thể hủy được không
                        const canCancel = canCustomerCancelOrder(order.status);

                        //kiểm tra đơn hàng được mở rộng hay không
                        const isExpanded = expandedOrderId === order.id;

                        //lấy sản phẩm đầu tiên và số lượng sản phẩm
                        const firstItem = order.items?.[0];

                        //lấy số lượng sản phẩm
                        const itemCount = order.items?.length || 0;

                        return (
                        //mỗi đơn hàng là 1 article
                        <article key={order.id} className={styles.card}>
                             {/* Hàng 1: mã + badge giao hàng | giá + badge thanh toán + link chi tiết */}
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

                                        {/* chi tiết + hủy đơn */}
                                        <button
                                            type="button"
                                            className={styles.detailToggle}
                                            onClick={() => toggleOrderDetail(order.id)}
                                        >
                                            {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                        </button>

                                    </div>
                                </div>
                                {/* Hàng 2: ngày đặt */}
                                <p className={styles.orderDate}>
                                    Đặt hàng vào {formatOrderDate(order.created_at)}
                                </p>
                                {/* Hàng 3: preview sản phẩm (khi chưa expand) */}
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
                                    </div>
                                )}
                                {/* Chi tiết expand — 3 cột ShopMini */}
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
                                                    <span>{formatVnd(order.subtotal)}</span>
                                                </div>
                                                <div className={styles.summaryRow}>
                                                    <span>Phí vận chuyển</span>
                                                    <span>0 đ</span>
                                                </div>
                                                <div className={styles.summaryRow}>
                                                    <span>Thuế</span>
                                                    <span>0 đ</span>
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
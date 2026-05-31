// lịch sử mua hàng

import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { AuthContext } from '@/contexts/AuthProvider';
import { formatVnd } from '@/utils/price';
import { getMyOrders } from '@/apis/orderService';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const paymentLabel = {
    cod: 'Thanh toán khi nhận hàng',
    stripe: 'Thẻ (Stripe)',
};

const statusLabel = {
    pending: 'Chờ xử lý',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy',
};

function MyOrdersPage() {
    const { loading, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    // hiện toast thành công
    const [showSuccess, setShowSuccess] = useState(false);
    const [newOrderCode, setNewOrderCode] = useState('');

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

                {error && <p className={styles.err}>{error}</p>}

                {orders.length === 0 ? (
                    <p className={styles.empty}>Chưa có đơn hàng.</p>
                ) : (
                    orders.map((order) => (
                        <article key={order.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <div className={styles.cardLeft}>
                                    <strong>{order.order_code}</strong>
                                    <span
                                        className={classNames(styles.badge, {
                                            [styles.badgePending]: order.status === 'pending',
                                            [styles.badgePaid]: order.status === 'paid',
                                            [styles.badgeCancelled]: order.status === 'cancelled',
                                        })}
                                    >
                                        {statusLabel[order.status] || order.status}
                                    </span>
                                </div>
                                <div className={styles.cardRight}>
                                    <span className={styles.date}>
                                        {new Date(order.created_at).toLocaleString('vi-VN')}
                                    </span>
                                    <strong className={styles.amount}>
                                        {formatVnd(order.subtotal)}
                                    </strong>
                                    <span
                                        className={classNames(styles.payBadge, {
                                            [styles.payUnpaid]: order.payment_status === 'unpaid',
                                            [styles.payPaid]: order.payment_status === 'paid',
                                        })}
                                    >
                                        {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <p className={styles.payment}>
                                    {paymentLabel[order.payment_method] || order.payment_method}
                                </p>
                                <ul className={styles.items}>
                                    {order.items?.map((item) => (
                                        <li key={item.id}>
                                            {item.product_name} × {item.quantity} — {formatVnd(item.line_total)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))
                )}

                <Link to="/" className={styles.backLink}>← Về trang chủ</Link>
            </main>
            <MyFooter />
        </>
    );
}

export default MyOrdersPage;
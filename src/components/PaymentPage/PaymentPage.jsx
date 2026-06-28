import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { AuthContext } from '@/contexts/AuthProvider';
import { formatVnd } from '@/utils/price';
import { createPaymentIntent } from '@/apis/paymentService';
import StripeCheckoutForm from './StripeCheckoutForm';
import styles from './styles.module.scss';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
function PaymentPage() {
    const { orderId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { loading, isAuthenticated } = useContext(AuthContext);
    const [clientSecret, setClientSecret] = useState('');
    const [orderInfo, setOrderInfo] = useState({
        orderCode: state?.orderCode || '',
        subtotal: state?.subtotal || 0,
    });
    const [error, setError] = useState('');
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/checkout', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);
    useEffect(() => {
        if (loading || !isAuthenticated || !orderId) return;
        let cancelled = false;
        const loadIntent = async () => {
            try {
                const { data } = await createPaymentIntent(orderId);
                if (cancelled) return;
                if (data.already_paid) {
                    sessionStorage.setItem(
                        'order_success',
                        JSON.stringify({ orderCode: data.order_code }),
                    );
                    navigate('/don-hang-cua-toi', { replace: true });
                    return;
                }
                setClientSecret(data.client_secret);
                setOrderInfo({
                    orderCode: data.order_code,
                    subtotal: data.subtotal,
                });
            } catch (error) {
                if (!cancelled) {
                    console.error('Create payment intent error:', error?.response?.data || error);
                    const msg =
                        error?.response?.data?.message ||
                        'Không thể tạo phiên thanh toán. Vui lòng thử lại.';
                    setError(msg);
                }
            }
        };
        loadIntent();
        return () => {
            cancelled = true;
        };
    }, [orderId, loading, isAuthenticated]);
    const elementsOptions = useMemo(() => {
        if (!clientSecret) return null;
        return {
            clientSecret,
            appearance: {
                theme: 'stripe',
            },
        };
    }, [clientSecret]);
    if (loading || !isAuthenticated) {
        return null;
    }
    return (
        <>
            <MyHeader />
            <main className={styles.wrap}>
                <div className={styles.card}>
                    <h1>Thanh toán đơn hàng</h1>
                    <div className={styles.notice}>
                        Đơn <strong>#{orderInfo.orderCode}</strong> đã tạo.
                        Vui lòng thanh toán bên dưới.
                    </div>
                    <div className={styles.total}>
                        <span>Tổng thanh toán</span>
                        <strong>{formatVnd(orderInfo.subtotal)}</strong>
                    </div>
                    {error && <p className={styles.err}>{error}</p>}
                    {!error && !clientSecret && (
                        <p className={styles.loadingText}>Đang tạo phiên thanh toán...</p>
                    )}
                    {clientSecret && elementsOptions && (
                        <Elements stripe={stripePromise} options={elementsOptions}>
                            <StripeCheckoutForm
                                orderId={Number(orderId)}
                                orderCode={orderInfo.orderCode}
                            />
                        </Elements>
                    )}
                    <Link to="/checkout" className={styles.backLink}>
                        ← Quay lại thanh toán
                    </Link>
                </div>
            </main>
            <MyFooter />
        </>
    );
}
export default PaymentPage;
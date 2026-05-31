import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { CartContext } from '@/contexts/CartProvider';
import { confirmPayment } from '@/apis/paymentService';

import styles from './styles.module.scss';


// Thẻ test: xem laptop_fe/docs/STRIPE_TESTING.md


function StripeCheckoutForm({ orderId, orderCode }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { clearCart } = useContext(CartContext);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setError('');
        setSubmitting(true);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (stripeError) {
                setError(stripeError.message || 'Thanh toán thất bại.');
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                await confirmPayment(orderId, paymentIntent.id);

                clearCart();

                //COD và Stripe dùng chung key order_success → MyOrdersPage chỉ cần một chỗ đọc.
                sessionStorage.setItem(
                    'order_success',
                    JSON.stringify({ orderCode })
                );
                navigate('/don-hang-cua-toi');
            }
        } catch (error) {
            console.error('Stripe payment error:', error?.response?.data || error);
            setError('Không thể xác nhận thanh toán. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={styles.paymentForm} onSubmit={handlePay}>
            <PaymentElement options={{ wallets: { link: 'never' } }} />

            {error && <p className={styles.err}>{error}</p>}

            <button type="submit" disabled={!stripe || submitting}>
                {submitting ? 'Đang thanh toán...' : 'Thanh toán bằng thẻ'}
            </button>
        </form>
    );
}

export default StripeCheckoutForm;
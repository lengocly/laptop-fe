import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { CartContext } from '@/contexts/CartProvider';
import { AuthContext } from '@/contexts/AuthProvider';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
import { createOrder } from '@/apis/orderService';


//file này là trang thanh toán
function CheckoutPage() {

    // để tránh hiện toast thành công 2 lần
    const orderCompletedRef = useRef(false);

    //phương thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const navigate = useNavigate();

    //Lấy dữ liệu giỏ hàng từ từ CartProvider
    const { items, subtotal, clearCart } = useContext(CartContext);
    const { user, loading, isAuthenticated } = useContext(AuthContext);

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Chưa login → về login
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/checkout', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // Giỏ trống → về cửa hàng
    useEffect(() => {
        //orderCompletedRef.current = true trước khi khi giỏ rỗng, effect không redirect về cửa hàng → navigate('/don-hang-cua-toi') giữ được
        if (!loading && items.length === 0 && !orderCompletedRef.current) {
            navigate('/cua-hang', { replace: true });
        }
    }, [items.length, loading, navigate]);

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    //xử lý đặt hàng
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        //gọi API đặt hàng
        try {
            //gửi dữ liệu đặt hàng lên backend
            const { data } = await createOrder({
                full_name: form.fullName,
                phone: form.phone,
                address: form.address,
                note: form.note,
                payment_method: paymentMethod,
                items: items.map((i) => ({
                    product_id: i.productId,
                    product_variant_id: i.variantId ?? null,
                    product_name: i.name,
                    option_label: i.optionLabel || null,
                    price: i.priceNumber,
                    quantity: i.quantity,
                })),
            });
            
            // đặt hàng thành công
            if (data.payment_method === 'cod') {
                orderCompletedRef.current = true; // đã đặt hàng thành công
                clearCart(); // xóa giỏ hàng
                // lưu mã đơn hàng vào sessionStorage
                sessionStorage.setItem(
                    'order_success',
                    JSON.stringify({ orderCode: data.order_code })
                );
                navigate('/don-hang-cua-toi');
            } else {
                // Stripe: chưa xóa giỏ — thanh toán xong mới xóa
                navigate(`/thanh-toan/${data.order_id}`, {
                    state: {
                        orderCode: data.order_code,
                        subtotal: data.subtotal,
                    },
                });
            }
            
        } catch {
            setError('Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !isAuthenticated || items.length === 0) {
        return null; // hoặc spinner
    }

    return (
        <>
            <MyHeader />
            <main className={styles.wrap}>
                <h1>Thanh toán</h1>
                <div className={styles.grid}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h2>Thông tin giao hàng</h2>
                        <input name="fullName" placeholder="Họ tên *" value={form.fullName} onChange={onChange} required />
                        <input
                            name="phone"
                            placeholder="Số điện thoại *"
                            value={form.phone}
                            onChange={onChange}
                            required
                            maxLength={10}
                            inputMode="numeric"
                            pattern="0[0-9]{9}"
                            title="Nhập 10 số, bắt đầu bằng 0"
                        />
                        <textarea name="address" placeholder="Địa chỉ *" value={form.address} onChange={onChange} required />
                        <textarea name="note" placeholder="Ghi chú" value={form.note} onChange={onChange} />
                        {error && <p className={styles.err}>{error}</p>}

                        {/* phương thức thanh toán */}
                        <h2>Phương thức thanh toán</h2>
                        <div className={styles.paymentOptions}>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                Thanh toán khi nhận hàng (COD)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="stripe"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={() => setPaymentMethod('stripe')}
                                />
                                Thẻ tín dụng (Stripe)
                            </label>
                        </div>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </button>
                    </form>

                    <aside className={styles.summary}>
                        <h2>Đơn hàng</h2>
                        {items.map((item) => (
                            <div key={item.key} className={styles.line}>
                                <span>{item.name} × {item.quantity}</span>
                                <span>{formatVnd(item.priceNumber * item.quantity)}</span>
                            </div>
                        ))}
                        <div className={styles.total}>
                            <span>Tổng cộng</span>
                            <strong>{formatVnd(subtotal)}</strong>
                        </div>
                    </aside>
                </div>
                <Link to="/cua-hang">← Tiếp tục mua sắm</Link>
            </main>
            <MyFooter />
        </>
    );
}

export default CheckoutPage;
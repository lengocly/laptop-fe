import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { CartContext } from '@/contexts/CartProvider';
import { AuthContext } from '@/contexts/AuthProvider';
import { calcSavings, formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
import { createOrder } from '@/apis/orderService';
import { getMySavedVouchers, validateVoucher } from '@/apis/voucherService';
import AddressPicker from '@components/AddressPicker/AddressPicker';
import {
    buildFullAddress,
    formatAdminAddress,
    validateShippingAddress,
} from '@/utils/address';
import { FiTruck, FiDollarSign, FiCreditCard, FiPackage } from 'react-icons/fi';


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
        street: '',           // số nhà + tên đường
        province: null,
        district: null,
        ward: null,
        note: '',
    });
    const [adminKeyword, setAdminKeyword] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Voucher đã lưu — chọn và áp dụng khi checkout
    const [savedVouchers, setSavedVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherMessage, setVoucherMessage] = useState('');

    const finalTotal = Math.max(subtotal - voucherDiscount, 0);

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

    // Tải voucher user đã lưu
    useEffect(() => {
        if (!isAuthenticated) return;
        getMySavedVouchers()
            .then(({ data }) => setSavedVouchers(data.vouchers || []))
            .catch(() => setSavedVouchers([]));
    }, [isAuthenticated]);

    // Reset giảm giá khi đổi voucher hoặc giỏ thay đổi
    useEffect(() => {
        setVoucherDiscount(0);
        setVoucherMessage('');
    }, [selectedVoucherId, subtotal]);

    const handleApplyVoucher = async () => {
        if (!selectedVoucherId) {
            setVoucherMessage('Vui lòng chọn voucher.');
            return;
        }
        setVoucherLoading(true);
        setVoucherMessage('');
        try {
            const { data } = await validateVoucher({
                subtotal,
                voucher_id: Number(selectedVoucherId),
            });
            setVoucherDiscount(data.discount || 0);
            setVoucherMessage(`Áp dụng thành công — giảm ${formatVnd(data.discount)}`);
        } catch (err) {
            setVoucherDiscount(0);
            setVoucherMessage(err.response?.data?.message || 'Voucher không hợp lệ.');
        } finally {
            setVoucherLoading(false);
        }
    };

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
            // validate địa chỉ
            const addrError = validateShippingAddress(form);
            if (addrError) {
                setError(addrError);
                setSubmitting(false);
                return;
            }
            // tạo địa chỉ đầy đủ
            const fullAddress = buildFullAddress(form);

            //gửi dữ liệu đặt hàng lên backend
            
            const { data } = await createOrder({
                full_name: form.fullName,
                phone: form.phone,
                address: fullAddress,   // ← vẫn 1 chuỗi, BE không đổi
                note: form.note,
                payment_method: paymentMethod,
                voucher_id: voucherDiscount > 0 ? Number(selectedVoucherId) : undefined,
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
            
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    //loading hoặc chưa login → không hiển thị
    if (loading) {
        return (
            <>
                <MyHeader />
                <main className={styles.wrap}>
                    <p>Đang tải...</p>
                </main>
            </>
        );
    }
    
    //chưa login → về login
    if (!isAuthenticated) {
        return (
            <>
                <MyHeader />
                <main className={styles.wrap}>
                    <p>Vui lòng đăng nhập để thanh toán.</p>
                </main>
            </>
        );
    }
    
    //giỏ hàng trống → về cửa hàng
    if (items.length === 0) {
        return (
            <>
                <MyHeader />
                <main className={styles.wrap}>
                    <p>Giỏ hàng trống. <Link to="/cua-hang">Quay lại cửa hàng</Link></p>
                </main>
            </>
        );
    }

    return (
        <>
            <MyHeader />
            <main className={styles.wrap}>
                <h1>Thanh toán</h1>
                <div className={styles.grid}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h2>Thông tin giao hàng</h2>

                        <input
                            name="fullName"
                            placeholder="Họ và tên *"
                            value={form.fullName}
                            onChange={onChange}
                            required
                        />

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

                        {/* ===== Địa chỉ ===== */}
                        <label className={styles.fieldLabel}>Quốc gia</label>
                        <input value="Vietnam" disabled readOnly />
                        <label className={styles.fieldLabel}>Địa chỉ, tên đường *</label>
                        <input
                            name="street"
                            placeholder="VD: 34 Mai An Tiêm"
                            value={form.street}
                            onChange={onChange}
                            required
                        />
                        <label className={styles.fieldLabel}>Tỉnh/TP, Quận/Huyện, Phường/Xã *</label>
                        <div className={styles.addressFieldWrap}>
                            <input
                                type="text"
                                className={styles.addressTrigger}
                                placeholder="Tỉnh/TP, Quận/Huyện, Phường/Xã"
                                value={
                                    pickerOpen
                                        ? adminKeyword                    // đang chọn → chỉ hiện text đang gõ
                                        : formatAdminAddress(form)        // đóng picker → hiện địa chỉ đã chọn
                                }
                                onChange={(e) => {
                                    setAdminKeyword(e.target.value);
                                    setPickerOpen(true);
                                }}
                                onFocus={() => {
                                    setAdminKeyword('');                  // mở lại → xóa filter, hiện full list
                                    setPickerOpen(true);
                                }}
                                autoComplete="off"
                            />
                            <AddressPicker
                                open={pickerOpen}
                                keyword={adminKeyword}
                                onClose={() => {
                                    setPickerOpen(false);
                                    setAdminKeyword('');                  // đóng → xóa search, input hiện formatAdminAddress
                                }}
                                value={form}
                                onChange={(admin) => {
                                    setForm((f) => ({
                                        ...f,
                                        province: admin.province,
                                        district: admin.district,
                                        ward: admin.ward,
                                    }));
                                    if (!admin.ward) {
                                        setAdminKeyword('');              // chọn tỉnh/quận → bước tiếp, ô gõ trống
                                    }
                                    setPickerOpen(true);
                                }}
                            />
                        </div>
                        <textarea
                            name="note"
                            placeholder="Ghi chú"
                            value={form.note}
                            onChange={onChange}
                        />
                        {error && <p className={styles.err}>{error}</p>}

                        {/* phương thức thanh toán */}
                        <h2>Phương thức thanh toán</h2>
                        <div className={styles.paymentOptions}>
                            <label className={styles.paymentOption}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <span className={styles.paymentOptionIcon} aria-hidden>
                                    <FiTruck size={18} />
                                    <FiDollarSign size={14} />
                                </span>
                                <span className={styles.paymentOptionText}>
                                    Thanh toán khi nhận hàng (COD)
                                </span>
                            </label>
                            <label className={styles.paymentOption}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="stripe"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={() => setPaymentMethod('stripe')}
                                />
                                <span className={styles.paymentOptionIcon} aria-hidden>
                                    <FiCreditCard size={20} />
                                </span>
                                <span className={styles.paymentOptionText}>
                                    Thẻ tín dụng (Stripe)
                                </span>
                            </label>
                        </div>

                        {/* Mã giảm giá — voucher đã lưu */}
                        <h2>Mã giảm giá</h2>
                        {savedVouchers.length === 0 ? (
                            <p className={styles.voucherHint}>
                                Chưa có voucher. Lưu voucher ở trang chủ để dùng tại đây.
                            </p>
                        ) : (
                            <div className={styles.voucherRow}>
                                <select
                                    value={selectedVoucherId}
                                    onChange={(e) => setSelectedVoucherId(e.target.value)}
                                >
                                    <option value="">— Chọn voucher —</option>
                                    {savedVouchers.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.title} ({v.code})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className={styles.applyVoucherBtn}
                                    onClick={handleApplyVoucher}
                                    disabled={voucherLoading || !selectedVoucherId}
                                >
                                    {voucherLoading ? '...' : 'Áp dụng'}
                                </button>
                            </div>
                        )}
                        {voucherMessage && (
                            <p className={voucherDiscount > 0 ? styles.voucherOk : styles.voucherErr}>
                                {voucherMessage}
                            </p>
                        )}

                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </button>
                    </form>

                    <aside className={styles.summary}>
                        <h2>Đơn hàng</h2>
                        {items.map((item) => (
                            <div key={item.key} className={styles.orderItem}>
                                <div className={styles.orderItemImage}>
                                    {item.image ? (
                                        <img src={item.image} alt="" />
                                    ) : (
                                        <div className={styles.orderItemPlaceholder}>
                                            <FiPackage size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.orderItemInfo}>
                                    <span className={styles.orderItemName}>{item.name}</span>
                                    {item.optionLabel && (
                                        <span className={styles.orderItemVariant}>
                                            {item.optionLabel}
                                        </span>
                                    )}
                                    <span className={styles.orderItemQty}>
                                        Số lượng: {item.quantity}
                                    </span>
                                </div>
                                <div className={styles.orderItemPrice}>
                                    {(() => {
                                        const originalNum =
                                            item.priceOriginalNumber ?? 0;
                                        const hasDiscount =
                                            originalNum > item.priceNumber;
                                        const lineSale =
                                            item.priceNumber * item.quantity;
                                        const lineOriginal =
                                            originalNum * item.quantity;
                                        const unitSavings = hasDiscount
                                            ? calcSavings(
                                                  item.priceNumber,
                                                  originalNum
                                              )
                                            : 0;
                                        const lineSavings =
                                            unitSavings * item.quantity;

                                        if (!hasDiscount) {
                                            return (
                                                <span
                                                    className={
                                                        styles.orderItemPriceSingle
                                                    }
                                                >
                                                    {formatVnd(lineSale)}
                                                </span>
                                            );
                                        }

                                        return (
                                            <>
                                                <span
                                                    className={
                                                        styles.orderItemPriceOriginal
                                                    }
                                                >
                                                    {formatVnd(lineOriginal)}
                                                </span>
                                                <span
                                                    className={
                                                        styles.orderItemPriceSale
                                                    }
                                                >
                                                    {formatVnd(lineSale)}
                                                </span>
                                                {lineSavings > 0 && (
                                                    <span
                                                        className={
                                                            styles.orderItemSavings
                                                        }
                                                    >
                                                        Tiết kiệm{' '}
                                                        {formatVnd(lineSavings)}
                                                    </span>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                        <div className={styles.subtotalRow}>
                            <span>Tạm tính</span>
                            <span>{formatVnd(subtotal)}</span>
                        </div>
                        {voucherDiscount > 0 && (
                            <div className={styles.discountRow}>
                                <span>Giảm voucher</span>
                                <span>-{formatVnd(voucherDiscount)}</span>
                            </div>
                        )}
                        <div className={styles.total}>
                            <span>Tổng cộng</span>
                            <strong>{formatVnd(finalTotal)}</strong>
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
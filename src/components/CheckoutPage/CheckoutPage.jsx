import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { CartContext } from '@/contexts/CartProvider';
import { AuthContext } from '@/contexts/AuthProvider';
import { calcSavings, formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
import { createOrder } from '@/apis/orderService';
import { getProductById } from '@/apis/productsService';
import { getMySavedVouchers, validateVoucher } from '@/apis/voucherService';
import { calculateShippingFee } from '@/apis/shippingService';
import GhnAddressPicker from '@components/GhnAddressPicker/GhnAddressPicker';
import { buildFullAddress, estimateCartWeightGram } from '@/utils/shippingAddress';
import { FiTruck, FiDollarSign, FiCreditCard, FiPackage } from 'react-icons/fi';
const FREE_SHIPPING_THRESHOLD = 10_000_000;
function CheckoutPage() {
    const orderCompletedRef = useRef(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useContext(CartContext);
    const { user, loading, isAuthenticated } = useContext(AuthContext);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        street: '',
        note: '',
        province: null,
        district: null,
        ward: null,
    });
    const [shippingFee, setShippingFee] = useState(0);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [variantRequiredIds, setVariantRequiredIds] = useState({});
    const [savedVouchers, setSavedVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherMessage, setVoucherMessage] = useState('');
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const finalTotal = Math.max(subtotal - voucherDiscount + shippingFee, 0);
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/checkout', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);
    useEffect(() => {
        if (!user?.name) return;
        setForm((f) => {
            if (f.fullName.trim()) return f;
            return { ...f, fullName: user.name };
        });
    }, [user?.name]);
    useEffect(() => {
        if (!loading && items.length === 0 && !orderCompletedRef.current) {
            navigate('/cua-hang', { replace: true });
        }
    }, [items.length, loading, navigate]);
    useEffect(() => {
        if (!isAuthenticated) return;
        getMySavedVouchers()
            .then(({ data }) => setSavedVouchers(data.vouchers || []))
            .catch(() => setSavedVouchers([]));
    }, [isAuthenticated]);
    useEffect(() => {
        setVoucherDiscount(0);
        setVoucherMessage('');
    }, [selectedVoucherId, subtotal]);
    useEffect(() => {
        const idsToCheck = [
            ...new Set(
                items
                    .filter((i) => !i.variantId && !i.hasVariants)
                    .map((i) => i.productId)
            ),
        ];
        if (!idsToCheck.length) {
            setVariantRequiredIds({});
            return undefined;
        }
        let cancelled = false;
        Promise.all(
            idsToCheck.map((productId) =>
                getProductById(productId)
                    .then((data) => ({
                        productId,
                        hasVariants: (data.product?.variants?.length ?? 0) > 0,
                    }))
                    .catch(() => ({ productId, hasVariants: false }))
            )
        ).then((results) => {
            if (cancelled) return;
            const next = {};
            results.forEach(({ productId, hasVariants }) => {
                if (hasVariants) next[productId] = true;
            });
            setVariantRequiredIds(next);
        });
        return () => {
            cancelled = true;
        };
    }, [items]);
    const itemNeedsVariant = (item) =>
        (item.hasVariants || variantRequiredIds[item.productId]) && !item.variantId;
    useEffect(() => {
        if (!form.district?.id || !form.ward?.code) {
            setShippingFee(0);
            setShippingError('');
            return;
        }
        if (isFreeShipping) {
            setShippingFee(0);
            setShippingError('');
            return;
        }
        let cancelled = false;
        setShippingLoading(true);
        setShippingError('');
        calculateShippingFee({
            to_district_id: form.district.id,
            to_ward_code: form.ward.code,
            weight: estimateCartWeightGram(items),
            insurance_value: subtotal,
        })
            .then((data) => {
                if (!cancelled) setShippingFee(data.fee ?? 0);
            })
            .catch((err) => {
                if (!cancelled) {
                    setShippingFee(0);
                    setShippingError(
                        err.response?.data?.message || 'Không tính được phí vận chuyển.'
                    );
                }
            })
            .finally(() => {
                if (!cancelled) setShippingLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [
        form.district?.id,
        form.ward?.code,
        subtotal,
        items,
        isFreeShipping,
    ]);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const missingVariantItem = items.find(itemNeedsVariant);
            if (missingVariantItem) {
                setError(
                    `Vui lòng chọn cấu hình cho sản phẩm "${missingVariantItem.name}".`
                );
                setSubmitting(false);
                return;
            }
            if (!form.street?.trim() || form.street.trim().length < 5) {
                setError('Vui lòng nhập địa chỉ giao hàng (ít nhất 5 ký tự).');
                setSubmitting(false);
                return;
            }
            if (!form.province?.id || !form.district?.id || !form.ward?.code) {
                setError('Vui lòng chọn đầy đủ Tỉnh/Quận/Phường.');
                setSubmitting(false);
                return;
            }
            if (!isFreeShipping && shippingLoading) {
                setError('Đang tính phí vận chuyển, vui lòng đợi.');
                setSubmitting(false);
                return;
            }
            if (!isFreeShipping && shippingError) {
                setError(shippingError);
                setSubmitting(false);
                return;
            }
            const fullAddress = buildFullAddress(form);
            const { data } = await createOrder({
                full_name: form.fullName,
                phone: form.phone,
                address: fullAddress,
                note: form.note,
                to_district_id: form.district.id,
                to_ward_code: form.ward.code,
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
            if (data.payment_method === 'cod') {
                orderCompletedRef.current = true;
                clearCart();
                sessionStorage.setItem(
                    'order_success',
                    JSON.stringify({ orderCode: data.order_code })
                );
                navigate('/don-hang-cua-toi');
            } else {
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
                        <GhnAddressPicker
                            value={form}
                            onChange={(address) =>
                                setForm((f) => ({ ...f, ...address }))
                            }
                        />
                        {isFreeShipping && (
                            <p className={styles.shippingNote}>
                                Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING_THRESHOLD)}
                            </p>
                        )}
                        {shippingError && (
                            <p className={styles.err}>{shippingError}</p>
                        )}
                        <label className={styles.fieldLabel} htmlFor="checkout-note">
                            Ghi chú <span className={styles.optional}>(không bắt buộc)</span>
                        </label>
                        <textarea
                            id="checkout-note"
                            name="note"
                            placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
                            value={form.note}
                            onChange={onChange}
                            spellCheck={false}
                        />
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
                        {error && <p className={styles.checkoutError}>{error}</p>}
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
                                    {itemNeedsVariant(item) && (
                                        <Link
                                            to={`/product/${item.productId}`}
                                            className={styles.variantWarning}
                                        >
                                            Chưa chọn cấu hình — nhấn để chọn
                                        </Link>
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
                        <div className={styles.subtotalRow}>
                            <span>Phí vận chuyển</span>
                            <span>
                                {isFreeShipping
                                    ? 'Miễn phí'
                                    : shippingLoading
                                      ? 'Đang tính...'
                                      : formatVnd(shippingFee)}
                            </span>
                        </div>
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
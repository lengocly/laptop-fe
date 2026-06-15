/**  cột phải (giá, mua hàng)
 * ProductBuyBox — tên, giá, stock, số lượng, nút, trust.
 * VariantPicker nằm trong đây (giữa shortDesc và qty).
 */
import styles from './styles.module.scss';
import VariantPicker from './VariantPicker';
import { calcDiscountPercent, formatVnd, parsePriceNumber } from '@/utils/price';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';


function ProductBuyBox({
    product, //Thông tin sản phẩm.
    variantGroup, //Thông tin nhóm biến thể.
    variants, //Danh sách biến thể.
    selectedVariantId, //ID của biến thể đang chọn.
    onSelectVariant, //Hàm xử lý khi chọn biến thể.
    quantity, //Số lượng hiện tại.
    onDecQty, //Hàm xử lý khi bấm vào nút "-".
    onIncQty,
    onScrollToReviews,  //Hàm xử lý khi bấm vào nút "Xem đánh giá".
    reviewStats = { average: 0, total: 0 },
    shortDesc, //Mô tả ngắn.
    variantHint = '',
    onAddToCart,   // hàm từ cha
    onBuyNow,      // tùy chọn, phase checkout
}) {
    const inStock = product.stock > 0;
    const needsVariant = variants?.length > 0;
    const variantReady = !needsVariant || selectedVariantId;
    const canPurchase = inStock && variantReady;
    const priceOriginal = product.price_original;
    const discount = calcDiscountPercent(product.price, priceOriginal); //Tính % giảm giá

    //Hiển thị giá
    const priceText = formatVnd(parsePriceNumber(product.price));
    const priceOriginalText = priceOriginal
        ? formatVnd(parsePriceNumber(priceOriginal))
        : '';

    const { setIsOpen, setType } = useContext(SideBarContext);

    const handleAddToCart = () => {
        const ok = onAddToCart?.();
        if (ok === false) return;
        setIsOpen(true);
        setType('cart');
    };

    // Mua ngay: không mở sidebar giỏ — chuyển thẳng sang checkout (logic ở ProductDetailPage)
    const handleBuyNow = () => {
        onBuyNow?.();
    };
    return (
        <div className={styles.info}>
            <h1 className={styles.title}>{product.name}</h1>

            {/* Giá hiện tại + giá gốc + badge % */}
            <div className={styles.priceRow}>
                <p className={styles.price}>{priceText}</p>
                {priceOriginalText && discount > 0 && (
                    <>
                        <p className={styles.priceOld}>{priceOriginalText}</p>
                        <span className={styles.badgeSale}>-{discount}%</span>
                    </>
                )}
            </div>

            <div className={styles.ratingRow}>
                <span className={styles.stars} aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span
                            key={i}
                            style={{
                                color:
                                    i <= Math.round(reviewStats.average)
                                        ? '#fbbf24'
                                        : '#d1d5db',
                            }}
                        >
                            ★
                        </span>
                    ))}
                </span>
                <span>({reviewStats.total})</span>
                <button
                    type="button"
                    className={styles.reviewLink}
                    onClick={onScrollToReviews}
                >
                    Xem đánh giá
                </button>
            </div>

            <div className={styles.stockRow}>
                {inStock ? (
                    <span className={styles.badgeStock}>Còn hàng</span>
                ) : (
                    <span className={styles.badgeOut}>Hết hàng</span>
                )}
                {inStock && product.stock <= 10 && (
                    <p className={styles.stockHint}>
                        Chỉ còn {product.stock} sản phẩm
                    </p>
                )}
            </div>

            <p className={styles.shortDesc}>{shortDesc}</p>

            {/* VariantPicker: Chọn biến thể. */}
            <VariantPicker
                variantGroup={variantGroup}
                variants={variants}
                selectedVariantId={selectedVariantId}
                onSelectVariant={onSelectVariant}
            />

            {needsVariant && !selectedVariantId && (
                <p className={styles.variantHint}>
                    Vui lòng chọn {variantGroup?.label?.toLowerCase() || 'cấu hình'} để tiếp tục.
                </p>
            )}
            {variantHint && <p className={styles.variantHintError}>{variantHint}</p>}

            {inStock && variantReady && (
                <div className={styles.qtyBlock}>
                    <span className={styles.qtyLabel}>Số lượng</span>
                    <div className={styles.qty}>
                        <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={onDecQty}
                            disabled={quantity <= 1}
                        >
                            −
                        </button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={onIncQty}
                            disabled={quantity >= product.stock}
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.btnPrimary}
                    disabled={!canPurchase}
                    onClick={handleAddToCart}
                >
                    Thêm vào giỏ
                </button>
                <button
                    type="button"
                    className={styles.btnDanger}
                    disabled={!canPurchase || !onBuyNow}
                    onClick={handleBuyNow}
                >
                    Mua ngay
                </button>
            </div>

            <ul className={styles.trustList}>
                <li>✓ Thanh toán an toàn</li>
                <li>✓ Miễn phí vận chuyển đơn từ 10.000.000₫</li>
                <li>✓ Đổi trả trong 30 ngày</li>
            </ul>
        </div>
    );
}

export default ProductBuyBox;
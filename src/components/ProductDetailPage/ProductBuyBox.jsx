/**  cột phải (giá, mua hàng)
 * ProductBuyBox — tên, giá, stock, số lượng, nút, trust.
 * VariantPicker nằm trong đây (giữa shortDesc và qty).
 */
import styles from './styles.module.scss';
import VariantPicker from './VariantPicker';
import { calcDiscountPercent } from '@/utils/price';
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
    shortDesc, //Mô tả ngắn.
    onAddToCart,   // hàm từ cha
    onBuyNow,      // tùy chọn, phase checkout
}) {
    const inStock = product.stock > 0;
    const priceOriginal = product.price_original;
    const discount = calcDiscountPercent(product.price, priceOriginal); //Tính % giảm giá

    const { setIsOpen, setType } = useContext(SideBarContext);

    const handleAddToCart = () => {
        onAddToCart?.();
        setIsOpen(true);
        setType('cart');
    };
    return (
        <div className={styles.info}>
            <h1 className={styles.title}>{product.name}</h1>

            {/* Giá hiện tại + giá gốc + badge % */}
            <div className={styles.priceRow}>
                <p className={styles.price}>{product.price}</p>
                {priceOriginal && (
                    <>
                        <p className={styles.priceOld}>{priceOriginal}</p>
                        {discount > 0 && (
                            <span className={styles.badgeSale}>-{discount}%</span>
                        )}
                    </>
                )}
            </div>

            <div className={styles.ratingRow}>
                <span className={styles.stars} aria-hidden="true">
                    ★★★★★
                </span>
                <span>(0)</span>
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

            {inStock && (
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
                    disabled={!inStock}
                    onClick={handleAddToCart}
                >
                    Thêm vào giỏ
                </button>
                <button
                    type="button"
                    className={styles.btnDanger}
                    disabled={!inStock}
                    onClick={() => alert('Mua ngay — Phase sau')}
                >
                    Mua ngay
                </button>
            </div>

            <ul className={styles.trustList}>
                <li>✓ Thanh toán an toàn</li>
                <li>✓ Miễn phí vận chuyển đơn từ 500.000₫</li>
                <li>✓ Đổi trả trong 30 ngày</li>
            </ul>
        </div>
    );
}

export default ProductBuyBox;
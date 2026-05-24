/**  cột phải (giá, mua hàng)
 * ProductBuyBox — tên, giá, stock, số lượng, nút, trust.
 * VariantPicker nằm trong đây (giữa shortDesc và qty).
 */
import styles from './styles.module.scss';
import VariantPicker from './VariantPicker';


//hàm chuyển giá dạng chữ thành số
function parsePriceNumber(str) {
    if (!str) return 0;
    return Number(String(str).replace(/[^\d]/g, '')) || 0;
}
//"15.990.000 ₫" -> 15990000

//hàm tính % giảm giá
function calcDiscountPercent(price, priceOriginal) {
    const current = parsePriceNumber(price); //Lấy giá hiện tại và đổi thành số
    const original = parsePriceNumber(priceOriginal); //Lấy giá gốc và đổi thành số
    if (!original || original <= current) return 0; //Nếu giá gốc <= giá hiện tại, trả về 0
    return Math.round(((original - current) / original) * 100); //Giảm giá = ((Giá gốc - Giá hiện tại) / Giá gốc) × 100
}
//vd: 18.990.000 - 15.990.000 = 3.000.000 / 18.990.000 = 0.15809585150089535 * 100 = 15.809585150089535% => làm tròn = 16%

function ProductBuyBox({
    product,
    quantity,
    onDecQty,
    onIncQty,
    onScrollToReviews,
    shortDesc,
}) {
    const inStock = product.stock > 0;
    const priceOriginal = product.price_original;
    const discount = calcDiscountPercent(product.price, priceOriginal); //Tính % giảm giá

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

            <VariantPicker />

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
                    onClick={() => alert('Giỏ hàng — Phase sau')}
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
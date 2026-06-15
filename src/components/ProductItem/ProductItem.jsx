/**
 * ProductItem — thẻ sản phẩm (UI kiểu e-commerce hiện đại, cảm hứng CellphoneS).
 * Logic: giỏ / yêu thích / so sánh / rating / giá — giữ nguyên.
 */
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';
import QUICK_ACTIONS from './quickActions';
import { CartContext } from '@/contexts/CartProvider';
import { WishlistContext } from '@/contexts/WishlistProvider';
import { CompareContext } from '@/contexts/CompareProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { FiStar } from 'react-icons/fi';
import {
    calcDiscountPercent,
    calcSavings,
    formatVnd,
    parsePriceNumber,
} from '@/utils/price';

const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=640&q=80';

function ProductItem({
    id,
    src,
    prevSrc,
    name,
    price,
    priceOriginal,
    cpu,
    ram,
    storage,
    stock,
    ratingAverage,
    reviewCount,
}) {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const { addToCompare, isInCompare } = useContext(CompareContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [flashMessage, setFlashMessage] = useState('');

    const mainSrc = src || IMG_FALLBACK;
    const hoverSrc = prevSrc || mainSrc;
    const detailUrl = id != null ? `/product/${id}` : '#';

    const priceText = formatVnd(parsePriceNumber(price));
    const priceOriginalText = priceOriginal
        ? formatVnd(parsePriceNumber(priceOriginal))
        : '';
    const discount = calcDiscountPercent(price, priceOriginal);
    const savings = calcSavings(price, priceOriginal);
    const specText = [cpu, ram, storage].filter(Boolean).join(' · ');

    const productPayload = {
        productId: id,
        name,
        price: priceText,
        priceOriginal: priceOriginalText || null,
        image: mainSrc,
        cpu: cpu || null,
        ram: ram || null,
        storage: storage || null,
    };

    const moSidebar = (loai) => {
        setType(loai);
        setIsOpen(true);
    };

    const hienThongBaoNgan = (message) => {
        setFlashMessage(message);
        setTimeout(() => setFlashMessage(''), 2500);
    };

    const xuLyThaoTacNhanh = (actionId) => {
        if (id == null) return;

        switch (actionId) {
            case 'addToCart':
                addToCart({
                    productId: id,
                    variantId: null,
                    name,
                    optionLabel: '',
                    price,
                    priceOriginal,
                    image: mainSrc,
                    quantity: 1,
                    maxStock: stock ?? 0,
                });
                moSidebar('cart');
                break;
            case 'wishlist': {
                const added = toggleWishlist(productPayload);
                moSidebar('wishlist');
                if (added) hienThongBaoNgan('Đã thêm vào yêu thích');
                break;
            }
            case 'compare': {
                const result = addToCompare(productPayload);
                if (result.ok) moSidebar('compare');
                hienThongBaoNgan(result.message);
                break;
            }
            default:
                break;
        }
    };

    return (
        <article className={styles.card}>
            {flashMessage && (
                <p className={styles.flashToast} role="status">
                    {flashMessage}
                </p>
            )}

            {/* Vùng ảnh + thao tác nhanh */}
            <div className={styles.media}>
                {discount > 0 && (
                    <span className={styles.badgeDiscount}>Giảm {discount}%</span>
                )}

                <Link
                    className={styles.imageHit}
                    to={detailUrl}
                    aria-label={`Xem ${name}`}
                />
                <img
                    className={styles.imageMain}
                    src={mainSrc}
                    alt={name || ''}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.src = IMG_FALLBACK;
                    }}
                />
                <img
                    src={hoverSrc}
                    alt=""
                    className={styles.imageHover}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.src = mainSrc;
                    }}
                />

                <div
                    className={styles.quickActions}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    role="group"
                    aria-label="Thao tác nhanh"
                >
                    {QUICK_ACTIONS.map((action) => {
                        const isActive =
                            (action.id === 'wishlist' && isInWishlist(id)) ||
                            (action.id === 'compare' && isInCompare(id));

                        return (
                            <button
                                key={action.id}
                                type="button"
                                className={classNames(styles.quickActionBtn, {
                                    [styles.quickActionActive]: isActive,
                                })}
                                title={action.label}
                                aria-label={action.label}
                                aria-pressed={isActive}
                                onClick={() => xuLyThaoTacNhanh(action.id)}
                            >
                                <img src={action.icon} alt="" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Nội dung: tên, giá, rating */}
            <Link className={styles.body} to={detailUrl}>
                <h3 className={styles.title}>{name}</h3>

                <div className={styles.priceArea}>
                    <div className={styles.priceRow}>
                        <span className={styles.priceCurrent}>{priceText}</span>
                        {priceOriginal && (
                            <span className={styles.priceOld}>{priceOriginalText}</span>
                        )}
                    </div>
                    {discount > 0 ? (
                        <span className={styles.saveChip}>
                            Tiết kiệm {formatVnd(savings)}
                        </span>
                    ) : (
                        <span className={styles.savePlaceholder} aria-hidden />
                    )}
                </div>

                {specText ? (
                    <p className={styles.specLine}>{specText}</p>
                ) : (
                    <span className={styles.specPlaceholder} aria-hidden />
                )}

                <div
                    className={styles.footer}
                    aria-label={
                        reviewCount > 0 && ratingAverage != null
                            ? `Đánh giá ${ratingAverage} trên 5, ${reviewCount} lượt`
                            : undefined
                    }
                >
                    {reviewCount > 0 && ratingAverage != null ? (
                        <>
                            <FiStar className={styles.ratingStar} aria-hidden />
                            <span className={styles.ratingValue}>{ratingAverage}</span>
                            <span className={styles.ratingCount}>({reviewCount})</span>
                        </>
                    ) : (
                        <span className={styles.footerPlaceholder} aria-hidden />
                    )}
                </div>
            </Link>
        </article>
    );
}

export default ProductItem;

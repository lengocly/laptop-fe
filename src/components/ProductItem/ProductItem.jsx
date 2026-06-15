/**
 * ProductItem — một thẻ sản phẩm trên trang chủ / cửa hàng.
 *
 * Thao tác nhanh (hover bên phải ảnh):
 * 1. Thêm vào giỏ  → addToCart + mở sidebar giỏ
 * 2. Yêu thích     → toggleWishlist + mở sidebar wishlist
 * 3. So sánh       → addToCompare + mở sidebar so sánh
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

    const {
        card,
        imageHit,
        boxImg,
        showImgWhenHover,
        quickActions,
        quickActionBtn,
        quickActionActive,
        title,
        metaLink,
        flashToast,
    } = styles;

    const mainSrc = src || IMG_FALLBACK;
    const hoverSrc = prevSrc || mainSrc;
    const detailUrl = id != null ? `/product/${id}` : '#';

    const priceText = formatVnd(parsePriceNumber(price));
    const priceOriginalText = priceOriginal
        ? formatVnd(parsePriceNumber(priceOriginal))
        : '';
    const discount = calcDiscountPercent(price, priceOriginal);
    const savings = calcSavings(price, priceOriginal);

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
                    maxStock: stock ?? 0, // Dùng tồn kho thật từ API, không hardcode 99
                });
                moSidebar('cart');
                break;
            case 'wishlist': {
                const added = toggleWishlist(productPayload);
                moSidebar('wishlist');
                if (added) {
                    hienThongBaoNgan('Đã thêm vào yêu thích');
                }
                break;
            }
            case 'compare': {
                const result = addToCompare(productPayload);
                if (result.ok) {
                    moSidebar('compare');
                }
                hienThongBaoNgan(result.message);
                break;
            }
            default:
                break;
        }
    };

    return (
        <div className={card}>
            {flashMessage && (
                <p className={flashToast} role="status">
                    {flashMessage}
                </p>
            )}

            <div className={boxImg}>
                {discount > 0 && (
                    <span className={styles.badgeDiscount}>-{discount}%</span>
                )}

                <Link
                    className={imageHit}
                    to={detailUrl}
                    aria-label={`Xem ${name}`}
                />
                <img
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
                    className={showImgWhenHover}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.src = mainSrc;
                    }}
                />

                <div
                    className={quickActions}
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
                                className={classNames(quickActionBtn, {
                                    [quickActionActive]: isActive,
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

            <Link className={metaLink} to={detailUrl}>
                <div className={title}>{name}</div>
                <div className={styles.priceBlock}>
                    <div className={styles.priceRow}>
                        <span className={styles.priceCurrent}>{priceText}</span>
                        {priceOriginal && (
                            <span className={styles.priceOld}>{priceOriginalText}</span>
                        )}
                    </div>
                    {discount > 0 && (
                        <p className={styles.priceSave}>
                            Tiết kiệm {formatVnd(savings)} · {discount}% OFF
                        </p>
                    )}
                </div>
                {reviewCount > 0 && ratingAverage != null && (
                    <div
                        className={styles.ratingRow}
                        aria-label={`Đánh giá ${ratingAverage} trên 5, ${reviewCount} lượt`}
                    >
                        <FiStar className={styles.ratingStar} aria-hidden />
                        <span>{ratingAverage}</span>
                    </div>
                )}
            </Link>
        </div>
    );
}

export default ProductItem;

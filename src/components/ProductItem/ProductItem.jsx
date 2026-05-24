/**
 * =============================================================================
 * NHIỆM VỤ FILE NÀY (ProductItem)
 * =============================================================================
 * - Component hiển thị MỘT THẺ sản phẩm: 2 ảnh (hover đổi ảnh), tên, giá, icon thao tác.
 *
 * Props:
 * - src / prevSrc: URL ảnh chính và ảnh khi hover (backend trả trong mảng images[0], images[1]).
 * - name, price: chuỗi hiển thị.
 *
 * Không gọi API ở đây: chỉ nhận dữ liệu từ cha (HeadingListProduct / PopularProduct).
 * =============================================================================
 */
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import reloadIcon from '@icons/svgs/reloadIcon.svg';
import heartIcon from '@icons/svgs/heartIcon.svg';
import cartIcon from '@icons/svgs/cartIcon.svg';
import {
    calcDiscountPercent,
    calcSavings,
    formatVnd,
} from '@/utils/price';

const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=640&q=80';

function ProductItem({ id, src, prevSrc, name, price, priceOriginal }) {
    const {
        card,
        imageHit,
        boxImg,
        showImgWhenHover,
        showFncWhenHover,
        boxIcon,
        title,
        priceCl,
        metaLink
    } = styles;
    const mainSrc = src || IMG_FALLBACK;
    const hoverSrc = prevSrc || mainSrc;
    const detailUrl = id != null ? `/product/${id}` : '#';

    //Tính % giảm giá và số tiền tiết kiệm được
    const discount = calcDiscountPercent(price, priceOriginal);
    const savings = calcSavings(price, priceOriginal);

    return (
        <div className={card}>
            <div className={boxImg}>

                {/* Badge % giảm giá */}
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
                    loading='lazy'
                    decoding='async'
                    onError={(e) => {
                        e.currentTarget.src = IMG_FALLBACK;
                    }}
                />
                <img
                    src={hoverSrc}
                    alt=''
                    className={showImgWhenHover}
                    loading='lazy'
                    decoding='async'
                    onError={(e) => {
                        e.currentTarget.src = mainSrc;
                    }}
                />

                {/* khi hover hiện các công cụ */}
                <div
                    className={showFncWhenHover}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    role='presentation'
                >
                    <div className={boxIcon}>
                        <img src={cartIcon} alt='' />
                    </div>
                    <div className={boxIcon}>
                        <img src={heartIcon} alt='' />
                    </div>
                    <div className={boxIcon}>
                        <img src={reloadIcon} alt='' />
                    </div>
                    <div className={boxIcon}>
                        <img src={cartIcon} alt='' />
                    </div>
                </div>
            </div>

            <Link className={metaLink} to={detailUrl}>
                <div className={title}>{name}</div>

                {/* Giá hiện tại + giá gốc + badge % */}
                <div className={styles.priceBlock}>
                    <div className={styles.priceRow}>
                        <span className={styles.priceCurrent}>{price}</span>
                        {priceOriginal && (
                            <span className={styles.priceOld}>{priceOriginal}</span>
                        )}
                    </div>
                    {discount > 0 && (
                        <p className={styles.priceSave}>
                            Tiết kiệm {formatVnd(savings)} · {discount}% OFF
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}

export default ProductItem;

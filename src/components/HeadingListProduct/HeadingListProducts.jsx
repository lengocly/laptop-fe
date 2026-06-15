/**
 * =============================================================================
 * HeadingListProduct — Khối countdown khuyến mãi
 * =============================================================================
 * - Hiển thị CountdownBanner (đếm ngược + nút Mua ngay).
 * - Props data (tuỳ chọn): nếu có SP thì hiện thêm 1–2 thẻ cạnh countdown.
 *   Trang chủ hiện không truyền data → chỉ còn banner countdown.
 * =============================================================================
 */
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import CountdownBanner from '@components/CountdownBanner/CountdownBanner';
import ProductItem from '@components/ProductItem/ProductItem';

function HeadingListProduct({ data = [] }) {
    const { container, containerItem } = styles;

    return (
        <MainLayout>
            <div className={container}>
                {/* Banner đếm ngược deal laptop */}
                <CountdownBanner />

                {/* Tuỳ chọn: SP nổi bật cạnh countdown (HomePage có thể truyền data sau) */}
                {data.length > 0 && (
                    <div className={containerItem}>
                        {data.map((item) => (
                            <ProductItem
                                key={item.id}
                                id={item.id}
                                src={item.images[0]}
                                prevSrc={item.images[1]}
                                name={item.name}
                                price={item.price}
                                priceOriginal={item.price_original}
                                ratingAverage={item.rating_average}
                                reviewCount={item.review_count}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default HeadingListProduct;

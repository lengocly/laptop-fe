/**
 * =============================================================================
 * NHIỆM VỤ FILE NÀY (HeadingListProduct)
 * =============================================================================
 * - Khối trên trang chủ: banner đếm ngược (CountdownBanner) + vài thẻ sản phẩm nổi bật.
 *
 * Props `data`:
 * - HomePage truyền vào khoảng 2 sản phẩm đầu (slice(0, 2)).
 *
 * data.map:
 * - Render ProductItem giống PopularProduct; khác biệt là nằm cạnh countdown.
 * =============================================================================
 */
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import CountdownBanner from '@components/CountdownBanner/CountdownBanner';
import ProductItem from '@components/ProductItem/ProductItem';

function HeadingListProduct({ data }) {
    const { container, containerItem } = styles;

    return (
        <MainLayout>
            <div className={container}>
                <CountdownBanner />

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
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}

export default HeadingListProduct;

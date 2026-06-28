import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import CountdownBanner from '@components/CountdownBanner/CountdownBanner';
import ProductItem from '@components/ProductItem/ProductItem';
function HeadingListProduct({ data = [] }) {
    const { container, containerItem } = styles;
    return (
        <MainLayout>
            <div className={container}>
                <CountdownBanner />
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
                                hasVariants={item.has_variants}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
export default HeadingListProduct;


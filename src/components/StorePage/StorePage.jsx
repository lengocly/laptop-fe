import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import ProductItem from '@components/ProductItem/ProductItem';
import { getProducts } from '@/apis/productsService';
import styles from './styles.module.scss';

function StorePage() {
    const [searchParams] = useSearchParams();
    const categorySlug = searchParams.get('category') || null;

    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');

        getProducts(categorySlug)
            .then((res) => {
                if (!cancelled) setListProducts(res.contents ?? []);
            })
            .catch(() => {
                if (!cancelled) {
                    setListProducts([]);
                    setError('Không tải được sản phẩm. Kiểm tra API.');
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [categorySlug]);

    return (
        <>
            <MyHeader />
            <MainLayout>
                <div className={styles.page}>
                    <h1 className={styles.pageTitle}>Cửa hàng</h1>

                    <p className={styles.resultText}>
                        Hiển thị {listProducts.length} sản phẩm
                    </p>

                    {loading && <p>Đang tải…</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.grid}>
                        {listProducts.map((item) => (
                            <ProductItem
                                key={item.id}
                                id={item.id}
                                src={item.images?.[0]}
                                prevSrc={item.images?.[1]}
                                name={item.name}
                                price={item.price}
                                priceOriginal={item.price_original}
                                stock={item.stock}
                                ratingAverage={item.rating_average}
                                reviewCount={item.review_count}
                            />
                        ))}
                    </div>

                    {!loading && !error && listProducts.length === 0 && (
                        <p>Không có sản phẩm.</p>
                    )}
                </div>
            </MainLayout>
            <MyFooter />
        </>
    );
}

export default StorePage;

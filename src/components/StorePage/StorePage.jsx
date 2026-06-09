// Nhiệm vụ: Gọi API + layout + truyền props xuống sidebar

import { useEffect, useState } from 'react';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import ProductItem from '@components/ProductItem/ProductItem';
import FilterSidebar from './FilterSidebar/FilterSidebar';
import { getProducts } from '@/apis/productsService';
import { getCategories } from '@/apis/categoriesService';
import styles from './styles.module.scss';

function StorePage() {
    const [categories, setCategories] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ─── Effect 1: danh mục (chạy 1 lần khi vào trang) ───
    useEffect(() => {
        getCategories()
            .then((res) => setCategories(res.categories ?? []))
            .catch(() => setCategories([]));
    }, []); // [] = không phụ thuộc gì → chỉ mount

    // ─── Effect 2: sản phẩm (chạy lại mỗi khi selectedSlug đổi) ───
    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError('');

        getProducts(selectedSlug)
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

        // Hủy setState nếu đổi danh mục trước khi API trả về
        return () => {
            cancelled = true;
        };
    }, [selectedSlug]); // selectedSlug đổi → gọi lại

    return (
        <>
            <MyHeader />
            <MainLayout>
                <div className={styles.page}>
                    <h1 className={styles.pageTitle}>Cửa hàng</h1>

                    <div className={styles.storeLayout}>
                        <aside className={styles.sidebar}>
                            <FilterSidebar
                                categories={categories}
                                selectedSlug={selectedSlug}
                                
                                // setSelectedSlug là hàm React tạo sẵn — truyền thẳng xuống con. Con gọi onSelectSlug('chuot') = cha setSelectedSlug('chuot') → effect #2 chạy lại.
                                onSelectSlug={setSelectedSlug}
                            />
                        </aside>

                        <section className={styles.main}>
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
                                    />
                                ))}
                            </div>

                            {!loading && !error && listProducts.length === 0 && (
                                <p>Không có sản phẩm.</p>
                            )}
                        </section>
                    </div>
                </div>
            </MainLayout>
            <MyFooter />
        </>
    );
}

export default StorePage;
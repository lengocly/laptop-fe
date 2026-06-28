import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import ProductItem from '@components/ProductItem/ProductItem';
import CategoryBrandFilter from './CategoryBrandFilter';
import { getProducts } from '@/apis/productsService';
import {
    getCategories,
    findChildCategory,
    findParentBySlug,
} from '@/apis/categoriesService';
import styles from './styles.module.scss';
function StorePage() {
    const [searchParams] = useSearchParams();
    const categorySlug = searchParams.get('category') || null;
    const groupSlug = searchParams.get('group') || null;
    const [listProducts, setListProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        getCategories()
            .then((res) => setCategories(res.categories ?? []))
            .catch(() => setCategories([]));
    }, []);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        getProducts({ categorySlug, groupSlug })
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
    }, [categorySlug, groupSlug]);
    const matchedChild = useMemo(() => {
        if (!categorySlug) return null;
        return findChildCategory(categories, categorySlug);
    }, [categories, categorySlug]);
    const activeParent = useMemo(() => {
        if (groupSlug) {
            return findParentBySlug(categories, groupSlug);
        }
        if (matchedChild) {
            return matchedChild.parent;
        }
        return null;
    }, [categories, groupSlug, matchedChild]);
    const showGroupFilter = (activeParent?.children?.length ?? 0) > 0;
    const pageTitle = useMemo(() => {
        if (categorySlug && matchedChild) {
            return matchedChild.child.name;
        }
        if (groupSlug && activeParent) {
            return activeParent.name;
        }
        return 'Cửa hàng';
    }, [categorySlug, groupSlug, matchedChild, activeParent]);
    return (
        <>
            <MyHeader />
            <MainLayout>
                <div className={styles.page}>
                    <h1 className={styles.pageTitle}>{pageTitle}</h1>
                    {showGroupFilter && (
                        <CategoryBrandFilter
                            title={activeParent.name}
                            parentSlug={activeParent.slug}
                            brands={activeParent.children ?? []}
                            activeSlug={categorySlug}
                        />
                    )}
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
                                hasVariants={item.has_variants}
                                parentGroupSlug={item.parent_group_slug}
                                cpu={item.cpu}
                                ram={item.ram}
                                storage={item.storage}
                                screen={item.screen}
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


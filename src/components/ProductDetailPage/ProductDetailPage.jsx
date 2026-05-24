import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { getProductById } from '@/apis/productsService';
import styles from './styles.module.scss';
import ProductGallery from './ProductGallery';
import ProductBuyBox from './ProductBuyBox';
import ProductSpecs from './ProductSpecs';
import ProductReviews from './ProductReviews';
import ProductItem from '@components/ProductItem/ProductItem';

//fetch API, state chung

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // ─── Luồng 1: load SP khi vào trang hoặc đổi id ───
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelatedProducts([]);
        setActiveIdx(0);
        setQuantity(1);

        getProductById(id)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data.product); //lấy sản phẩm chính
                    setRelatedProducts(data.related_products ?? []); //nếu không có sản phẩm liên quan, trả về danh sách trống.
                }
            })
            .catch(() => {
                if (!cancelled) setError('Không tải được sản phẩm.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; }; // tránh setState sau khi unmount
    }, [id]);

  // ─── Luồng 2: UI trạng thái ───
    if (loading) {
        return (
            <>
                <MyHeader />
                <main className={styles.wrap}><p>Đang tải…</p></main>
                <MyFooter />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <MyHeader />
                <main className={styles.wrap}>
                    <p className={styles.err}>{error}</p>
                    <Link to="/">← Về trang chủ</Link>
                </main>
                <MyFooter />
            </>
        );
    }

        // ─── Luồng 3: chuẩn bị data hiển thị ───
        const cat = product.category;
        const parentCat = cat?.parent;
        const inStock = product.stock > 0;
    
        const decQty = () => setQuantity((q) => Math.max(1, q - 1));
        const incQty = () => setQuantity((q) => Math.min(product.stock, q + 1));
    
        const scrollToReviews = () => {
            document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
        };
    
        const shortDesc = product.storage
            ? `Cấu hình ${product.storage} — hàng chính hãng BetaTech.`
            : 'Sản phẩm chính hãng BetaTech.';

        return (
            <>
                <MyHeader />
                <main className={styles.wrap}>
                    {/* ── Breadcrumb ── */}
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className={styles.crumbSep}>›</span>
                        {parentCat && (
                            <>
                                <span className={styles.crumbMuted}>{parentCat.name}</span>
                                <span className={styles.crumbSep}>›</span>
                            </>
                        )}
                        {cat && (
                            <>
                                <span className={styles.crumbMuted}>{cat.name}</span>
                                <span className={styles.crumbSep}>›</span>
                            </>
                        )}
                        <span className={styles.crumbCurrent}>{product.name}</span>
                    </nav>
    
                    {/* ── Card chính: Gallery | Info ── */}
                    <div className={styles.productCard}>
                        <div className={styles.grid}>
                            <ProductGallery
                                images={product.images}
                                activeIdx={activeIdx}
                                onChange={setActiveIdx}
                                alt={product.name}
                            />

                            <ProductBuyBox
                                product={product}
                                quantity={quantity}
                                onDecQty={decQty}
                                onIncQty={incQty}
                                onScrollToReviews={scrollToReviews}
                                shortDesc={shortDesc}
                            />
                        </div>
                    </div>

                <ProductSpecs product={product} />
                <ProductReviews />

                {/* ── Sản phẩm liên quan ── */}
                {relatedProducts.length > 0 && (
                    <section className={styles.relatedSection}>
                        <h2 className={styles.sectionTitle}>Sản phẩm liên quan</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map((item) => (
                                <ProductItem
                                    key={item.id}
                                    id={item.id}
                                    src={item.images?.[0]}
                                    prevSrc={item.images?.[1]}
                                    name={item.name}
                                    price={item.price}
                                    priceOriginal={item.price_original}
                                />
                            ))}
                        </div>
                    </section>
                )}

                </main>
                <MyFooter />
            </>
        );
}

export default ProductDetailPage;
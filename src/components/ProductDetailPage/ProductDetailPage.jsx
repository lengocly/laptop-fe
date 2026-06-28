import { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import { getProductById } from '@/apis/productsService';
import styles from './styles.module.scss';
import ProductGallery from './ProductGallery';
import ProductBuyBox from './ProductBuyBox';
import ProductSpecs from './ProductSpecs';
import ProductReviews from './ProductReviews';
import ProductItem from '@components/ProductItem/ProductItem';
import { CartContext } from '@/contexts/CartProvider';
import { AuthContext } from '@/contexts/AuthProvider';
function ProductDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [variantHint, setVariantHint] = useState('');
    const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 });
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelatedProducts([]);
        setActiveIdx(0);
        setQuantity(1);
        setSelectedVariantId(null);
        setVariantHint('');
        getProductById(id)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data.product);
                    setRelatedProducts(data.related_products ?? []);
                    setActiveIdx(0);
                    setQuantity(1);
                    const variants = data.product?.variants ?? [];
                    const inStockVariants = variants.filter((v) => v.stock > 0);
                    if (inStockVariants.length === 1) {
                        setSelectedVariantId(inStockVariants[0].id);
                    } else {
                        setSelectedVariantId(null);
                    }
                }
            })
            .catch(() => {
                if (!cancelled) setError('Không tải được sản phẩm.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id]);
    useEffect(() => {
        if (!location.state?.message) return;
        setVariantHint(location.state.message);
        navigate(location.pathname, { replace: true, state: null });
    }, [location.pathname, location.state?.message, navigate]);
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
        const cat = product.category;
        const parentCat = cat?.parent;
        const variants = product.variants ?? [];
        const selectedVariant =
            variants.find((v) => v.id === selectedVariantId) ?? null;
        const display = selectedVariant
            ? {
                price: selectedVariant.price,
                price_original: selectedVariant.price_original,
                stock: selectedVariant.stock,
                images:
                    selectedVariant.images?.length > 0
                        ? selectedVariant.images
                        : product.images,
            }
            : {
                price: product.price,
                price_original: product.price_original,
                stock: product.stock,
                images: product.images,
            };
            const handleAddToCart = () => {
                if (variants.length > 0 && !selectedVariantId) {
                    const label = product.variant_group?.label || 'cấu hình';
                    setVariantHint(`Vui lòng chọn ${label.toLowerCase()} trước khi thêm vào giỏ.`);
                    return false;
                }
                if (display.stock <= 0 || quantity < 1 || quantity > display.stock) {
                    return false;
                }
                setVariantHint('');
                addToCart({
                    productId: product.id,
                    variantId: selectedVariantId,
                    hasVariants: variants.length > 0,
                    name: product.name,
                    optionLabel: selectedVariant?.option_label ?? '',
                    price: display.price,
                    priceOriginal: display.price_original,
                    image: display.images?.[0] ?? '',
                    quantity,
                    maxStock: display.stock,
                });
                return true;
            };
            const handleBuyNow = () => {
                if (variants.length > 0 && !selectedVariantId) {
                    const label = product.variant_group?.label || 'cấu hình';
                    setVariantHint(`Vui lòng chọn ${label.toLowerCase()} trước khi mua.`);
                    return false;
                }
                if (display.stock <= 0 || quantity < 1 || quantity > display.stock) {
                    return false;
                }
                setVariantHint('');
                addToCart({
                    productId: product.id,
                    variantId: selectedVariantId,
                    hasVariants: variants.length > 0,
                    name: product.name,
                    optionLabel: selectedVariant?.option_label ?? '',
                    price: display.price,
                    priceOriginal: display.price_original,
                    image: display.images?.[0] ?? '',
                    quantity,
                    maxStock: display.stock,
                });
                if (!authLoading && !isAuthenticated) {
                    navigate('/dang-nhap?next=/checkout');
                    return;
                }
                navigate('/checkout');
                return true;
            };
        const inStock = display.stock > 0;
        const decQty = () => setQuantity((q) => Math.max(1, q - 1));
        const incQty = () =>
            setQuantity((q) => Math.min(display.stock, q + 1));
        const handleSelectVariant = (variantId) => {
            setSelectedVariantId(variantId);
            setVariantHint('');
            setActiveIdx(0);
            setQuantity(1);
        };
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
                    <div className={styles.productCard}>
                        <div className={styles.grid}>
                            <ProductGallery
                                images={display.images}
                                activeIdx={activeIdx}
                                onChange={setActiveIdx}
                                alt={product.name}
                            />
                            <ProductBuyBox
                                product={{
                                    ...product,
                                    price: display.price,
                                    price_original: display.price_original,
                                    stock: display.stock,
                                }}
                                variantGroup={product.variant_group}
                                variants={variants}
                                selectedVariantId={selectedVariantId}
                                onSelectVariant={handleSelectVariant}
                                quantity={quantity}
                                onDecQty={decQty}
                                onIncQty={incQty}
                                onScrollToReviews={scrollToReviews}
                                reviewStats={reviewStats}
                                shortDesc={shortDesc}
                                variantHint={variantHint}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                            />
                        </div>
                    </div>
                <ProductSpecs product={product} />
                <ProductReviews
                    productId={product.id}
                    onStatsChange={setReviewStats}
                />
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
                    </section>
                )}
                </main>
                <MyFooter />
            </>
        );
}
export default ProductDetailPage;
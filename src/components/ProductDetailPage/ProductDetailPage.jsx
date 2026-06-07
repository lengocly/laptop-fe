import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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


//fetch API, state chung

function ProductDetailPage() {
    const { id } = useParams();
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
    const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 });



    // ─── Luồng 1: load SP khi vào trang hoặc đổi id ───
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelatedProducts([]);
        setActiveIdx(0);
        setQuantity(1);
        setSelectedVariantId(null); //mỗi khi đổi sang sản phẩm khác, nó reset lại biến thể đang chọn

        getProductById(id)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data.product); //lấy sản phẩm chính
                    setRelatedProducts(data.related_products ?? []); //nếu không có sản phẩm liên quan, trả về danh sách trống.

                    //Tự chọn biến thể đầu tiên.
                    setSelectedVariantId(data.product?.variants?.[0]?.id ?? null);
                    setActiveIdx(0);
                    setQuantity(1);
                    //Nếu sản phẩm có variant, tự chọn variant đầu tiên.
                    //Nếu không có variant, selectedVariantId = null.
                    //Reset ảnh về ảnh đầu tiên.
                    //Reset số lượng về 1
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
    
        //Lấy danh sách biến thể
        const variants = product.variants ?? [];
        //Tìm biến thể đang chọn
        const selectedVariant =
            variants.find((v) => v.id === selectedVariantId) ?? null;

            //display là dữ liệu cuối cùng dùng để hiển thị ra giao diện.
        const display = selectedVariant
        //2TH: th1 Nếu selectedVariant tồn tại, thì lấy dữ liệu từ biến thể
            ? {
                price: selectedVariant.price,
                price_original: selectedVariant.price_original,
                stock: selectedVariant.stock,
                images:
                    selectedVariant.images?.length > 0
                        ? selectedVariant.images
                        : product.images,
            }
            //th2 Nếu selectedVariant không tồn tại, thì lấy dữ liệu từ sản phẩm chính.
            : {
                price: product.price,
                price_original: product.price_original,
                stock: product.stock,
                images: product.images,
            };

            const handleAddToCart = () => {
                addToCart({
                    productId: product.id,
                    variantId: selectedVariantId,
                    name: product.name,
                    optionLabel: selectedVariant?.option_label ?? '',
                    price: display.price,
                    priceOriginal: display.price_original,
                    image: display.images?.[0] ?? '',
                    quantity,
                    maxStock: display.stock,
                });
            };

            // ─── Mua ngay ───
            const handleBuyNow = () => {
                // Validate số lượng & tồn kho
                if (display.stock <= 0 || quantity < 1 || quantity > display.stock) {
                    return;
                }
                // Validate biến thể khi sản phẩm có variant
                if (variants.length > 0 && !selectedVariantId) {
                    return;
                }

                // Gọi addToCart — merge qty nếu cùng SP + biến thể (giống Thêm vào giỏ)
                addToCart({
                    productId: product.id,
                    variantId: selectedVariantId,
                    name: product.name,
                    optionLabel: selectedVariant?.option_label ?? '',
                    price: display.price,
                    priceOriginal: display.price_original,
                    image: display.images?.[0] ?? '',
                    quantity,
                    maxStock: display.stock,
                });

                // Điều hướng checkout; xử lý chưa đăng nhập → login kèm next=/checkout
                if (!authLoading && !isAuthenticated) {
                    navigate('/dang-nhap?next=/checkout');
                    return;
                }
                navigate('/checkout');
            };

        const inStock = display.stock > 0;

        //Giảm số lượng: Khi bấm nút -, số lượng giảm đi 1, Nhưng không cho giảm thấp hơn 1
        const decQty = () => setQuantity((q) => Math.max(1, q - 1));

        //Tăng số lượng: Khi bấm nút +, số lượng tăng đi 1, Nhưng không cho tăng cao hơn số lượng tồn kho.
        const incQty = () =>
            setQuantity((q) => Math.min(display.stock, q + 1));


        //Chọn biến thể: Khi chọn biến thể, thì số lượng reset về 1, và ảnh reset về ảnh đầu tiên.
        const handleSelectVariant = (variantId) => {
            setSelectedVariantId(variantId);
            setActiveIdx(0);
            setQuantity(1);
        };

    //==============================================
    
        //Cuộn xuống phần đánh giá: Khi bấm nút "Đánh giá", thì cuộn xuống phần đánh giá.
        const scrollToReviews = () => {
            document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
        };
    
        //Mô tả ngắn: Lấy mô tả ngắn từ sản phẩm.
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
                                images={display.images} //đổi ảnh theo biến thể đang chọn
                                activeIdx={activeIdx} //index của ảnh hiện tại
                                onChange={setActiveIdx} //hàm xử lý khi chọn ảnh
                                alt={product.name}  //làm mô tả ảnh
                            />

                            {/* ProductBuyBox: Thông tin sản phẩm, giá, số lượng, biến thể, chọn biến thể, giảm số lượng, tăng số lượng, cuộn xuống phần đánh giá, mô tả ngắn. */}
                            <ProductBuyBox
                                product={{ //Tạo một object product mới, giữ nguyên toàn bộ dữ liệu cũ của product, nhưng ghi đè lại price, price_original, stock theo biến thể đang chọn
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
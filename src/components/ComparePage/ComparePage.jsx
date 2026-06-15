import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseOutline } from 'react-icons/io5';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import { CompareContext } from '@/contexts/CompareProvider';
import { getProductById } from '@/apis/productsService';
import { calcDiscountPercent, formatVnd, parsePriceNumber } from '@/utils/price';
import { canCompareProduct } from '@/utils/compare';
import {
    COMPARE_SPEC_SECTIONS,
    getProductSpecValue,
    isRowDifferent,
} from './compareSpecs';
import styles from './styles.module.scss';

const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=640&q=80';

function ComparePage() {
    const { items, removeFromCompare, clearCompare, count, maxItems } =
        useContext(CompareContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [onlyDiff, setOnlyDiff] = useState(false);
    const [openSections, setOpenSections] = useState(() =>
        COMPARE_SPEC_SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {})
    );

    useEffect(() => {
        if (items.length === 0) {
            setProducts([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        Promise.all(
            items.map((item) =>
                getProductById(item.productId)
                    .then((res) => {
                        const parentSlug = res.product?.category?.parent?.slug;
                        if (!canCompareProduct(parentSlug)) {
                            removeFromCompare(item.productId);
                            return null;
                        }
                        return {
                            ...res.product,
                            _compareImage: item.image,
                        };
                    })
                    .catch(() => {
                        if (!canCompareProduct(item.parentGroupSlug)) {
                            removeFromCompare(item.productId);
                            return null;
                        }
                        return {
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            price_original: item.priceOriginal,
                            images: item.image ? [item.image] : [],
                            cpu: item.cpu,
                            ram: item.ram,
                            storage: item.storage,
                            screen: item.screen,
                            _compareImage: item.image,
                            _failed: true,
                        };
                    })
            )
        )
            .then((list) => {
                if (!cancelled) {
                    setProducts(list.filter(Boolean));
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [items, removeFromCompare]);

    const canCompare = count >= 2;

    const toggleSection = (id) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const visibleSections = useMemo(() => {
        return COMPARE_SPEC_SECTIONS.map((section) => {
            const rows = section.rows.filter((row) => {
                if (!onlyDiff) return true;
                return isRowDifferent(products, row.key);
            });
            return { ...section, rows };
        }).filter((section) => section.rows.length > 0);
    }, [onlyDiff, products]);

    return (
        <>
            <MyHeader />
            <MainLayout>
                <div className={styles.page}>
                    <div className={styles.topBar}>
                        <h1 className={styles.title}>So sánh laptop</h1>
                        {count > 0 && (
                            <button
                                type="button"
                                className={styles.clearAllLink}
                                onClick={clearCompare}
                            >
                                Xóa tất cả sản phẩm
                            </button>
                        )}
                    </div>

                    {count === 0 && (
                        <div className={styles.empty}>
                            <p>Chưa có laptop để so sánh.</p>
                            <Link to="/cua-hang" className={styles.storeLink}>
                                Khám phá cửa hàng
                            </Link>
                        </div>
                    )}

                    {count === 1 && (
                        <div className={styles.hintBox}>
                            Hãy thêm ít nhất <strong>2 laptop</strong> để so sánh (
                            {count}/{maxItems}).
                        </div>
                    )}

                    {count > 0 && (
                        <>
                            <label className={styles.diffToggle}>
                                <input
                                    type="checkbox"
                                    checked={onlyDiff}
                                    onChange={(e) => setOnlyDiff(e.target.checked)}
                                    disabled={!canCompare}
                                />
                                Chỉ xem điểm khác biệt
                            </label>

                            {loading && <p className={styles.loading}>Đang tải thông số…</p>}

                            <div className={styles.compareScroll}>
                            <div
                                className={styles.compareGrid}
                                style={{
                                    '--compare-cols': products.length || 1,
                                }}
                            >
                                <div className={styles.labelCol}>
                                    <div className={styles.labelHead}>
                                        {canCompare ? (
                                            <span>So sánh nhanh</span>
                                        ) : (
                                            <span>Danh sách</span>
                                        )}
                                    </div>
                                    {canCompare &&
                                        visibleSections.map((section) => (
                                            <div key={section.id} className={styles.labelSection}>
                                                <button
                                                    type="button"
                                                    className={styles.sectionToggle}
                                                    onClick={() => toggleSection(section.id)}
                                                >
                                                    {section.title}
                                                </button>
                                                {openSections[section.id] &&
                                                    section.rows.map((row) => (
                                                        <div
                                                            key={row.key}
                                                            className={styles.labelRow}
                                                        >
                                                            {row.label}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                </div>

                                {products.map((product) => {
                                    const image =
                                        product.images?.[0] ||
                                        product._compareImage ||
                                        IMG_FALLBACK;
                                    const priceNum = parsePriceNumber(product.price);
                                    const priceOriginalNum = parsePriceNumber(
                                        product.price_original
                                    );
                                    const discount = calcDiscountPercent(
                                        product.price,
                                        product.price_original
                                    );
                                    const quickSpecs = [
                                        product.cpu,
                                        product.ram,
                                        product.storage,
                                    ].filter(Boolean);

                                    return (
                                        <div key={product.id} className={styles.productCol}>
                                            <div className={styles.productCard}>
                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={() =>
                                                        removeFromCompare(product.id)
                                                    }
                                                    aria-label="Xóa khỏi so sánh"
                                                >
                                                    <IoCloseOutline />
                                                </button>

                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className={styles.imageWrap}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = IMG_FALLBACK;
                                                        }}
                                                    />
                                                </Link>

                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className={styles.productName}
                                                >
                                                    {product.name}
                                                </Link>

                                                <div className={styles.priceBlock}>
                                                    <span className={styles.priceCurrent}>
                                                        {formatVnd(priceNum)}
                                                    </span>
                                                    {product.price_original && (
                                                        <span className={styles.priceOld}>
                                                            {formatVnd(priceOriginalNum)}
                                                        </span>
                                                    )}
                                                    {discount > 0 && (
                                                        <span className={styles.discountBadge}>
                                                            -{discount}%
                                                        </span>
                                                    )}
                                                </div>

                                                {quickSpecs.length > 0 && (
                                                    <ul className={styles.quickList}>
                                                        {quickSpecs.map((spec) => (
                                                            <li key={spec}>{spec}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className={styles.buyBtn}
                                                >
                                                    MUA NGAY
                                                </Link>
                                            </div>

                                            {canCompare &&
                                                visibleSections.map((section) => (
                                                    <div
                                                        key={section.id}
                                                        className={styles.valueSection}
                                                    >
                                                        <div
                                                            className={styles.valueSectionHead}
                                                            aria-hidden
                                                        />
                                                        {openSections[section.id] &&
                                                            section.rows.map((row) => (
                                                                <div
                                                                    key={row.key}
                                                                    className={styles.valueRow}
                                                                >
                                                                    {getProductSpecValue(
                                                                        product,
                                                                        row.key
                                                                    )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                })}
                            </div>
                            </div>

                            {canCompare && visibleSections.length === 0 && !loading && (
                                <p className={styles.noDiff}>
                                    Các sản phẩm đang chọn có thông số giống nhau.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </MainLayout>
            <MyFooter />
        </>
    );
}

export default ComparePage;

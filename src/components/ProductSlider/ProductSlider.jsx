import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductItem from '@components/ProductItem/ProductItem';
import styles from './styles.module.scss';
function ProductSlider({ data = [], title }) {
    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const updateNav = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        setCanPrev(el.scrollLeft > 8);
        setCanNext(el.scrollLeft < maxScroll - 8);
    }, []);
    useEffect(() => {
        updateNav();
        const el = trackRef.current;
        if (!el) return undefined;
        el.addEventListener('scroll', updateNav, { passive: true });
        window.addEventListener('resize', updateNav);
        return () => {
            el.removeEventListener('scroll', updateNav);
            window.removeEventListener('resize', updateNav);
        };
    }, [data, updateNav]);
    const scrollByPage = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const amount = Math.max(el.clientWidth * 0.9, 280);
        el.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };
    if (!data.length) return null;
    return (
        <div className={styles.wrap}>
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}
            <div className={styles.slider}>
                <button
                    type="button"
                    className={styles.navBtn}
                    aria-label="Sản phẩm trước"
                    disabled={!canPrev}
                    onClick={() => scrollByPage(-1)}
                >
                    <FiChevronLeft size={22} />
                </button>
                <div className={styles.track} ref={trackRef}>
                    {data.map((item) => (
                        <div key={item.id} className={styles.slide}>
                            <ProductItem
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
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    className={styles.navBtn}
                    aria-label="Sản phẩm sau"
                    disabled={!canNext}
                    onClick={() => scrollByPage(1)}
                >
                    <FiChevronRight size={22} />
                </button>
            </div>
        </div>
    );
}
export default ProductSlider;


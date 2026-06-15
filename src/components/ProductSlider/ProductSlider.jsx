/**
 * =============================================================================
 * ProductSlider — Carousel sản phẩm ngang (chuẩn TMĐT)
 * =============================================================================
 * Vai trò:
 * - Hiển thị danh sách SP trên 1 hàng, lướt trái/phải bằng nút ‹ › hoặc vuốt tay.
 *
 * Props:
 * - data: mảng sản phẩm từ API (HomePage → PopularProduct truyền xuống)
 * - title: tiêu đề section (tuỳ chọn; trang chủ dùng AdvanceHeadling riêng)
 *
 * Cách hoạt động:
 * 1. .track = vùng scroll ngang (overflow-x: auto)
 * 2. scrollByPage() lướt ~90% chiều rộng mỗi lần bấm nút
 * 3. updateNav() bật/tắt nút ‹ › khi đã tới đầu/cuối danh sách
 *
 * File liên quan:
 * - ProductItem.jsx — thẻ 1 sản phẩm
 * - PopularProduct.jsx — bọc MainLayout + gọi component này
 * =============================================================================
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductItem from '@components/ProductItem/ProductItem';
import styles from './styles.module.scss';

function ProductSlider({ data = [], title }) {
    // ref trỏ tới div .track — dùng scrollLeft / scrollWidth
    const trackRef = useRef(null);

    // canPrev/canNext: có được bấm nút trái/phải không
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    // Kiểm tra vị trí scroll → cập nhật trạng thái nút
    const updateNav = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        setCanPrev(el.scrollLeft > 8);
        setCanNext(el.scrollLeft < maxScroll - 8);
    }, []);

    // Lắng nghe scroll + resize để nút ‹ › luôn đúng
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

    // direction: -1 = lùi, +1 = tiến — scroll mượt behavior: 'smooth'
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
                {/* Nút lùi — disabled khi đang ở SP đầu tiên */}
                <button
                    type="button"
                    className={styles.navBtn}
                    aria-label="Sản phẩm trước"
                    disabled={!canPrev}
                    onClick={() => scrollByPage(-1)}
                >
                    <FiChevronLeft size={22} />
                </button>

                {/* Hàng SP — mỗi .slide bọc 1 ProductItem */}
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

                {/* Nút tiến — disabled khi đã tới SP cuối */}
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

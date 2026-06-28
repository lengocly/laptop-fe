import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MainLayout from '@components/Layout/Layout';
import ReviewVideoCard from './ReviewVideoCard';
import { reviewChannelUrl, reviewVideos } from './constants';
import styles from './styles.module.scss';
function ProductReviewSection() {
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
    }, [updateNav]);
    const scrollByPage = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const amount = Math.max(el.clientWidth * 0.85, 220);
        el.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };
    if (!reviewVideos.length) return null;
    return (
        <MainLayout>
            <section className={styles.section} aria-labelledby="review-section-title">
                <header className={styles.header}>
                    <h2 id="review-section-title" className={styles.title}>
                        REVIEW SẢN PHẨM
                    </h2>
                    <a
                        href={reviewChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.youtubeLink}
                    >
                        Xem YouTube ›
                    </a>
                </header>
                <div className={styles.slider}>
                    <button
                        type="button"
                        className={styles.navBtn}
                        aria-label="Video trước"
                        disabled={!canPrev}
                        onClick={() => scrollByPage(-1)}
                    >
                        <FiChevronLeft size={22} />
                    </button>
                    <div className={styles.track} ref={trackRef}>
                        {reviewVideos.map((item) => (
                            <div key={item.youtubeId} className={styles.slide}>
                                <ReviewVideoCard item={item} />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className={styles.navBtn}
                        aria-label="Video sau"
                        disabled={!canNext}
                        onClick={() => scrollByPage(1)}
                    >
                        <FiChevronRight size={22} />
                    </button>
                </div>
            </section>
        </MainLayout>
    );
}
export default ProductReviewSection;


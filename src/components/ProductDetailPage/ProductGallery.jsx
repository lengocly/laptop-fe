import styles from './styles.module.scss';
function ProductGallery({ images, activeIdx, onChange, alt = 'Sản phẩm' }) {
    const list = images ?? [];
    if (!list.length) {
        return (
            <div className={styles.gallery}>
                <div className={styles.mainImgWrap}>
                    <p>Chưa có ảnh sản phẩm</p>
                </div>
            </div>
        );
    }
    const safeIdx = Math.min(activeIdx, list.length - 1);
    const mainSrc = list[safeIdx];
    const showArrows = list.length > 1;
    const goPrev = () => {
        onChange(safeIdx === 0 ? list.length - 1 : safeIdx - 1);
    };
    const goNext = () => {
        onChange(safeIdx === list.length - 1 ? 0 : safeIdx + 1);
    };
    return (
        <div className={styles.gallery}>
            <div className={styles.mainImgWrap}>
                {showArrows && (
                    <button
                        type="button"
                        className={styles.arrowLeft}
                        onClick={goPrev}
                        aria-label="Ảnh trước"
                    >
                        ‹
                    </button>
                )}
                <img
                    src={mainSrc}
                    alt={alt}
                    className={styles.mainImg}
                />
                {showArrows && (
                    <button
                        type="button"
                        className={styles.arrowRight}
                        onClick={goNext}
                        aria-label="Ảnh sau"
                    >
                        ›
                    </button>
                )}
            </div>
            <div className={styles.thumbs}>
                {list.map((src, i) => (
                    <button
                        key={i}
                        type="button"
                        className={i === safeIdx ? styles.thumbActive : styles.thumb}
                        onClick={() => onChange(i)}
                    >
                        <img src={src} alt="" />
                    </button>
                ))}
            </div>
        </div>
    );
}
export default ProductGallery;
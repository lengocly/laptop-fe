/**
 * ProductReviews — placeholder; Phase sau nối API reviews.
 */
import styles from './styles.module.scss';

function ProductReviews() {
    return (
        <section className={styles.reviewsCard} id="reviews">
            <h2 className={styles.sectionTitle}>Đánh giá từ khách hàng</h2>
            <p className={styles.reviewsPlaceholder}>
                ★ 0.0 — Chưa có đánh giá cho sản phẩm này
            </p>
        </section>
    );
}

export default ProductReviews;
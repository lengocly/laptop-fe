import { Link } from 'react-router-dom';
import BlogImage from './BlogImage';
import styles from './blogDetail.module.scss';

/** Thẻ gợi ý sản phẩm trong bài viết — link sang trang chi tiết SP */
function BlogProductEmbed({ productId, name, price, image }) {
    if (!productId) return null;

    return (
        <Link to={`/product/${productId}`} className={styles.productEmbed}>
            <div className={styles.productEmbedImage}>
                <BlogImage src={image} alt={name || ''} />
            </div>
            <div className={styles.productEmbedInfo}>
                <span className={styles.productEmbedLabel}>Sản phẩm BetaTech</span>
                <h4 className={styles.productEmbedName}>{name}</h4>
                {price && <p className={styles.productEmbedPrice}>{price}</p>}
                <span className={styles.productEmbedCta}>Xem chi tiết →</span>
            </div>
        </Link>
    );
}

export default BlogProductEmbed;

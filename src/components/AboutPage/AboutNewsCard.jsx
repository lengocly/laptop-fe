/**
 * AboutNewsCard — 1 thẻ bài viết, click mở trang chi tiết
 */
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

function AboutNewsCard({ card }) {
    const { slug, category, date, title, excerpt, image } = card;

    return (
        <Link to={`/gioi-thieu/bai-viet/${slug}`} className={styles.newsCardLink}>
            <article className={styles.newsCard}>
                <div className={styles.newsMeta}>
                    <span className={styles.newsCategory}>
                        <span className={styles.newsDot} />
                        {category}
                    </span>
                    <time className={styles.newsDate}>{date}</time>
                </div>

                <div className={styles.newsImage}>
                    <img src={image} alt={title} loading="lazy" />
                </div>

                <h3 className={styles.newsTitle}>{title}</h3>
                <p className={styles.newsExcerpt}>{excerpt}</p>
            </article>
        </Link>
    );
}

export default AboutNewsCard;

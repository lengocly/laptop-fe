import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import BlogImage from '@components/AboutPage/BlogImage';
import { youtubeEmbedUrl, youtubeThumbUrl } from './constants';
import styles from './styles.module.scss';

function ReviewVideoCard({ item }) {
    const [playing, setPlaying] = useState(false);
    const { youtubeId, videoTitle, productId, name, price, priceOriginal, image } = item;

    return (
        <article className={styles.card}>
            <div className={styles.videoWrap}>
                {playing ? (
                    <iframe
                        src={youtubeEmbedUrl(youtubeId, true)}
                        title={videoTitle}
                        className={styles.iframe}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <button
                        type="button"
                        className={styles.thumbBtn}
                        onClick={() => setPlaying(true)}
                        aria-label={`Phát video ${videoTitle}`}
                    >
                        <img
                            src={youtubeThumbUrl(youtubeId)}
                            alt={videoTitle}
                            className={styles.thumb}
                            loading="lazy"
                        />
                        <span className={styles.playOverlay}>
                            <FiPlay size={28} aria-hidden />
                        </span>
                        <span className={styles.videoLabel}>{videoTitle}</span>
                    </button>
                )}
            </div>

            <Link to={`/product/${productId}`} className={styles.productBar}>
                <div className={styles.productThumb}>
                    <BlogImage src={image} alt={name} />
                </div>
                <div className={styles.productInfo}>
                    <p className={styles.productName}>{name}</p>
                    <p className={styles.productPrice}>{price}</p>
                    {priceOriginal && (
                        <p className={styles.productPriceOld}>{priceOriginal}</p>
                    )}
                </div>
            </Link>
        </article>
    );
}

export default ReviewVideoCard;

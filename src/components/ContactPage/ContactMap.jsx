/**
 * ContactMap — Nhúng Google Maps (iframe)
 *
 * Cách hoạt động:
 *  - Google cung cấp URL embed → đặt vào thẻ <iframe>
 *  - Khách bấm "Chỉ đường" → mở Google Maps tab mới
 *
 * Config: constants.js → mapConfig
 */
import { mapConfig } from './constants';
import styles from './styles.module.scss';

function ContactMap() {
    const { title, address, embedUrl, directionsUrl } = mapConfig;

    return (
        <section className={styles.mapSection}>
            <div className={styles.mapHeader}>
                <div>
                    <h2 className={styles.mapTitle}>{title}</h2>
                    <p className={styles.mapAddress}>{address}</p>
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapDirectionsBtn}
                >
                    Chỉ đường
                </a>
            </div>

            <div className={styles.mapFrame}>
                <iframe
                    title={`Bản đồ ${address}`}
                    src={embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>
        </section>
    );
}

export default ContactMap;

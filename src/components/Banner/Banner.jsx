import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import bannerImg from '@icons/images/banner.png';
import banner1Img from '@icons/images/banner1.avif';
import banner2Img from '@icons/images/banner2.webp';
const BANNERS = [bannerImg, banner1Img, banner2Img];
const AUTO_MS = 5000;
function Banner() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % BANNERS.length);
        }, AUTO_MS);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className={styles.container}>
            {BANNERS.map((src, i) => (
                <div
                    key={src}
                    className={styles.bg}
                    style={{
                        backgroundImage: `url(${src})`,
                        opacity: i === index ? 1 : 0,
                    }}
                    aria-hidden={i !== index}
                />
            ))}
            <div className={styles.overlay} aria-hidden />
            <div className={styles.content}>
                <h1 className={styles.title}>BetaTech</h1>
                <div className={styles.des}>Khám phá laptop phù hợp với bạn.</div>
                <button
                    type="button"
                    className={styles.ctaBtn}
                    onClick={() => navigate('/cua-hang')}
                >
                    Khám phá ngay
                </button>
            </div>
            <div className={styles.dots}>
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={i === index ? styles.dotActive : styles.dot}
                        aria-label={`Banner ${i + 1}`}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
}
export default Banner;


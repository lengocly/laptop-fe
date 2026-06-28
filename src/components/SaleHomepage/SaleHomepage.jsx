import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/Button/Button';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import useTranslateXImage from '@/hooks/useTranslateXImage';
function SaleHomepage() {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const { translateXPosition } = useTranslateXImage(sectionRef);
    return (
        <MainLayout>
            <div className={styles.container} ref={sectionRef}>
                <div
                    className={`${styles.boxImage} ${styles.boxImageLeft}`}
                    style={{
                        transform: `translateX(${translateXPosition}px)`,
                        transition:
                            'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease',
                        opacity: translateXPosition === 0 ? 1 : 0.75,
                    }}
                >
                    <img
                        src="https://macstores.vn/wp-content/uploads/2026/03/macbook-pro-m5-16-inch-pro-max-silver-1.jpg"
                        alt="MacBook khuyến mãi"
                        loading="lazy"
                    />
                </div>
                <div className={styles.content}>
                    <h2 className={styles.title}>Sale tưng bừng</h2>
                    <p className={styles.des}>Số lượng có hạn nhanh tay rinh quà.</p>
                    <div className={styles.boxBtn}>
                        <Button
                            content="Tìm hiểu"
                            isPrimary={false}
                            onClick={() => navigate('/gioi-thieu')}
                        />
                    </div>
                </div>
                <div
                    className={`${styles.boxImage} ${styles.boxImageRight}`}
                    style={{
                        transform: `translateX(-${translateXPosition}px)`,
                        transition:
                            'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease',
                        opacity: translateXPosition === 0 ? 1 : 0.75,
                    }}
                >
                    <img
                        src="https://macstores.vn/wp-content/uploads/2023/01/macbook-pro-m2-pro-space-gray.jpg"
                        alt="Laptop khuyến mãi"
                        loading="lazy"
                    />
                </div>
            </div>
        </MainLayout>
    );
}
export default SaleHomepage;


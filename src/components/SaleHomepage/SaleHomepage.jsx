import Button from '@components/Button/Button';
import styles from './styles.module.scss';
import useTranslateXImage from '@/hooks/useTranslateXImage';

// sau phần sản phẩm PopularProduct
function SaleHomepage() {
    const { container, title, des, boxBtn, boxImage } = styles;

    const { translateXPosition } = useTranslateXImage();

    return (
        <div className={container}>
            <div
                className={boxImage}
                style={{
                    // áp dụng hiệu ứng trượt sang 2 bên cho ảnh khi cuộn xuống dưới
                    transform: `translateX(${translateXPosition}px)`,
                    transition: 'transform 0.6s ease'
                }}
            >
                <img
                    src='https://macstores.vn/wp-content/uploads/2026/03/macbook-pro-m5-16-inch-pro-max-silver-1.jpg'
                    alt=''
                />
            </div>
            <div>
                <h2 className={title}>Sale từng bừng</h2>
                <p className={des}>Số lượng có hạn nhanh tay rinh quà.</p>
                <div className={boxBtn}>
                    <Button content={'Tìm hiểu'} isPrimary={false} />
                </div>
            </div>
            <div
                className={boxImage}
                style={{
                    // áp dụng hiệu ứng trượt sang 2 bên cho ảnh khi cuộn xuống dưới
                    transform: `translateX(-${translateXPosition}px)`,
                    transition: 'transform 0.6s ease'
                }}
            >
                <img
                    src='https://macstores.vn/wp-content/uploads/2023/01/macbook-pro-m2-pro-space-gray.jpg'
                    alt=''
                />
            </div>
        </div>
    );
}

export default SaleHomepage;

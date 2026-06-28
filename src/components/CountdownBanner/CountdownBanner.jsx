import { useNavigate } from 'react-router-dom';
import CountdownTimer from '@components/CountdownTimer/CountdownTimer';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import demImg from '@icons/images/dem.jpg';
const PROMO_PRODUCT_ID = 3;
function CountdownBanner() {
    const navigate = useNavigate();
    const { container, containerTimmer, title, boxBtn } = styles;
    const targetDate = '2026-06-28T00:00:00';
    return (
        <div
            className={container}
            style={{ backgroundImage: `url(${demImg})` }}
        >
            <div className={containerTimmer}>
                <CountdownTimer targetDate={targetDate} />
            </div>
            <div className={boxBtn}>
                <Button
                    content="Mua ngay"
                    onClick={() => navigate(`/product/${PROMO_PRODUCT_ID}`)}
                />
            </div>
        </div>
    );
}
export default CountdownBanner;


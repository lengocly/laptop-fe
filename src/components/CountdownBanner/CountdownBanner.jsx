import CountdownTimer from '@components/CountdownTimer/CountdownTimer';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import demImg from '@icons/images/dem.jpg';

function CountdownBanner() {
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
                <Button content={'Mua ngay'} />
            </div>
        </div>
    );
}

export default CountdownBanner;

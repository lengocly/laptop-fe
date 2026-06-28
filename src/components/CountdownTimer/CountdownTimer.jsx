import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
const CountdownTimer = ({ targetDate }) => {
    const { box, title } = styles;
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                Ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Phút: Math.floor((difference / 1000 / 60) % 60),
                Giây: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }
    useEffect(() => {
        if (Object.keys(timeLeft).length === 0) return undefined;
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, targetDate]);
    const formatNumber = (number) => {
        return String(number).padStart(2, '0');
    };
    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (timeLeft[interval] !== undefined) {
            timerComponents.push(
                <span key={interval} className={box}>
                    {formatNumber(timeLeft[interval])}{' '}
                    <span className={title}>{interval}</span>{' '}
                </span>
            );
        }
    });
    return timerComponents;
};
export default CountdownTimer;


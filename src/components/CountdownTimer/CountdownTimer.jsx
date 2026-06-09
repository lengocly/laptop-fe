import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

//bộ đếm ngược
const CountdownTimer = ({ targetDate }) => {
    const { box, title } = styles; //css

    // state lưu lại giá trị đếm ngược
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    //trừ từ date bạn truyền vào - giờ hiện tại vì đếm ngược
    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            //CT tính ngày giờ phút giây khi đếm ngược
            timeLeft = {
                Ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Phút: Math.floor((difference / 1000 / 60) % 60),
                Giây: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }

    // Đếm mỗi giây; dừng khi hết giờ — tránh timer chạy vô hạn
    useEffect(() => {
        if (Object.keys(timeLeft).length === 0) return undefined;

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, targetDate]);

    // khi số có 1 chữ số thì thêm 0 ở đầu
    const formatNumber = (number) => {
        return String(number).padStart(2, '0');
    };

    // path key của object thành mảng để foreach qua rồi in ra màn hình số đếm ngược đó
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

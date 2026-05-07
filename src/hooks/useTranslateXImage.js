import useScrollHandling from '@/hooks/useScrollHandling';
import { useEffect, useState } from 'react';

// hook để xử lý hiệu ứng trượt sang 2 bên cho ảnh khi cuộn xuống dưới
const useTranslateXImage = () => {
    const { scrollPosition, scrollDriction } = useScrollHandling();

    const [translateXPosition, setTranslateXPoisition] = useState(80);

    //tạo hàm để xử lý khi cuộn xuống dưới trượt sang 2 bên
    const handleTranslateX = () => {
        if (scrollDriction === 'down' && scrollPosition >= 3500) {
            setTranslateXPoisition(
                translateXPosition <= 0 ? 0 : translateXPosition - 1
            );
        } else if (scrollDriction === 'up') {
            //khi cuộn lên trên cố định
            setTranslateXPoisition(
                translateXPosition >= 80 ? 80 : translateXPosition + 1
            );
        }
    };

    //gọi hàm xử lý khi cuộn xuống dưới trượt sang 2 bên
    useEffect(() => {
        handleTranslateX();
    }, [scrollPosition]);

    return { translateXPosition };
};

export default useTranslateXImage;

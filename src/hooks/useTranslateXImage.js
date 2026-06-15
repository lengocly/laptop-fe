import { useEffect, useState } from 'react';

/**
 * Hiệu ứng 2 ảnh laptop trượt ra 2 bên khi user scroll tới khối Sale.
 * Dùng Intersection Observer — không phụ thuộc pixel cố định (3500px cũ bị lệch sau đổi layout).
 *
 * @param {React.RefObject} sectionRef — ref gắn vào .container của SaleHomepage
 */
const useTranslateXImage = (sectionRef) => {
    const [translateXPosition, setTranslateXPosition] = useState(72);

    useEffect(() => {
        const el = sectionRef?.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTranslateXPosition(0);
                } else if (entry.boundingClientRect.top > 0) {
                    setTranslateXPosition(72);
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [sectionRef]);

    return { translateXPosition };
};

export default useTranslateXImage;

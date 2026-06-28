import { useEffect, useState } from 'react';
const useTranslateXImage = (sectionRef) => {
    const [translateXPosition, setTranslateXPosition] = useState(36);
    useEffect(() => {
        const el = sectionRef?.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTranslateXPosition(0);
                } else if (entry.boundingClientRect.top > 0) {
                    setTranslateXPosition(36);
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


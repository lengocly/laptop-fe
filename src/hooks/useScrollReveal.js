import { useEffect, useRef, useState } from 'react';
export default function useScrollReveal({
    once = true,
    threshold = 0.12,
    rootMargin = '0px 0px -6% 0px',
} = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                    return;
                }
                if (!once && entry.boundingClientRect.top > window.innerHeight) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [once, threshold, rootMargin]);
    return { ref, isVisible };
}


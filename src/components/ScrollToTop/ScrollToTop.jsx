import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Mỗi lần đổi trang → cuộn lên đầu */
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}

export default ScrollToTop;

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';
import { SideBarContext } from '@/contexts/SideBarProvider';

function Menu({ content, href, onClick }) {
    const { menu } = styles;
    const { setIsOpen, setType } = useContext(SideBarContext);

    const handleClick = () => {
        // Hành động tùy chỉnh (vd: mở overlay tìm kiếm)
        if (onClick) {
            onClick();
            return;
        }

        if (content === 'Đăng nhập') {
            setIsOpen(true);
            setType('login');
        }
    };

    if (href && href !== '#' && !onClick) {
        return (
            <Link to={href} className={menu}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" className={menu} onClick={handleClick}>
            {content}
        </button>
    );
}

export default Menu;

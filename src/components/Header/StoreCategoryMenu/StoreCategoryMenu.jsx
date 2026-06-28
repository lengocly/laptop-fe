import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import {
    FiChevronDown,
    FiChevronRight,
    FiGrid,
    FiHeadphones,
    FiPackage,
} from 'react-icons/fi';
import { PiKeyboard, PiLaptop } from 'react-icons/pi';
import { TbMouse } from 'react-icons/tb';
import { getCategories } from '@/apis/categoriesService';
import styles from '../styles.module.scss';
const CATEGORY_ICONS = {
    laptop: PiLaptop,
    chuot: TbMouse,
    'ban-phim': PiKeyboard,
    'tai-nghe': FiHeadphones,
};
function getCategoryIcon(slug) {
    return CATEGORY_ICONS[slug] ?? FiPackage;
}
const PARENT_ICONS = {
    laptop: PiLaptop,
    'laptop-group': PiLaptop,
    'phu-kien': FiHeadphones,
};
function getParentIcon(slug) {
    return PARENT_ICONS[slug] ?? FiPackage;
}
function buildMenuItems(categories) {
    const items = [
        { id: 'all', name: 'Tất cả sản phẩm', to: '/cua-hang', Icon: FiGrid, isChild: false },
    ];
    categories.forEach((parent) => {
        items.push({
            id: `parent-${parent.id}`,
            name: parent.name,
            to: `/cua-hang?group=${parent.slug}`,
            Icon: getParentIcon(parent.slug),
            isChild: false,
            isParentGroup: true,
        });
        (parent.children ?? []).forEach((child) => {
            items.push({
                id: child.id,
                name: child.name,
                to: `/cua-hang?category=${child.slug}`,
                Icon: getCategoryIcon(child.slug),
                isChild: true,
            });
        });
    });
    return items;
}
function StoreCategoryMenu() {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const isStorePage = location.pathname === '/cua-hang';
    useEffect(() => {
        getCategories()
            .then((res) => setCategories(res.categories ?? []))
            .catch(() => setCategories([]));
    }, []);
    const menuItems = buildMenuItems(categories);
    const {
        storeCategoryWrap,
        storeCategoryTrigger,
        storeCategoryTriggerOpen,
        storeCategoryDropdown,
        storeCategoryDropdownOpen,
        storeCategoryItem,
        storeCategoryIcon,
        storeCategoryChevron,
        storeCategoryChevronDown,
        storeCategoryTriggerLabel,
    } = styles;
    return (
        <div
            className={storeCategoryWrap}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link
                to="/cua-hang"
                className={classNames(storeCategoryTrigger, {
                    [storeCategoryTriggerOpen]: open || isStorePage,
                })}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                <span className={storeCategoryTriggerLabel}>
                    Cửa hàng
                    <FiChevronDown className={storeCategoryChevronDown} aria-hidden />
                </span>
            </Link>
            <div
                className={classNames(storeCategoryDropdown, {
                    [storeCategoryDropdownOpen]: open,
                })}
                role="menu"
                aria-hidden={!open}
            >
                {menuItems.map(({ id, name, to, Icon, isChild, isParentGroup }) => (
                        <Link
                            key={id}
                            to={to}
                            className={classNames(storeCategoryItem, {
                                [styles.storeCategoryItemChild]: isChild,
                                [styles.storeCategoryItemParent]: isParentGroup,
                            })}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                        >
                            <Icon className={storeCategoryIcon} aria-hidden />
                            <span>{name}</span>
                            <FiChevronRight className={storeCategoryChevron} aria-hidden />
                        </Link>
                ))}
            </div>
        </div>
    );
}
export default StoreCategoryMenu;


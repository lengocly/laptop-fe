import cartIcon from '@icons/svgs/cartIcon.svg';
import heartIcon from '@icons/svgs/heartIcon.svg';
import reloadIcon from '@icons/svgs/reloadIcon.svg';
const QUICK_ACTIONS = [
    {
        id: 'addToCart',
        label: 'Thêm vào giỏ',
        icon: cartIcon,
    },
    {
        id: 'wishlist',
        label: 'Yêu thích',
        icon: heartIcon,
    },
    {
        id: 'compare',
        label: 'So sánh',
        icon: reloadIcon,
    },
];
export default QUICK_ACTIONS;


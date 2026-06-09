import { useContext } from 'react';
import { CiHeart } from 'react-icons/ci';
import HeaderSideBar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import { WishlistContext } from '@/contexts/WishlistProvider';
import styles from './styles.module.scss';

function Wishlist() {
    const { items, removeFromWishlist, count } = useContext(WishlistContext);
    const { container, empty } = styles;

    const title =
        count > 0 ? `YÊU THÍCH (${count})` : 'YÊU THÍCH';

    return (
        <div className={container}>
            <HeaderSideBar
                icon={<CiHeart style={{ fontSize: '30px' }} />}
                title={title}
            />

            {items.length === 0 ? (
                <p className={empty}>Chưa có sản phẩm yêu thích</p>
            ) : (
                items.map((item) => (
                    <ItemProduct
                        key={item.productId}
                        item={item}
                        onRemove={() => removeFromWishlist(item.productId)}
                    />
                ))
            )}
        </div>
    );
}

export default Wishlist;

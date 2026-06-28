import { useContext } from 'react';
import { PiShoppingCart } from 'react-icons/pi';
import HeaderSideBar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import { CartContext } from '@/contexts/CartProvider';
import { formatVnd } from '@/utils/price';
import CartItem from './CartItem';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
function Cart() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useContext(AuthContext);
    const { setIsOpen } = useContext(SideBarContext);
    const { items, removeItem, updateQuantity, subtotal, clearCart } =
        useContext(CartContext);
    const { container, empty, summary, totalRow, checkoutBtn, clearBtn } = styles;
    const handleCheckout = () => {
        if (items.length === 0) return;
        setIsOpen(false);
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/checkout');
            return;
        }
        navigate('/checkout');
    };
    return (
        <div className={container}>
            <HeaderSideBar
                icon={<PiShoppingCart style={{ fontSize: '30px' }} />}
                title="GIỎ HÀNG"
            />
            {items.length === 0 ? (
                <p className={empty}>Giỏ hàng trống</p>
            ) : (
                <>
                    {items.map((item) => (
                        <CartItem
                            key={item.key}
                            item={item}
                            onRemove={removeItem}
                            onUpdateQty={updateQuantity}
                        />
                    ))}
                    <div className={summary}>
                        <div className={totalRow}>
                            <span>Tạm tính</span>
                            <strong>{formatVnd(subtotal)}</strong>
                        </div>
                        <button type="button" className={checkoutBtn} onClick={handleCheckout}>
                            Tiến hành thanh toán
                        </button>
                        <button
                            type="button"
                            className={clearBtn}
                            onClick={clearCart}
                        >
                            Xóa giỏ
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
export default Cart;
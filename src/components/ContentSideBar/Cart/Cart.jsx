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
    const navigate = useNavigate(); //chuyển trang ng dùng qua thanh toán
    const { isAuthenticated, loading } = useContext(AuthContext); //kiểm tra đăng nhập
    const { setIsOpen } = useContext(SideBarContext); //đóng sidebar giỏ hàng

    // ===== lõi giỏ hàng =====
    const { items, removeItem, updateQuantity, subtotal, clearCart } =
        useContext(CartContext);
    const { container, empty, summary, totalRow, checkoutBtn, clearBtn } = styles;


    // ===== lõi thanh toán =====
    const handleCheckout = () => {
        if (items.length === 0) return; //Nếu giỏ hàng không có sản phẩm thì không làm gì cả
        setIsOpen(false); // đóng sidebar
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
                            onRemove={removeItem} //lõi xoá
                            onUpdateQty={updateQuantity}
                        />
                    ))}

                    <div className={summary}>
                        <div className={totalRow}>
                            <span>Tạm tính</span>
                            <strong>{formatVnd(subtotal)}</strong>
                        </div>
                        {/* // Nút: Tiến hành thanh toán */}
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
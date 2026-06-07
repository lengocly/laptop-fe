import { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import { parsePriceNumber } from '@/utils/price';
import { AuthContext } from '@/contexts/AuthProvider';

//CartContext — Tạo “ống” để component khác bơm vào / hút ra giỏ hàng
export const CartContext = createContext();

// key giỏ hàng khách
const CART_GUEST_KEY = 'betatech_cart_guest';

// key giỏ hàng user
const cartKeyForUser = (userId) => `betatech_cart_user_${userId}`;

// hàm lấy giỏ hàng từ key
function loadCartFromKey(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Tạo key từng dòng giỏ hàng: cùng SP + cùng biến thể = 1 dòng
function lineKey(productId, variantId) {
    return `${productId}-${variantId ?? 'base'}`;
}

//Hàm này dùng để lấy giỏ hàng đã lưu trong trình duyệt.
function loadCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

//CartProvider là component bọc toàn app, component bên trong <App /> đều có thể dùng giỏ hàng
export function CartProvider({ children }) {

    // lấy user từ AuthContext
    const { user, loading: authLoading } = useContext(AuthContext);
    // lưu user id trước đó
    const prevUserIdRef = useRef(undefined);
    // lấy key giỏ hàng từ user id
    const storageKey = user?.id ? cartKeyForUser(user.id) : CART_GUEST_KEY;


    //items: là danh sách sản phẩm trong giỏ hàng.
    const [items, setItems] = useState([]);

    //Khi items thay đổi, lưu lại vào localStorage.
    //(Ví dụ bạn thêm sản phẩm, xóa sản phẩm, đổi số lượng, nó sẽ tự lưu lại vào trình duyệt)
    // Login / logout → đổi giỏ
    useEffect(() => {
        if (authLoading) return;
        const currentUserId = user?.id ?? null;
        const prevUserId = prevUserIdRef.current;
        // Lần đầu mở app
        if (prevUserId === undefined) {
            setItems(loadCartFromKey(storageKey));
            prevUserIdRef.current = currentUserId;
            return;
        }
        // Vừa logout
        if (prevUserId !== null && currentUserId === null) {
            setItems([]);
            localStorage.setItem(CART_GUEST_KEY, JSON.stringify([]));
            prevUserIdRef.current = null;
            return;
        }
        // Vừa login (hoặc đổi user)
        if (currentUserId !== prevUserId) {
            setItems(loadCartFromKey(cartKeyForUser(currentUserId)));
            prevUserIdRef.current = currentUserId;
        }
    }, [user?.id, authLoading, storageKey]);
    // Lưu giỏ theo key hiện tại
    useEffect(() => {
        if (authLoading) return;
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey, authLoading]);

    //Hàm này dùng để thêm sản phẩm vào giỏ hàng.
    //payload: là đối tượng chứa thông tin sản phẩm.
    const addToCart = (payload) => {
        const {
            productId,
            variantId = null,
            name,
            optionLabel = '',
            price,
            priceOriginal = null,
            image,
            quantity = 1,
            maxStock = 99,
        } = payload;

        //Tạo key từng dòng giỏ hàng: cùng SP + cùng biến thể = 1 dòng
        const key = lineKey(productId, variantId);

        //Số lượng tối thiểu là 1, tối đa là số lượng tồn kho.
        const addQty = Math.max(1, quantity);

        //Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa, nếu có thì cộng số lượng, nếu không thì thêm mới.
        //prev là giỏ hàng hiện tại trước khi cập nhật.
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.key === key);
            if (idx >= 0) {
                const next = [...prev]; //Tạo mảng mới, không sửa trực tiếp mảng cũ

                //Tính số lượng mới nhưng không được vượt quá tồn kho
                const newQty = Math.min(
                    next[idx].quantity + addQty,
                    next[idx].maxStock
                );
                //Cập nhật lại sản phẩm đó với số lượng mới
                next[idx] = { ...next[idx], quantity: newQty };
                return next;
            }
            //Nếu sản phẩm chưa có trong giỏ hàng, thì thêm mới.
            return [
                //giữ lại toàn bộ sản phẩm cũ.
                ...prev, 
                //Sau đó thêm sản phẩm mới
                {
                    key,
                    productId,
                    variantId,
                    name,
                    optionLabel,
                    price,
                    priceNumber: parsePriceNumber(price),
                    priceOriginal: priceOriginal || null,
                    priceOriginalNumber: priceOriginal
                        ? parsePriceNumber(priceOriginal)
                        : 0,
                    image,
                    quantity: Math.min(addQty, maxStock),
                    maxStock,
                },
            ];
        });
    };

    //Hàm này dùng để xóa sản phẩm khỏi giỏ hàng.
    //key: là key từng dòng giỏ hàng. (lõi xoá)
    const removeItem = (key) => {
        setItems((prev) => prev.filter((i) => i.key !== key)); //Lọc ra mảng mới, không chứa sản phẩm có key trùng với key cần xóa.
    };

    //Hàm updateQuantity cập nhật số lượng
    const updateQuantity = (key, quantity) => {
        setItems((prev) =>
            prev.map((i) =>
                i.key === key
                    ? {
                          ...i,
                          quantity: Math.max(
                              1,
                              Math.min(quantity, i.maxStock)
                          ),
                        //   Số lượng nhỏ nhất là 1, Số lượng lớn nhất là maxStock
                      }
                    : i
            )
        );
    };

    //Hàm clearCart xóa toàn bộ giỏ hàng
    const clearCart = () => setItems([]);

    //Tính tổng số lượng sản phẩm
    const totalCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );

    //tổng tiền tạm tính
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.priceNumber * i.quantity, 0),
        [items]
    );

    //Gom tất cả dữ liệu và hàm vào value
    const value = {
        items, 
        addToCart, 
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}
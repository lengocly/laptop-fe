import { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import { parsePriceNumber } from '@/utils/price';
import { AuthContext } from '@/contexts/AuthProvider';
export const CartContext = createContext();
const CART_GUEST_KEY = 'betatech_cart_guest';
const cartKeyForUser = (userId) => `betatech_cart_user_${userId}`;
function loadCartFromKey(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
function lineKey(productId, variantId) {
    return `${productId}-${variantId ?? 'base'}`;
}
function mergeCarts(guestCart, userCart) {
    const map = new Map();
    for (const item of userCart) {
        map.set(item.key, { ...item });
    }
    for (const item of guestCart) {
        if (map.has(item.key)) {
            const existing = map.get(item.key);
            map.set(item.key, {
                ...existing,
                quantity: Math.min(
                    existing.quantity + item.quantity,
                    existing.maxStock
                ),
            });
        } else {
            map.set(item.key, { ...item });
        }
    }
    return Array.from(map.values());
}
export function CartProvider({ children }) {
    const { user, loading: authLoading } = useContext(AuthContext);
    const prevUserIdRef = useRef(undefined);
    const isHydratingRef = useRef(true);
    const storageKey = user?.id ? cartKeyForUser(user.id) : CART_GUEST_KEY;
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (authLoading) return;
        const currentUserId = user?.id ?? null;
        const prevUserId = prevUserIdRef.current;
        if (prevUserId === undefined) {
            setItems(loadCartFromKey(storageKey));
            prevUserIdRef.current = currentUserId;
            isHydratingRef.current = true;
            return;
        }
        if (prevUserId !== null && currentUserId === null) {
            setItems([]);
            localStorage.setItem(CART_GUEST_KEY, JSON.stringify([]));
            prevUserIdRef.current = null;
            isHydratingRef.current = true;
            return;
        }
        if (currentUserId !== prevUserId) {
            const guestCart = loadCartFromKey(CART_GUEST_KEY);
            const userCart = loadCartFromKey(cartKeyForUser(currentUserId));
            const merged = mergeCarts(guestCart, userCart);
            setItems(merged);
            localStorage.setItem(
                cartKeyForUser(currentUserId),
                JSON.stringify(merged)
            );
            localStorage.setItem(CART_GUEST_KEY, JSON.stringify([]));
            prevUserIdRef.current = currentUserId;
            isHydratingRef.current = true;
        }
    }, [user?.id, authLoading, storageKey]);
    useEffect(() => {
        if (authLoading) return;
        if (isHydratingRef.current) {
            isHydratingRef.current = false;
            return;
        }
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey, authLoading]);
    const addToCart = (payload) => {
        const {
            productId,
            variantId = null,
            hasVariants = false,
            name,
            optionLabel = '',
            price,
            priceOriginal = null,
            image,
            quantity = 1,
            maxStock = 99,
        } = payload;
        if (hasVariants && !variantId) {
            return false;
        }
        const key = lineKey(productId, variantId);
        const addQty = Math.max(1, quantity);
        setItems((prev) => {
            const idx = prev.findIndex((i) => i.key === key);
            if (idx >= 0) {
                const next = [...prev];
                const newQty = Math.min(
                    next[idx].quantity + addQty,
                    next[idx].maxStock
                );
                next[idx] = { ...next[idx], quantity: newQty };
                return next;
            }
            return [
                ...prev,
                {
                    key,
                    productId,
                    variantId,
                    hasVariants,
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
        return true;
    };
    const removeItem = (key) => {
        setItems((prev) => prev.filter((i) => i.key !== key));
    };
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
                      }
                    : i
            )
        );
    };
    const clearCart = () => setItems([]);
    const totalCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.priceNumber * i.quantity, 0),
        [items]
    );
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
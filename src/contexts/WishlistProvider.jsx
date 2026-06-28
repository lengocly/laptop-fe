import {
    createContext,
    useState,
    useEffect,
    useMemo,
    useContext,
    useRef,
    useCallback,
} from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
export const WishlistContext = createContext();
const WISHLIST_GUEST_KEY = 'betatech_wishlist_guest';
const wishlistKeyForUser = (userId) => `betatech_wishlist_user_${userId}`;
function loadWishlistFromKey(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
export function WishlistProvider({ children }) {
    const { user, loading: authLoading } = useContext(AuthContext);
    const prevUserIdRef = useRef(undefined);
    const storageKey = user?.id
        ? wishlistKeyForUser(user.id)
        : WISHLIST_GUEST_KEY;
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (authLoading) return;
        const currentUserId = user?.id ?? null;
        const prevUserId = prevUserIdRef.current;
        if (prevUserId === undefined) {
            setItems(loadWishlistFromKey(storageKey));
            prevUserIdRef.current = currentUserId;
            return;
        }
        if (prevUserId !== null && currentUserId === null) {
            setItems([]);
            localStorage.setItem(WISHLIST_GUEST_KEY, JSON.stringify([]));
            prevUserIdRef.current = null;
            return;
        }
        if (currentUserId !== prevUserId) {
            setItems(loadWishlistFromKey(wishlistKeyForUser(currentUserId)));
            prevUserIdRef.current = currentUserId;
        }
    }, [user?.id, authLoading, storageKey]);
    useEffect(() => {
        if (authLoading) return;
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey, authLoading]);
    const isInWishlist = useCallback(
        (productId) => items.some((i) => i.productId === productId),
        [items]
    );
    const addToWishlist = useCallback((payload) => {
        const { productId, name, price, priceOriginal = null, image } = payload;
        if (productId == null) return;
        setItems((prev) => {
            if (prev.some((i) => i.productId === productId)) return prev;
            return [
                ...prev,
                { productId, name, price, priceOriginal, image },
            ];
        });
    }, []);
    const removeFromWishlist = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }, []);
    const toggleWishlist = useCallback((payload) => {
        const { productId, name, price, priceOriginal = null, image } = payload;
        if (productId == null) return false;
        const exists = items.some((i) => i.productId === productId);
        if (exists) {
            setItems((prev) => prev.filter((i) => i.productId !== productId));
            return false;
        }
        setItems((prev) => [...prev, { productId, name, price, priceOriginal, image }]);
        return true;
    }, [items]);
    const count = useMemo(() => items.length, [items]);
    const value = {
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        count,
    };
    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}


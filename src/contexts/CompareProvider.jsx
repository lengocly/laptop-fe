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

export const CompareContext = createContext();

const COMPARE_GUEST_KEY = 'betatech_compare_guest';
const compareKeyForUser = (userId) => `betatech_compare_user_${userId}`;
export const MAX_COMPARE_ITEMS = 4;

function loadCompareFromKey(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function CompareProvider({ children }) {
    const { user, loading: authLoading } = useContext(AuthContext);
    const prevUserIdRef = useRef(undefined);
    const storageKey = user?.id
        ? compareKeyForUser(user.id)
        : COMPARE_GUEST_KEY;

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (authLoading) return;
        const currentUserId = user?.id ?? null;
        const prevUserId = prevUserIdRef.current;

        if (prevUserId === undefined) {
            setItems(loadCompareFromKey(storageKey));
            prevUserIdRef.current = currentUserId;
            return;
        }
        if (prevUserId !== null && currentUserId === null) {
            setItems([]);
            localStorage.setItem(COMPARE_GUEST_KEY, JSON.stringify([]));
            prevUserIdRef.current = null;
            return;
        }
        if (currentUserId !== prevUserId) {
            setItems(loadCompareFromKey(compareKeyForUser(currentUserId)));
            prevUserIdRef.current = currentUserId;
        }
    }, [user?.id, authLoading, storageKey]);

    useEffect(() => {
        if (authLoading) return;
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey, authLoading]);

    const isInCompare = useCallback(
        (productId) => items.some((i) => i.productId === productId),
        [items]
    );

    const addToCompare = useCallback((payload) => {
        const {
            productId,
            name,
            price,
            priceOriginal = null,
            image,
            cpu = null,
            ram = null,
            storage = null,
        } = payload;

        if (productId == null) {
            return { ok: false, message: 'Sản phẩm không hợp lệ.' };
        }

        // Tính kết quả trước setItems — callback chạy sau nên return trong đó không kịp
        if (items.some((i) => i.productId === productId)) {
            return {
                ok: true,
                message: 'Sản phẩm đã có trong danh sách so sánh.',
            };
        }

        if (items.length >= MAX_COMPARE_ITEMS) {
            return {
                ok: false,
                message: `Bạn chỉ có thể so sánh tối đa ${MAX_COMPARE_ITEMS} sản phẩm.`,
            };
        }

        setItems((prev) => [
            ...prev,
            {
                productId,
                name,
                price,
                priceOriginal,
                image,
                cpu,
                ram,
                storage,
            },
        ]);

        return { ok: true, message: 'Đã thêm vào danh sách so sánh.' };
    }, [items]);

    const removeFromCompare = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }, []);

    const clearCompare = useCallback(() => setItems([]), []);

    const count = useMemo(() => items.length, [items]);

    const value = {
        items,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        count,
        maxItems: MAX_COMPARE_ITEMS,
    };

    return (
        <CompareContext.Provider value={value}>
            {children}
        </CompareContext.Provider>
    );
}

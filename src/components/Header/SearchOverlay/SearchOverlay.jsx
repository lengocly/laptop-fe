/**
 * SearchOverlay — lớp phủ tìm kiếm toàn màn hình (giống ecochic.vn).
 * - Mở từ menu "Tìm kiếm" trên Header
 * - Gõ tên SP → lọc client-side → bấm vào kết quả → /product/:id
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { TfiClose } from 'react-icons/tfi';
import { getProducts } from '@/apis/productsService';
import { formatVnd, parsePriceNumber } from '@/utils/price';
import styles from './styles.module.scss';

const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&h=160&q=80';

const POPULAR_LIMIT = 8;
const SEARCH_RESULT_LIMIT = 12;

// Cache danh sách SP — tránh gọi API lại mỗi lần mở overlay
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 phút — đủ mới mà không spam API
let productsCache = null;
let productsCachePromise = null;
let productsCacheTime = 0;

function invalidateProductsCache() {
    productsCache = null;
    productsCachePromise = null;
    productsCacheTime = 0;
}

async function loadProductsCached(forceRefresh = false) {
    const cacheExpired = Date.now() - productsCacheTime > CACHE_TTL_MS;
    if (!forceRefresh && productsCache && !cacheExpired) return productsCache;

    if (forceRefresh || cacheExpired) {
        invalidateProductsCache();
    }

    if (!productsCachePromise) {
        productsCachePromise = getProducts()
            .then((res) => {
                productsCache = res.contents ?? [];
                productsCacheTime = Date.now();
                return productsCache;
            })
            .catch(() => {
                productsCachePromise = null;
                return [];
            });
    }

    return productsCachePromise;
}

// Bỏ dấu tiếng Việt để so khớp dễ hơn (vd: "san pham" khớp "sản phẩm")
function normalizeSearchText(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function matchProductByName(product, query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return true;
    return normalizeSearchText(product.name).includes(normalizedQuery);
}

function SearchResultCard({ product, onNavigate }) {
    const imageSrc = product.images?.[0] || IMG_FALLBACK;
    const priceText = formatVnd(parsePriceNumber(product.price));

    return (
        <Link
            to={`/product/${product.id}`}
            className={styles.resultCard}
            onClick={onNavigate}
        >
            <img
                src={imageSrc}
                alt={product.name || ''}
                className={styles.resultImage}
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.src = IMG_FALLBACK;
                }}
            />
            <div className={styles.resultInfo}>
                <span className={styles.resultName}>{product.name}</span>
                <span className={styles.resultPrice}>{priceText}</span>
            </div>
        </Link>
    );
}

function SearchOverlay({ isOpen, onClose }) {
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const trimmedQuery = query.trim();
    const isSearching = trimmedQuery.length > 0;

    const filteredProducts = useMemo(() => {
        if (!isSearching) return products.slice(0, POPULAR_LIMIT);
        return products
            .filter((item) => matchProductByName(item, trimmedQuery))
            .slice(0, SEARCH_RESULT_LIMIT);
    }, [products, trimmedQuery, isSearching]);

    const handleNavigate = useCallback(() => {
        onClose();
    }, [onClose]);

    // Tải SP khi overlay mở
    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        setError('');

        // Làm mới cache khi mở — SP mới/thay đổi giá vẫn hiện đúng
        loadProductsCached(true)
            .then((list) => setProducts(list))
            .catch(() => {
                setProducts([]);
                setError('Không tải được sản phẩm. Vui lòng thử lại.');
            })
            .finally(() => setLoading(false));
    }, [isOpen]);

    // Khóa scroll body khi overlay đang mở
    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    // ESC để đóng
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Reset ô tìm kiếm + focus khi mở
    useEffect(() => {
        if (!isOpen) return;

        setQuery('');
        const timer = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 80);

        return () => window.clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className={styles.backdrop}
            onClick={onClose}
            role="presentation"
        >
            <div
                className={styles.panel}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Tìm kiếm sản phẩm"
            >
                <div className={styles.searchBar}>
                    <FiSearch className={styles.searchIcon} aria-hidden />
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm kiếm..."
                        className={styles.searchInput}
                        aria-label="Tìm kiếm sản phẩm"
                    />
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Đóng tìm kiếm"
                    >
                        <TfiClose />
                    </button>
                </div>

                <div className={styles.resultsWrap}>
                    {!isSearching && (
                        <p className={styles.sectionHint}>
                            Gợi ý: thử tìm theo tên laptop, chuột, bàn phím…
                        </p>
                    )}

                    {loading && <p className={styles.statusText}>Đang tải sản phẩm…</p>}
                    {error && <p className={styles.errorText}>{error}</p>}

                    {!loading && !error && isSearching && filteredProducts.length === 0 && (
                        <p className={styles.emptyText}>Không tìm thấy sản phẩm</p>
                    )}

                    {!loading && !error && filteredProducts.length > 0 && (
                        <>
                            <h3 className={styles.sectionTitle}>
                                {isSearching
                                    ? `Kết quả (${filteredProducts.length})`
                                    : 'Sản phẩm nổi bật'}
                            </h3>
                            <div className={styles.resultsGrid}>
                                {filteredProducts.map((product) => (
                                    <SearchResultCard
                                        key={product.id}
                                        product={product}
                                        onNavigate={handleNavigate}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default SearchOverlay;

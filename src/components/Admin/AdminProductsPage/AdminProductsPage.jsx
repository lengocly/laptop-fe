import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getFlatChildCategories } from '@/apis/categoriesService';
import {
    getAdminProducts,
    deleteProduct,
} from '@/apis/adminOrderService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';
const API_ORIGIN = (
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace('/api/v1', '');
function productImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_ORIGIN}/storage/${path}`;
}
function getPageNumbers(current, last) {
    if (last <= 1) return last === 1 ? [1] : [];
    const pages = [];
    let start = Math.max(1, current - 2);
    let end = Math.min(last, current + 2);
    if (end - start < 4) {
        if (start === 1) end = Math.min(last, start + 4);
        else if (end === last) start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
}
function getTotalStock(product) {
    const variants = product.all_variants || product.allVariants || [];
    if (variants.length > 0) {
        return variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    }
    return Number(product.stock || 0);
}
function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        getFlatChildCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);
    const loadProducts = async () => {
        try {
            const params = { page, per_page: perPage };
            if (keyword.trim()) params.keyword = keyword.trim();
            if (categoryId) params.category_id = categoryId;
            if (activeFilter === '1') params.is_active = true;
            if (activeFilter === '0') params.is_active = false;
            const { data } = await getAdminProducts(params);
            const items = data.data || [];
            const last = data.last_page || 1;
            if (items.length === 0 && page > 1 && page > last) {
                setPage(last);
                return;
            }
            setProducts(items);
            setTotalPages(last);
            setTotal(data.total || 0);
            setError('');
        } catch {
            setError('Không tải được danh sách sản phẩm. Kiểm tra đăng nhập admin.');
        }
    };
    useEffect(() => {
        loadProducts();
    }, [page, keyword, categoryId, activeFilter]);
    const handleDelete = async (product) => {
        const ok = window.confirm(
            `Bạn chắc chắn muốn xóa "${product.name}"?`
        );
        if (!ok) return;
        try {
            await deleteProduct(product.id);
            setToast('Đã xóa sản phẩm.');
            setError('');
            await loadProducts();
        } catch {
            setError('Không xóa được sản phẩm.');
        }
    };
    return (
        <AdminRoute>
            <AdminLayout title="Quản lý sản phẩm">
                {error && <p className={styles.err}>{error}</p>}
                <div className={styles.toolbar}>
                    <input
                        placeholder="Tìm tên, slug..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.parent_name
                                    ? `${c.name} (${c.parent_name})`
                                    : c.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={activeFilter}
                        onChange={(e) => {
                            setActiveFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Ẩn</option>
                    </select>
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => navigate('/admin/san-pham/tao')}
                    >
                        + Thêm sản phẩm
                    </button>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Kho</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.empty}>
                                        Chưa có sản phẩm.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                className={styles.thumb}
                                                src={productImageUrl(product.image_main)}
                                                alt={product.name}
                                            />
                                        </td>
                                        <td>
                                            <strong>{product.name}</strong>
                                            <br />
                                            <small>{product.slug}</small>
                                        </td>
                                        <td>{product.category?.name || '—'}</td>
                                        <td>{formatVnd(product.price_display)}</td>
                                        <td>{getTotalStock(product)}</td>
                                        <td>
                                            <span
                                                className={
                                                    product.is_active
                                                        ? styles.badgeActive
                                                        : styles.badgeInactive
                                                }
                                            >
                                                {product.is_active ? 'Hoạt động' : 'Ẩn'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                type="button"
                                                className={styles.iconBtn}
                                                title="Sửa sản phẩm"
                                                onClick={() =>
                                                    navigate(`/admin/san-pham/${product.id}`)
                                                }
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.iconBtn} ${styles.dangerBtn}`}
                                                title="Xóa sản phẩm"
                                                onClick={() => handleDelete(product)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <span className={styles.paginationInfo}>
                            {total} sản phẩm · Trang {page}/{totalPages}
                        </span>
                        <div className={styles.paginationControls}>
                            <button
                                type="button"
                                className={styles.pageBtn}
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                                aria-label="Trang trước"
                            >
                                ‹
                            </button>
                            {getPageNumbers(page, totalPages).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={
                                        n === page
                                            ? `${styles.pageBtn} ${styles.pageBtnActive}`
                                            : styles.pageBtn
                                    }
                                    onClick={() => setPage(n)}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={styles.pageBtn}
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                aria-label="Trang sau"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
                {toast && <p className={styles.toast}>{toast}</p>}
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminProductsPage;
/**
 * AdminProductsPage — Trang danh sách sản phẩm (Phase 2 - Read + Delete)
 *
 * Luồng:
 * 1. Vào trang → gọi GET /admin/products (Phase 1 backend)
 * 2. Hiện bảng: ảnh, tên, danh mục, giá, kho, trạng thái
 * 3. Tìm / lọc → gửi params lên API (keyword, category_id, is_active)
 * 4. Sửa → chuyển /admin/san-pham/:id
 * 5. Xóa → DELETE /admin/products/:id
 * 6. Thêm → chuyển /admin/san-pham/tao
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import axiosClient from '@/apis/axiosClient';
import {
    getAdminProducts,
    deleteProduct,
} from '@/apis/adminOrderService'; // API SP bạn đặt chung file này
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';

// Địa chỉ gốc Laravel để ghép ảnh (BE trả path: products/xxx.jpg)
const API_ORIGIN = (
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace('/api/v1', '');

// path trong DB → URL đầy đủ hiển thị <img>
function productImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_ORIGIN}/storage/${path}`;
}

// Tổng kho: ưu tiên cộng stock các biến thể, không có thì dùng stock SP cha
function getTotalStock(product) {
    const variants = product.all_variants || product.allVariants || [];
    if (variants.length > 0) {
        return variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    }
    return Number(product.stock || 0);
}

function AdminProductsPage() {
    const navigate = useNavigate();

    // --- STATE ---
    const [products, setProducts] = useState([]);       // mảng SP từ API
    const [categories, setCategories] = useState([]);   // dropdown danh mục
    const [keyword, setKeyword] = useState('');         // ô tìm tên/slug
    const [categoryId, setCategoryId] = useState('');   // lọc danh mục
    const [activeFilter, setActiveFilter] = useState(''); // '' | '1' | '0'
    const [error, setError] = useState('');             // lỗi đỏ
    const [toast, setToast] = useState('');             // thông báo xanh

    // --- TẢI DANH MỤC (API công khai /categories) ---
    useEffect(() => {
        axiosClient
            .get('/categories')
            .then(({ data }) => {
                const flat = [];
                // data.categories = cha + children (giống StorePage)
                (data.categories || []).forEach((parent) => {
                    (parent.children || []).forEach((child) => {
                        flat.push({
                            id: child.id,
                            name: child.name,
                            slug: child.slug,
                        });
                    });
                });
                setCategories(flat);
            })
            .catch(() => {});
    }, []);

    // --- TẢI DANH SÁCH SP (gọi Phase 1: AdminProductController@index) ---
    const loadProducts = async () => {
        try {
            const params = {};
            if (keyword.trim()) params.keyword = keyword.trim();
            if (categoryId) params.category_id = categoryId;
            // BE: is_active boolean — gửi true/false khi chọn lọc
            if (activeFilter === '1') params.is_active = true;
            if (activeFilter === '0') params.is_active = false;

            const { data } = await getAdminProducts(params);
            setProducts(data);
            setError('');
        } catch {
            setError('Không tải được danh sách sản phẩm. Kiểm tra đăng nhập admin.');
        }
    };

    // Mỗi khi đổi bộ lọc → gọi lại API
    useEffect(() => {
        loadProducts();
    }, [keyword, categoryId, activeFilter]);

    // --- XÓA SP (Phase 1: destroy) ---
    const handleDelete = async (product) => {
        const ok = window.confirm(
            `Bạn chắc chắn muốn xóa "${product.name}"?`
        );
        if (!ok) return;

        try {
            await deleteProduct(product.id);
            setToast('Đã xóa sản phẩm.');
            setError('');
            await loadProducts(); // tải lại bảng
        } catch {
            setError('Không xóa được sản phẩm.');
        }
    };

    return (
        <AdminRoute>
            {/* AdminRoute: chặn user thường, chỉ admin */}
            <AdminLayout title="Quản lý sản phẩm">

                {/* Thông báo lỗi */}
                {error && <p className={styles.err}>{error}</p>}

                {/* Thanh công cụ: tìm, lọc, nút thêm */}
                <div className={styles.toolbar}>
                    <input
                        placeholder="Tìm tên, slug..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
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

                {/* Bảng danh sách */}
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
                                        {/* Ảnh */}
                                        <td>
                                            <img
                                                className={styles.thumb}
                                                src={productImageUrl(product.image_main)}
                                                alt={product.name}
                                            />
                                        </td>

                                        {/* Tên */}
                                        <td>
                                            <strong>{product.name}</strong>
                                            <br />
                                            <small>{product.slug}</small>
                                        </td>

                                        {/* Danh mục */}
                                        <td>{product.category?.name || '—'}</td>

                                        {/* Giá — DB lưu chuỗi số */}
                                        <td>{formatVnd(product.price_display)}</td>

                                        {/* Kho */}
                                        <td>{getTotalStock(product)}</td>

                                        {/* Hiển thị / ẩn trên shop */}
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

                                        {/* Sửa + Xóa */}
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

                {/* Toast góc phải (sau khi xóa) */}
                {toast && <p className={styles.toast}>{toast}</p>}
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminProductsPage;
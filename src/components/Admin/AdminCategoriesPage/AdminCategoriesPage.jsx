import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import { getAdminCategories, deleteCategory } from '@/apis/adminCategoryService';
import { resolveImageUrl } from '@/utils/image';
import styles from './styles.module.scss';
function AdminCategoriesPage() {
    const navigate = useNavigate();
    const [flat, setFlat] = useState([]);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const load = async () => {
        try {
            const { data } = await getAdminCategories();
            setFlat(data.flat || []);
            setError('');
        } catch {
            setError('Không tải được danh mục.');
        }
    };
    useEffect(() => {
        load();
    }, []);
    useEffect(() => {
        if (!toast) return undefined;
        const t = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(t);
    }, [toast]);
    const handleDelete = async (cat) => {
        if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
        try {
            await deleteCategory(cat.id);
            setToast('Đã xóa danh mục.');
            await load();
        } catch (err) {
            setError(err.response?.data?.message || 'Không xóa được danh mục.');
        }
    };
    return (
        <AdminRoute>
            <AdminLayout
                title="Quản lý danh mục"
                subtitle="Nhóm cha (Laptop, Phụ kiện) và danh mục con (hãng, loại phụ kiện)"
            >
                {error && <p className={styles.err}>{error}</p>}
                <div className={styles.toolbar}>
                    <p className={styles.hint}>
                        <strong>Nhóm cha</strong> (Laptop, Phụ kiện) — hiện menu Cửa hàng, bấm vào xem
                        tất cả SP trong nhóm. <strong>Danh mục con</strong> — gán sản phẩm, hiện trang
                        chủ nếu bật &quot;Trang chủ&quot;.
                    </p>
                    <Link to="/admin/danh-muc/tao" className={styles.addBtn}>
                        + Thêm danh mục
                    </Link>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Slug (URL)</th>
                                <th>Nhóm cha</th>
                                <th>Ảnh</th>
                                <th>Trang chủ</th>
                                <th>SP</th>
                                <th>Thứ tự</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flat.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className={styles.empty}>
                                        Chưa có danh mục.
                                    </td>
                                </tr>
                            ) : (
                                flat.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>
                                            <strong>{cat.name}</strong>
                                            {!cat.parent_id && (
                                                <span className={styles.parentTag}>Nhóm cha</span>
                                            )}
                                        </td>
                                        <td>
                                            <code>{cat.slug}</code>
                                        </td>
                                        <td>{cat.parent?.name || '—'}</td>
                                        <td className={styles.imageCell}>
                                            {cat.image ? (
                                                <img
                                                    src={resolveImageUrl(cat.image)}
                                                    alt=""
                                                    className={styles.thumb}
                                                />
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td>
                                            {cat.is_featured ? (
                                                <span className={styles.featuredYes}>Có</span>
                                            ) : (
                                                <span className={styles.featuredNo}>Ẩn</span>
                                            )}
                                        </td>
                                        <td>{cat.products_count ?? 0}</td>
                                        <td>{cat.sort_order ?? 0}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    type="button"
                                                    className={styles.editBtn}
                                                    onClick={() =>
                                                        navigate(`/admin/danh-muc/${cat.id}`)
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(cat)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {toast && <p className={styles.toast}>{toast}</p>}
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminCategoriesPage;


import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import {
    getAdminCategories,
    createCategory,
    updateCategory,
    uploadCategoryImage,
} from '@/apis/adminCategoryService';
import { resolveImageUrl } from '@/utils/image';
import styles from './styles.module.scss';
const emptyForm = {
    name: '',
    slug: '',
    parent_id: '',
    image: '',
    sort_order: '0',
    is_featured: true,
};
function AdminCategoryFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState(emptyForm);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        getAdminCategories()
            .then(({ data }) => {
                const parentList = (data.flat || []).filter((c) => !c.parent_id);
                setParents(parentList);
            })
            .catch(() => {});
    }, []);
    useEffect(() => {
        if (!isEdit) return;
        getAdminCategories()
            .then(({ data }) => {
                const cat = (data.flat || []).find((c) => String(c.id) === String(id));
                if (!cat) {
                    setError('Không tìm thấy danh mục.');
                    return;
                }
                setForm({
                    name: cat.name || '',
                    slug: cat.slug || '',
                    parent_id: cat.parent_id ? String(cat.parent_id) : '',
                    image: cat.image || '',
                    sort_order: String(cat.sort_order ?? 0),
                    is_featured: cat.is_featured !== false,
                });
                if (cat.image) {
                    setPreviewUrl(resolveImageUrl(cat.image));
                }
            })
            .catch(() => setError('Không tải được danh mục.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);
    const setField = (name, value) => {
        setForm((f) => ({ ...f, [name]: value }));
    };
    const handlePickImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const { data } = await uploadCategoryImage(file);
            setField('image', data.path);
            setPreviewUrl(data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload ảnh thất bại.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const body = {
            name: form.name.trim(),
            slug: form.slug.trim() || undefined,
            parent_id: form.parent_id ? Number(form.parent_id) : null,
            image: form.image.trim() || null,
            sort_order: Number(form.sort_order) || 0,
            is_featured: form.is_featured,
        };
        try {
            if (isEdit) {
                await updateCategory(id, body);
            } else {
                await createCategory(body);
            }
            navigate('/admin/danh-muc');
        } catch (err) {
            setError(err.response?.data?.message || 'Không lưu được danh mục.');
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <AdminRoute>
                <AdminLayout title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}>
                    <p>Đang tải…</p>
                </AdminLayout>
            </AdminRoute>
        );
    }
    return (
        <AdminRoute>
            <AdminLayout title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}>
                {error && <p className={styles.err}>{error}</p>}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>
                        Tên danh mục *
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            placeholder="VD: MSI, Miếng lót chuột"
                        />
                    </label>
                    <label>
                        Slug (URL) — để trống tự tạo từ tên
                        <input
                            value={form.slug}
                            onChange={(e) => setField('slug', e.target.value)}
                            placeholder="VD: msi, mieng-lot-chuot"
                        />
                        <span className={styles.fieldHint}>
                            Dùng trong URL: /cua-hang?category=<strong>slug</strong>
                        </span>
                    </label>
                    <label>
                        Nhóm cha
                        <select
                            value={form.parent_id}
                            onChange={(e) => setField('parent_id', e.target.value)}
                        >
                            <option value="">— Không (đây là nhóm cha) —</option>
                            {parents.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.slug})
                                </option>
                            ))}
                        </select>
                        <span className={styles.fieldHint}>
                            Hãng laptop / loại phụ kiện → chọn nhóm <strong>Laptop</strong> hoặc{' '}
                            <strong>Phụ kiện</strong>
                        </span>
                    </label>
                    <div className={styles.imageBlock}>
                        <span className={styles.imageLabel}>Ảnh icon danh mục</span>
                        <div className={styles.imageRow}>
                            <label className={styles.uploadBtn}>
                                {uploading ? 'Đang tải lên…' : 'Chọn ảnh từ máy'}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handlePickImage}
                                    disabled={uploading}
                                    hidden
                                />
                            </label>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt=""
                                    className={styles.preview}
                                />
                            )}
                        </div>
                        <span className={styles.fieldHint}>
                            JPG, PNG, WEBP — tối đa 5MB. Dùng cho icon tròn trang chủ và lọc
                            hãng.
                        </span>
                    </div>
                    <label className={styles.checkRow}>
                        <input
                            type="checkbox"
                            checked={form.is_featured}
                            onChange={(e) => setField('is_featured', e.target.checked)}
                        />
                        <span>
                            <strong>Hiện trên trang chủ</strong> (khối Danh mục nổi bật)
                        </span>
                    </label>
                    <span className={styles.fieldHint}>
                        Bỏ tick nếu không muốn danh mục này xuất hiện trang chủ (vẫn dùng được
                        trong Cửa hàng và gán sản phẩm).
                    </span>
                    <label>
                        Thứ tự hiển thị
                        <input
                            type="number"
                            min="0"
                            value={form.sort_order}
                            onChange={(e) => setField('sort_order', e.target.value)}
                        />
                        <span className={styles.fieldHint}>
                            Số nhỏ hơn = đứng trước trong menu và danh sách admin.{' '}
                            <strong>Không</strong> liên quan bật/tắt Danh mục nổi bật.
                        </span>
                    </label>
                    <div className={styles.actions}>
                        <button type="submit" className={styles.saveBtn} disabled={saving}>
                            {saving ? 'Đang lưu…' : 'Lưu danh mục'}
                        </button>
                        <Link to="/admin/danh-muc" className={styles.cancelBtn}>
                            Hủy
                        </Link>
                    </div>
                </form>
            </AdminLayout>
        </AdminRoute>
    );
}
export default AdminCategoryFormPage;
/**
 * AdminProductFormPage — Thêm / Sửa sản phẩm (Phase 2C)
 *
 * URL:
 *   /admin/san-pham/tao     → Thêm mới (POST)
 *   /admin/san-pham/:id     → Sửa (GET rồi PUT)
 *
 * API (Phase 1):
 *   GET    /admin/products/:id
 *   POST   /admin/products
 *   PUT    /admin/products/:id
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import axiosClient from '@/apis/axiosClient';
import {
    getAdminProduct,
    createProduct,
    updateProduct,
} from '@/apis/adminOrderService';
import styles from './styles.module.scss';
import { uploadProductImage } from '@/apis/adminOrderService';


// Form mặc định khi tạo mới
const emptyForm = {
    name: '',
    slug: '',
    category_id: '',
    price_display: '',
    price_original: '',
    stock: 0,
    cpu: '',
    ram: '',
    storage: '',
    screen: '',
    image_main: '',
    image_hover: '',
    is_active: true,
    variants: [],
};

// Biến thể trống khi bấm "+ Thêm biến thể"
const emptyVariant = {
    group_key: 'config',
    group_label: 'Cấu hình',
    option_label: '',
    sku: '',
    price_display: '',
    price_original: '',
    stock: 0,
    is_active: true,
};

function AdminProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Chỉ có id trên route /admin/san-pham/:id (không phải /tao)
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // --- Ảnh ---
const [previewMain, setPreviewMain] = useState('');
const [uploadingMain, setUploadingMain] = useState(false);

// --- Chọn ảnh chính ---
const handlePickMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    setError('');
    try {
        const { data } = await uploadProductImage(file);
        setField('image_main', data.path);
        setPreviewMain(data.url);
    } catch (err) {
        setError(err.response?.data?.message || 'Upload ảnh thất bại.');
    } finally {
        setUploadingMain(false);
        e.target.value = ''; // chọn lại cùng file được
    }
};

// --- Chọn ảnh hover ---
const [previewHover, setPreviewHover] = useState('');
const [uploadingHover, setUploadingHover] = useState(false);

// --- Chọn ảnh hover ---
const handlePickHoverImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHover(true);
    setError('');
    try {
        const { data } = await uploadProductImage(file);
        setField('image_hover', data.path);
        setPreviewHover(data.url);
    } catch (err) {
        setError(err.response?.data?.message || 'Upload ảnh hover thất bại.');
    } finally {
        setUploadingHover(false);
        e.target.value = '';
    }
};

    // --- Đổi 1 field trong form ---
    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // --- Tải danh mục cho dropdown ---
    useEffect(() => {
        axiosClient.get('/categories').then(({ data }) => {
            const flat = [];
            (data.categories || []).forEach((parent) => {
                (parent.children || []).forEach((child) => {
                    flat.push({ id: child.id, name: child.name });
                });
            });
            setCategories(flat);
        });
    }, []);

    // --- Sửa: tải SP từ API ---
    useEffect(() => {
        if (!isEdit) return;

        setLoading(true);
        getAdminProduct(id)
            .then(({ data }) => {
                setForm({
                    ...emptyForm,
                    ...data,
                    category_id: data.category_id ? String(data.category_id) : '',
                    // Laravel JSON: all_variants (snake_case)
                    variants: data.all_variants || [],
                });
                setError('');
            })
            .catch(() => {
                setError('Không tải được sản phẩm.');
            })
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    // --- Biến thể: thêm dòng ---
    const addVariant = () => {
        setForm((prev) => ({
            ...prev,
            variants: [...prev.variants, { ...emptyVariant }],
        }));
    };

    // --- Biến thể: xóa dòng ---
    const removeVariant = (index) => {
        setForm((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

    // --- Biến thể: sửa 1 ô ---
    const updateVariant = (index, key, value) => {
        setForm((prev) => {
            const variants = [...prev.variants];
            variants[index] = { ...variants[index], [key]: value };
            return { ...prev, variants };
        });
    };

    // --- Gửi form: POST hoặc PUT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        // Body khớp validate Phase 1 (AdminProductController)
        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim() || undefined,
            category_id: form.category_id ? Number(form.category_id) : null,
            price_display: String(form.price_display).replace(/\D/g, ''),
            price_original: form.price_original
                ? String(form.price_original).replace(/\D/g, '')
                : null,
            stock: Number(form.stock) || 0,
            cpu: form.cpu || null,
            ram: form.ram || null,
            storage: form.storage || null,
            screen: form.screen || null,
            image_main: form.image_main.trim(),
            image_hover: form.image_hover.trim() || null,
            is_active: Boolean(form.is_active),
            variants: form.variants.map((v, i) => ({
                group_key: v.group_key || 'config',
                group_label: v.group_label || 'Cấu hình',
                option_label: v.option_label,
                sku: v.sku || null,
                price_display: v.price_display
                    ? String(v.price_display).replace(/\D/g, '')
                    : null,
                price_original: v.price_original
                    ? String(v.price_original).replace(/\D/g, '')
                    : null,
                stock: Number(v.stock) || 0,
                sort_order: i,
                is_active: v.is_active !== false,
            })),
        };

        try {
            if (isEdit) {
                await updateProduct(id, payload);
            } else {
                await createProduct(payload);
            }
            navigate('/admin/san-pham');
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(' ')
                    : null) ||
                'Lưu sản phẩm thất bại. Kiểm tra các ô bắt buộc (*).';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminRoute>
                <AdminLayout title="Đang tải...">
                    <p>Đang tải sản phẩm...</p>
                </AdminLayout>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <AdminLayout title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}>
                <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => navigate('/admin/san-pham')}
                >
                    ← Quay lại danh sách
                </button>

                {error && <p className={styles.err}>{error}</p>}

                <form className={styles.formCard} onSubmit={handleSubmit}>
                    {/* ===== Thông tin cơ bản ===== */}
                    <section className={styles.section}>
                        <h3>Thông tin cơ bản</h3>
                        <div className={styles.grid}>
                            <label>
                                Tên sản phẩm *
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    placeholder="VD: Dell Inspiron 14"
                                />
                            </label>
                            <label>
                                Slug (để trống = tự tạo)
                                <input
                                    value={form.slug}
                                    onChange={(e) => setField('slug', e.target.value)}
                                    placeholder="dell-inspiron-14"
                                />
                            </label>
                            <label>
                                Danh mục
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setField('category_id', e.target.value)}
                                >
                                    <option value="">— Chọn danh mục —</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Trạng thái
                                <select
                                    value={form.is_active ? '1' : '0'}
                                    onChange={(e) =>
                                        setField('is_active', e.target.value === '1')
                                    }
                                >
                                    <option value="1">Hoạt động (hiện shop)</option>
                                    <option value="0">Ẩn</option>
                                </select>
                            </label>
                        </div>
                    </section>

                    {/* ===== Giá & kho ===== */}
                    <section className={styles.section}>
                        <h3>Giá & kho hàng</h3>
                        <div className={styles.grid}>
                            <label>
                                Giá bán (VNĐ) *
                                <input
                                    required
                                    value={form.price_display}
                                    onChange={(e) => setField('price_display', e.target.value)}
                                    placeholder="1.849.000"
                                />
                            </label>
                            <label>
                                Giá gốc (VNĐ)
                                <input
                                    value={form.price_original}
                                    onChange={(e) => setField('price_original', e.target.value)}
                                    placeholder="1.999.000"
                                />
                            </label>
                            <label>
                                Tồn kho (sản phẩm chính)
                                <input
                                    type="number"
                                    min={0}
                                    value={form.stock}
                                    onChange={(e) => setField('stock', e.target.value)}
                                />
                            </label>
                        </div>
                    </section>

                    {/* ===== Thông số laptop ===== */}
                    <section className={styles.section}>
                        <h3>Thông số (hiện trang chi tiết SP)</h3>
                        <div className={styles.grid}>
                            <label>
                                CPU
                                <input
                                    value={form.cpu}
                                    onChange={(e) => setField('cpu', e.target.value)}
                                />
                            </label>
                            <label>
                                RAM
                                <input
                                    value={form.ram}
                                    onChange={(e) => setField('ram', e.target.value)}
                                />
                            </label>
                            <label>
                                Ổ cứng
                                <input
                                    value={form.storage}
                                    onChange={(e) => setField('storage', e.target.value)}
                                />
                            </label>
                            <label>
                                Màn hình
                                <input
                                    value={form.screen}
                                    onChange={(e) => setField('screen', e.target.value)}
                                />
                            </label>
                        </div>
                    </section>

                    {/* ===== Ảnh (path trong storage) ===== */}
                    <section className={styles.section}>
                        <h3>Hình ảnh</h3>
                        <p className={styles.hint}>
                            Nhập đường dẫn trong thư mục storage (VD: products/asus1.png).
                            Copy từ sản phẩm cũ hoặc upload file sau (Phase 4).
                        </p>
                        <div className={styles.grid}>
                        <label>
                            Ảnh chính *
                            <input type="file" accept="image/*" onChange={handlePickMainImage} />
                            {uploadingMain && <small>Đang tải ảnh lên...</small>}
                            {previewMain && (
                                <img src={previewMain} alt="Preview" className={styles.preview} />
                            )}
                            <input
                                value={form.image_main}
                                onChange={(e) => setField('image_main', e.target.value)}
                                placeholder="Tự điền sau upload hoặc gõ tay"
                            />
                        </label>
                        <label>
                            Ảnh hover (tuỳ chọn)
                            <input type="file" accept="image/*" onChange={handlePickHoverImage} />
                            {uploadingHover && <small>Đang tải ảnh lên...</small>}
                            {previewHover && (
                                <img src={previewHover} alt="Preview hover" className={styles.preview} />
                            )}
                            <input
                                value={form.image_hover}
                                onChange={(e) => setField('image_hover', e.target.value)}
                                placeholder="Tự điền sau upload hoặc gõ tay"
                            />
                        </label>
                        </div>
                    </section>

                    {/* ===== Biến thể ===== */}
                    <section className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h3>Biến thể (cấu hình / màu...)</h3>
                            <button
                                type="button"
                                className={styles.secondaryBtn}
                                onClick={addVariant}
                            >
                                + Thêm biến thể
                            </button>
                        </div>
                        <p className={styles.hint}>
                            Khách chọn biến thể trên trang chi tiết. Giá để trống = dùng giá SP chính.
                        </p>

                        {form.variants.length === 0 ? (
                            <p className={styles.empty}>Chưa có biến thể (vẫn bán được SP đơn).</p>
                        ) : (
                            <div className={styles.variantList}>
                                {form.variants.map((v, index) => (
                                    <div key={index} className={styles.variantRow}>
                                        <input
                                            placeholder="Tên option (VD: 16GB/512GB)"
                                            value={v.option_label}
                                            onChange={(e) =>
                                                updateVariant(index, 'option_label', e.target.value)
                                            }
                                        />
                                        <input
                                            placeholder="SKU"
                                            value={v.sku || ''}
                                            onChange={(e) =>
                                                updateVariant(index, 'sku', e.target.value)
                                            }
                                        />
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Kho"
                                            value={v.stock}
                                            onChange={(e) =>
                                                updateVariant(index, 'stock', e.target.value)
                                            }
                                        />
                                        <input
                                            placeholder="Giá riêng (trống = giá SP)"
                                            value={v.price_display || ''}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    'price_display',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => removeVariant(index)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ===== Nút lưu ===== */}
                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => navigate('/admin/san-pham')}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                        </button>
                    </div>
                </form>
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminProductFormPage;
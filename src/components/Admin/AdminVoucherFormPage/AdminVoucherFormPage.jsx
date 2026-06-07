/**
 * AdminVoucherFormPage — Thêm / Sửa voucher
 * URL: /admin/voucher/tao | /admin/voucher/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminRoute from '@components/AdminRoute/AdminRoute';
import AdminLayout from '../AdminLayout/AdminLayout';
import {
    getAdminVoucher,
    createVoucher,
    updateVoucher,
} from '@/apis/adminOrderService';
import styles from './styles.module.scss';

const emptyForm = {
    code: '',
    title: '',
    description: '',
    discount_type: 'fixed',
    discount_value: '',
    min_order_amount: '',
    max_discount: '',
    starts_at: '',
    expires_at: '',
    usage_limit: '',
    is_active: true,
};

// Chuyển datetime-local → ISO cho BE
function toIso(localValue) {
    if (!localValue) return null;
    return new Date(localValue).toISOString();
}

// Chuyển ISO → datetime-local cho input
function toLocalInput(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AdminVoucherFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;

        getAdminVoucher(id)
            .then(({ data }) => {
                setForm({
                    code: data.code || '',
                    title: data.title || '',
                    description: data.description || '',
                    discount_type: data.discount_type || 'fixed',
                    discount_value: data.discount_value ?? '',
                    min_order_amount: data.min_order_amount ?? '',
                    max_discount: data.max_discount ?? '',
                    starts_at: toLocalInput(data.starts_at),
                    expires_at: toLocalInput(data.expires_at),
                    usage_limit: data.usage_limit ?? '',
                    is_active: data.is_active ?? true,
                });
            })
            .catch(() => setError('Không tải được voucher.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const setField = (name, value) => {
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const body = {
            code: form.code.trim().toUpperCase(),
            title: form.title.trim(),
            description: form.description.trim() || null,
            discount_type: form.discount_type,
            discount_value: Number(form.discount_value),
            min_order_amount: Number(form.min_order_amount) || 0,
            max_discount: form.max_discount ? Number(form.max_discount) : null,
            starts_at: toIso(form.starts_at),
            expires_at: toIso(form.expires_at),
            usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
            is_active: form.is_active,
        };

        try {
            if (isEdit) {
                await updateVoucher(id, body);
            } else {
                await createVoucher(body);
            }
            navigate('/admin/voucher');
        } catch (err) {
            const msg = err.response?.data?.message
                || Object.values(err.response?.data?.errors || {}).flat().join(' ')
                || 'Lưu voucher thất bại.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminRoute>
                <AdminLayout title="Đang tải...">
                    <p>Đang tải...</p>
                </AdminLayout>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <AdminLayout title={isEdit ? 'Sửa voucher' : 'Thêm voucher'}>
                {error && <p className={styles.err}>{error}</p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.row}>
                        <label>
                            Mã voucher *
                            <input
                                value={form.code}
                                onChange={(e) => setField('code', e.target.value)}
                                placeholder="VD: BETATECH100K"
                                required
                            />
                        </label>
                        <label>
                            Tiêu đề *
                            <input
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="VD: Giảm 100.000đ"
                                required
                            />
                        </label>
                    </div>

                    <label>
                        Mô tả
                        <textarea
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                            rows={2}
                            placeholder="Điều kiện áp dụng..."
                        />
                    </label>

                    <div className={styles.row}>
                        <label>
                            Loại giảm *
                            <select
                                value={form.discount_type}
                                onChange={(e) => setField('discount_type', e.target.value)}
                            >
                                <option value="fixed">Cố định (VNĐ)</option>
                                <option value="percent">Phần trăm (%)</option>
                            </select>
                        </label>
                        <label>
                            Giá trị giảm *
                            <input
                                type="number"
                                min="1"
                                value={form.discount_value}
                                onChange={(e) => setField('discount_value', e.target.value)}
                                placeholder={form.discount_type === 'fixed' ? '100000' : '5'}
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.row}>
                        <label>
                            Đơn tối thiểu (VNĐ) *
                            <input
                                type="number"
                                min="0"
                                value={form.min_order_amount}
                                onChange={(e) => setField('min_order_amount', e.target.value)}
                                placeholder="10000000"
                                required
                            />
                        </label>
                        {form.discount_type === 'percent' && (
                            <label>
                                Giảm tối đa (VNĐ)
                                <input
                                    type="number"
                                    min="1"
                                    value={form.max_discount}
                                    onChange={(e) => setField('max_discount', e.target.value)}
                                    placeholder="500000"
                                />
                            </label>
                        )}
                    </div>

                    <div className={styles.row}>
                        <label>
                            Bắt đầu (tuỳ chọn)
                            <input
                                type="datetime-local"
                                value={form.starts_at}
                                onChange={(e) => setField('starts_at', e.target.value)}
                            />
                        </label>
                        <label>
                            HSD — hạn sử dụng *
                            <input
                                type="datetime-local"
                                value={form.expires_at}
                                onChange={(e) => setField('expires_at', e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.row}>
                        <label>
                            Giới hạn lượt dùng (để trống = không giới hạn)
                            <input
                                type="number"
                                min="1"
                                value={form.usage_limit}
                                onChange={(e) => setField('usage_limit', e.target.value)}
                            />
                        </label>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setField('is_active', e.target.checked)}
                            />
                            Hiển thị / hoạt động
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={() => navigate('/admin/voucher')}>
                            Huỷ
                        </button>
                        <button type="submit" className={styles.primaryBtn} disabled={saving}>
                            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo voucher'}
                        </button>
                    </div>
                </form>
            </AdminLayout>
        </AdminRoute>
    );
}

export default AdminVoucherFormPage;

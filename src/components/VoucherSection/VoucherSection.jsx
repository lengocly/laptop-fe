/**
 * VoucherSection — Khối voucher trang chủ (giống Shopee)
 * Nằm giữa countdown và carousel sản phẩm.
 * User xem voucher và bấm "Lưu" (cần đăng nhập).
 */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@components/Layout/Layout';
import { AuthContext } from '@/contexts/AuthProvider';
import { getPublicVouchers, saveVoucher } from '@/apis/voucherService';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';

// Format HSD: dd.MM.yyyy
function formatHsd(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

// Hiển thị mức giảm trên dải màu trái
function discountLabel(voucher) {
    if (voucher.discount_type === 'fixed') {
        return formatVnd(voucher.discount_value);
    }
    return `-${voucher.discount_value}%`;
}

function VoucherCard({ voucher, onSave, saving }) {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <article className={styles.card}>
            {/* Dải màu trái — số tiền / % giảm */}
            <div className={styles.strip}>
                <span className={styles.stripValue}>{discountLabel(voucher)}</span>
                <span className={styles.stripLabel}>GIẢM</span>
            </div>

            {/* Chi tiết voucher */}
            <div className={styles.body}>
                <h3 className={styles.title}>{voucher.title}</h3>
                {voucher.description && (
                    <p className={styles.desc}>{voucher.description}</p>
                )}
                <p className={styles.minOrder}>
                    Đơn tối thiểu {formatVnd(voucher.min_order_amount)}
                </p>

                <div className={styles.footer}>
                    <span className={styles.hsd}>
                        HSD: {formatHsd(voucher.expires_at)}
                    </span>

                    {voucher.is_saved ? (
                        <span className={styles.savedBadge}>Đã lưu</span>
                    ) : (
                        <button
                            type="button"
                            className={styles.saveBtn}
                            disabled={saving}
                            onClick={() => onSave(voucher.id)}
                        >
                            {saving ? '...' : isAuthenticated ? 'Lưu' : 'Đăng nhập để lưu'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

function VoucherSection() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [toast, setToast] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadVouchers = () => {
        getPublicVouchers()
            .then(({ data }) => setVouchers(data.vouchers || []))
            .catch(() => setVouchers([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadVouchers();
    }, [isAuthenticated]);

    const handleSave = async (voucherId) => {
        if (!isAuthenticated) {
            navigate('/dang-nhap?next=/');
            return;
        }

        setSavingId(voucherId);
        try {
            await saveVoucher(voucherId);
            setToast('Đã lưu voucher!');
            loadVouchers();
            setTimeout(() => setToast(''), 2500);
        } catch (err) {
            setToast(err.response?.data?.message || 'Không lưu được voucher.');
            setTimeout(() => setToast(''), 3000);
        } finally {
            setSavingId(null);
        }
    };

    if (loading || vouchers.length === 0) {
        return null;
    }

    return (
        <MainLayout>
            <section className={styles.section}>
                <div className={styles.header}>
                    <h2>Mã giảm giá</h2>
                    <span className={styles.sub}>Lưu voucher để dùng khi thanh toán</span>
                </div>

                <div className={styles.scroll}>
                    {vouchers.map((v) => (
                        <VoucherCard
                            key={v.id}
                            voucher={v}
                            onSave={handleSave}
                            saving={savingId === v.id}
                        />
                    ))}
                </div>

                {toast && <p className={styles.toast}>{toast}</p>}
            </section>
        </MainLayout>
    );
}

export default VoucherSection;

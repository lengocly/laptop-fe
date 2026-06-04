import { useEffect, useState } from 'react';
import { ORDER_STATUS_LABEL, ORDER_STATUS_OPTIONS } from '@/constants/orderStatus';
import StatusBadge from '@components/shared/StatusBadge/StatusBadge';
import styles from './styles.module.scss';

function OrderStatusModal({ open, order, onClose, onSubmit, loading }) {
    const [status, setStatus] = useState('pending');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (!order) return;
        setStatus(order.status);
        setNote(order.admin_note || '');
    }, [order]);

    if (!open || !order) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(order.id, status, note);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3>Cập nhật trạng thái đơn hàng</h3>
                <p className={styles.meta}>
                    Mã đơn: <strong>{order.order_code}</strong>
                </p>
                <p className={styles.meta}>
                    Trạng thái hiện tại:{' '}
                    <StatusBadge
                        type="order"
                        value={order.status}
                        label={ORDER_STATUS_LABEL[order.status]}
                    />
                </p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Trạng thái mới
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {ORDER_STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Ghi chú (tuỳ chọn)
                        <textarea
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="VD: Đã liên hệ khách, giao trong 2 ngày..."
                        />
                    </label>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} disabled={loading}>
                            Hủy
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OrderStatusModal;
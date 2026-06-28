import { ORDER_STATUS_LABEL } from '@/constants/orderStatus';
const STATUS_COLORS = {
    pending_payment: '#ef4444',
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipping: '#8b5cf6',
    delivered: '#22c55e',
    cancelled: '#ef4444',
};
export function buildOrderStatusChart(orders = []) {
    const counts = {};
    orders.forEach((order) => {
        const key = order.status || 'pending';
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(ORDER_STATUS_LABEL)
        .map(([status, name]) => ({
            status,
            name,
            value: counts[status] || 0,
            fill: STATUS_COLORS[status] || '#94a3b8',
        }))
        .filter((item) => item.value > 0);
}
export { STATUS_COLORS };


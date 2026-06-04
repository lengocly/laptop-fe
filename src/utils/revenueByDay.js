/**
 * Trả về mảng 7 ngày gần nhất (kể cả ngày không có đơn → total = 0)
 * @param {Array} orders - danh sách đơn từ getAdminOrders
 * @param {number} days - mặc định 7
 */
export function buildRevenueByDay(orders, days = 7) {
    const paid = orders.filter((o) => o.payment_status === 'paid');

    // Map date -> tổng tiền
    const totals = {};
    paid.forEach((o) => {
        const key = toDateKey(o.created_at);
        totals[key] = (totals[key] || 0) + Number(o.subtotal || 0);
    });

    // Tạo đủ 7 ngày liên tiếp (hôm nay lùi về)
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const date = toDateKey(d);
        result.push({
            date,           // "2026-06-03"
            label: formatDayLabel(d), // "03/06" cho trục X
            total: totals[date] || 0,
        });
    }

    return result;
}

function toDateKey(isoOrDate) {
    const d = new Date(isoOrDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatDayLabel(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${m}`;
}
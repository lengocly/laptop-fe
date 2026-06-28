export function buildRevenueByDay(orders, days = 7) {
    const paid = orders.filter((o) => o.payment_status === 'paid');
    const totals = {};
    paid.forEach((o) => {
        const key = toDateKey(o.created_at);
        totals[key] = (totals[key] || 0) + Number(o.subtotal || 0);
    });
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const date = toDateKey(d);
        result.push({
            date,
            label: formatDayLabel(d),
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
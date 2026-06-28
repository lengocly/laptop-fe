export function parsePriceNumber(str) {
    if (!str) return 0;
    return Number(String(str).replace(/[^\d]/g, '')) || 0;
}
export function calcDiscountPercent(price, priceOriginal) {
    const current = parsePriceNumber(price);
    const original = parsePriceNumber(priceOriginal);
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
}
export function formatVnd(amount) {
    if (amount == null || Number.isNaN(amount)) return '';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}
export function calcSavings(price, priceOriginal) {
    const diff = parsePriceNumber(priceOriginal) - parsePriceNumber(price);
    return diff > 0 ? diff : 0;
}
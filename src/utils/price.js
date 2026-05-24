//hàm chuyển giá dạng chữ thành số
export function parsePriceNumber(str) {
    if (!str) return 0;
    return Number(String(str).replace(/[^\d]/g, '')) || 0;
}

//hàm tính % giảm giá
export function calcDiscountPercent(price, priceOriginal) {
    const current = parsePriceNumber(price);
    const original = parsePriceNumber(priceOriginal);
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
}

//Hàm này dùng để định dạng số thành tiền Việt Nam
export function formatVnd(amount) {
    if (!amount) return '';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

//Hàm này dùng để tính số tiền tiết kiệm được.
export function calcSavings(price, priceOriginal) {
    const diff = parsePriceNumber(priceOriginal) - parsePriceNumber(price);
    return diff > 0 ? diff : 0;
}
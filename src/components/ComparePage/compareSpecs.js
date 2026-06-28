export const COMPARE_SPEC_SECTIONS = [
    {
        id: 'config',
        title: 'Cấu hình',
        rows: [
            { key: 'cpu', label: 'CPU' },
            { key: 'ram', label: 'RAM' },
            { key: 'storage', label: 'Ổ cứng' },
        ],
    },
    {
        id: 'screen',
        title: 'Màn hình',
        rows: [{ key: 'screen', label: 'Màn hình' }],
    },
    {
        id: 'info',
        title: 'Thông tin chung',
        rows: [
            { key: 'category', label: 'Danh mục' },
            { key: 'stock', label: 'Tồn kho' },
        ],
    },
];
export function getProductSpecValue(product, key) {
    if (!product) return '—';
    if (key === 'category') {
        return product.category?.name || '—';
    }
    if (key === 'stock') {
        return product.stock != null ? String(product.stock) : '—';
    }
    const value = product[key];
    return value && String(value).trim() ? String(value).trim() : '—';
}
export function isRowDifferent(products, key) {
    const values = products.map((p) => getProductSpecValue(p, key).toLowerCase());
    const filled = values.filter((v) => v !== '—');
    if (filled.length <= 1) return filled.length > 0;
    return new Set(filled).size > 1;
}


export function buildFullAddress({ street, ward, district, province }) {
    const parts = [
        street?.trim(),
        ward?.name,
        district?.name,
        province?.name,
    ].filter(Boolean);
    return parts.join(', ');
}
export function estimateCartWeightGram(items) {
    const gram = (items ?? []).reduce(
        (sum, item) => sum + 1500 * (item.quantity ?? 1),
        0
    );
    return Math.max(gram, 500);
}


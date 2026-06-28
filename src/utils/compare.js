export const LAPTOP_PARENT_SLUGS = ['laptop', 'laptop-group'];
export function isLaptopGroupSlug(slug) {
    if (!slug) return false;
    return LAPTOP_PARENT_SLUGS.includes(String(slug).toLowerCase());
}
export function canCompareProduct(parentGroupSlug) {
    return isLaptopGroupSlug(parentGroupSlug);
}


export const IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect fill='%23f3f4f6' width='640' height='480'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='system-ui,sans-serif' font-size='18'%3EBetaTech%3C/text%3E%3C/svg%3E";
const API_ORIGIN = (
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/api\/v1\/?$/, '');
export function resolveImageUrl(src) {
    if (!src) return IMG_FALLBACK;
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) {
        return src;
    }
    return `${API_ORIGIN}/storage/${src}`;
}


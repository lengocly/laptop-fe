export const reviewChannelUrl = 'https://www.youtube.com/shorts/hDrlSUjz8yU';
export const reviewVideos = [
    {
        youtubeId: 'hDrlSUjz8yU',
        videoTitle: 'MacBook — đáng mua không?',
        productId: 3,
        name: 'MacBook Pro 14',
        price: '42.990.000 ₫',
        priceOriginal: '46.990.000 ₫',
        image: 'products/mac1.png',
    },
    {
        youtubeId: 'YIZ_Pm_9ubc',
        videoTitle: 'Chọn laptop phù hợp',
        productId: 1,
        name: 'ASUS Vivobook 15',
        price: '15.990.000 ₫',
        priceOriginal: '18.990.000 ₫',
        image: 'products/asus1.jpg',
    },
    {
        youtubeId: 'mK6cW84qh-8',
        videoTitle: 'Lenovo IdeaPad trải nghiệm',
        productId: 4,
        name: 'Lenovo IdeaPad Slim 5',
        price: '16.990.000 ₫',
        priceOriginal: '19.990.000 ₫',
        image: 'products/l1.webp',
    },
    {
        youtubeId: '17PQ4sQul1U',
        videoTitle: 'Dell Inspiron đa nhiệm',
        productId: 2,
        name: 'Dell Inspiron 14',
        price: '18.490.000 ₫',
        priceOriginal: '21.990.000 ₫',
        image: 'products/dell1.jpg',
    },
];
export function youtubeThumbUrl(youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
export function youtubeEmbedUrl(youtubeId, autoplay = false) {
    const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        ...(autoplay ? { autoplay: '1' } : {}),
    });
    return `https://www.youtube.com/embed/${youtubeId}?${params}`;
}


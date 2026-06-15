import { useState } from 'react';
import { resolveImageUrl, IMG_FALLBACK } from '@/utils/image';

/** Ảnh blog — tự fallback khi storage chưa có file */
function BlogImage({ src, alt = '', className, ...props }) {
    const [imgSrc, setImgSrc] = useState(() => resolveImageUrl(src));

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setImgSrc(IMG_FALLBACK)}
            {...props}
        />
    );
}

export default BlogImage;

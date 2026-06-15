import BlogProductEmbed from './BlogProductEmbed';
import BlogImage from './BlogImage';
import styles from './blogDetail.module.scss';

/**
 * Render nội dung bài viết theo blocks (p, h2, h3, img, product).
 * Hỗ trợ legacy: content là mảng string → tự chuyển thành paragraph.
 */
function BlogArticleBody({ blocks = [] }) {
    return (
        <div className={styles.articleBody}>
            {blocks.map((block, index) => {
                const key = `${block.type}-${index}`;

                switch (block.type) {
                    case 'h2':
                        return (
                            <h2 key={key} className={styles.heading2}>
                                {block.text}
                            </h2>
                        );
                    case 'h3':
                        return (
                            <h3 key={key} className={styles.heading3}>
                                {block.text}
                            </h3>
                        );
                    case 'img':
                        return (
                            <figure key={key} className={styles.figure}>
                                <BlogImage src={block.src} alt={block.alt || ''} />
                                {block.caption && (
                                    <figcaption className={styles.caption}>
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case 'product':
                        return (
                            <BlogProductEmbed
                                key={key}
                                productId={block.productId}
                                name={block.name}
                                price={block.price}
                                image={block.image}
                            />
                        );
                    case 'p':
                    default:
                        return (
                            <p key={key} className={styles.paragraph}>
                                {block.text}
                            </p>
                        );
                }
            })}
        </div>
    );
}

export default BlogArticleBody;

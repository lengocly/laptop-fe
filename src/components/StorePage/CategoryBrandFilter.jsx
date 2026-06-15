/**
 * CategoryBrandFilter — hàng lọc hãng / loại (kiểu FPT Shop)
 * Dùng khi xem nhóm cha (?group=slug) hoặc danh mục con thuộc nhóm đó.
 */
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { resolveImageUrl } from '@/utils/image';
import styles from './styles.module.scss';

function CategoryBrandFilter({
    title,
    parentSlug,
    brands = [],
    activeSlug = null,
    showAll = true,
}) {
    if (!brands.length) return null;

    const allHref = parentSlug ? `/cua-hang?group=${parentSlug}` : '/cua-hang';

    return (
        <section className={styles.brandSection} aria-label={title}>
            <h2 className={styles.brandTitle}>{title}</h2>

            <div className={styles.brandGrid}>
                {showAll && (
                    <Link
                        to={allHref}
                        className={classNames(styles.brandCard, {
                            [styles.brandCardActive]: !activeSlug,
                        })}
                    >
                        <span className={styles.brandName}>Tất cả</span>
                    </Link>
                )}

                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        to={`/cua-hang?category=${brand.slug}`}
                        className={classNames(styles.brandCard, {
                            [styles.brandCardActive]: activeSlug === brand.slug,
                        })}
                    >
                        {brand.image && (
                            <img
                                src={resolveImageUrl(brand.image)}
                                alt=""
                                className={styles.brandLogo}
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                        <span className={styles.brandName}>{brand.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default CategoryBrandFilter;

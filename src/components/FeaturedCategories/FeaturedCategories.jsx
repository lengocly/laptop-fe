import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/Layout/Layout';
import { getCategories, buildHomepageCategories } from '@/apis/categoriesService';
import { resolveImageUrl } from '@/utils/image';
import { CATEGORY_IMAGES } from './constants';
import styles from './styles.module.scss';
function FeaturedCategories() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        getCategories()
            .then((res) => setCategories(buildHomepageCategories(res.categories)))
            .catch(() => setCategories([]));
    }, []);
    if (!categories.length) return null;
    return (
        <MainLayout>
            <section className={styles.section} aria-labelledby="featured-categories-title">
                <h2 id="featured-categories-title" className={styles.title}>
                    Danh mục nổi bật
                </h2>
                <div className={styles.grid}>
                    {categories.map((category) => {
                        const imageSrc = resolveImageUrl(
                            category.image || CATEGORY_IMAGES[category.slug]
                        );
                        return (
                            <Link
                                key={category.id}
                                to={category.href}
                                className={styles.item}
                            >
                                <div className={styles.imageWrap}>
                                    <img
                                        src={imageSrc}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            e.currentTarget.src = resolveImageUrl(null);
                                        }}
                                    />
                                </div>
                                <span className={styles.label}>{category.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </MainLayout>
    );
}
export default FeaturedCategories;


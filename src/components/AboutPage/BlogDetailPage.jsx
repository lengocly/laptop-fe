/**
 * =============================================================================
 * BlogDetailPage — Trang chi tiết bài viết (/gioi-thieu/bai-viet/:slug)
 * =============================================================================
 *  Hiển thị nội dung đầy đủ của 1 bài viết từ thẻ tin tức trên trang Giới thiệu.
 * =============================================================================
 */
import { Link, useParams } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import { getBlogArticleBySlug } from './constants';
import styles from './blogDetail.module.scss';

function BlogDetailPage() {
    const { slug } = useParams();
    const article = getBlogArticleBySlug(slug);

    return (
        <>
            <MyHeader />

            <MainLayout>
                <div className={styles.page}>
                    {!article ? (
                        <div className={styles.notFound}>
                            <h1 className={styles.notFoundTitle}>Không tìm thấy bài viết</h1>
                            <p className={styles.notFoundText}>
                                Bài viết bạn tìm không tồn tại hoặc đã được gỡ xuống.
                            </p>
                            <Link to="/gioi-thieu" className={styles.backLink}>
                                ← Quay lại Giới thiệu
                            </Link>
                        </div>
                    ) : (
                        <>
                            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                                <Link to="/">Trang chủ</Link>
                                <span className={styles.crumbSep}>›</span>
                                <Link to="/gioi-thieu">Giới thiệu</Link>
                                <span className={styles.crumbSep}>›</span>
                                <span className={styles.crumbCurrent}>{article.title}</span>
                            </nav>

                            <article className={styles.article}>
                                <header className={styles.articleHeader}>
                                    <div className={styles.articleMeta}>
                                        <span className={styles.category}>
                                            <span className={styles.categoryDot} />
                                            {article.category}
                                        </span>
                                        <time className={styles.date}>{article.date}</time>
                                    </div>

                                    <h1 className={styles.articleTitle}>{article.title}</h1>
                                </header>

                                <div className={styles.heroImage}>
                                    <img src={article.image} alt={article.title} />
                                </div>

                                <div className={styles.articleBody}>
                                    {article.content.map((paragraph) => (
                                        <p key={paragraph} className={styles.paragraph}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </article>

                            <footer className={styles.articleFooter}>
                                <Link to="/gioi-thieu" className={styles.backLink}>
                                    ← Quay lại Giới thiệu
                                </Link>
                            </footer>
                        </>
                    )}
                </div>
            </MainLayout>

            <MyFooter />
        </>
    );
}

export default BlogDetailPage;

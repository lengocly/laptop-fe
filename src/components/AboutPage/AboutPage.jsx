/**
 * =============================================================================
 * AboutPage — Trang Giới thiệu (/gioi-thieu)
 * =============================================================================
 *  1. Nội dung công ty (giới thiệu BetaTech)
 *  2. Tin tức & bài viết (3 thẻ blog)
 * =============================================================================
 */
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import AboutNewsCard from './AboutNewsCard';
import { aboutPageMeta, aboutSections, aboutNewsCards } from './constants';
import styles from './styles.module.scss';

function AboutPage() {
    return (
        <>
            <MyHeader />

            <MainLayout>
                <div className={styles.page}>
                    <header className={styles.hero}>
                        <h1 className={styles.pageTitle}>{aboutPageMeta.pageTitle}</h1>
                        <p className={styles.pageSubtitle}>{aboutPageMeta.pageSubtitle}</p>
                    </header>

                    <div className={styles.content}>
                        {aboutSections.map((section) => (
                            <section key={section.id} className={styles.block}>
                                <h2 className={styles.blockTitle}>{section.heading}</h2>

                                {section.paragraphs?.map((text) => (
                                    <p key={text} className={styles.paragraph}>
                                        {text}
                                    </p>
                                ))}

                                {section.quote && (
                                    <blockquote className={styles.quote}>
                                        {section.quote}
                                    </blockquote>
                                )}

                                {section.values && (
                                    <ul className={styles.valueList}>
                                        {section.values.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>

                    <section className={styles.newsSection}>
                        <h2 className={styles.newsHeading}>Tin tức & Bài viết</h2>
                        <p className={styles.newsSub}>
                            Hướng dẫn chọn laptop, review và ưu đãi từ BetaTech
                        </p>
                        <div className={styles.newsGrid}>
                            {aboutNewsCards.map((card) => (
                                <AboutNewsCard key={card.id} card={card} />
                            ))}
                        </div>
                    </section>
                </div>
            </MainLayout>

            <MyFooter />
        </>
    );
}

export default AboutPage;

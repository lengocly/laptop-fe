/**
 * =============================================================================
 * ContactPage — Trang Liên hệ (/lien-he)
 * =============================================================================
 *  1. Tiêu đề + thông tin liên hệ (hotline, email, địa chỉ, giờ làm việc)
 *  2. Showroom & kênh hỗ trợ
 *  3. Google Maps full-width (175 Tây Sơn, Đống Đa, Hà Nội)
 * =============================================================================
 */
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import ContactMap from './ContactMap';
import {
    contactPageMeta,
    contactInfo,
    companyInfo,
    showroomInfo,
    supportChannels,
    policyLinks,
} from './constants';
import styles from './styles.module.scss';

function ContactPage() {
    return (
        <>
            <MyHeader />

            <MainLayout>
                <div className={styles.page}>
                    <header className={styles.hero}>
                        <h1 className={styles.pageTitle}>{contactPageMeta.pageTitle}</h1>
                        <p className={styles.pageSubtitle}>{contactPageMeta.pageSubtitle}</p>
                    </header>

                    {/* Thông tin liên hệ nhanh */}
                    <section className={styles.contactGrid} aria-label="Thông tin liên hệ">
                        <article className={styles.contactCard}>
                            <h2 className={styles.contactCardTitle}>Hotline</h2>
                            <a href={`tel:${contactInfo.hotline.replace(/\s/g, '')}`} className={styles.contactValue}>
                                {contactInfo.hotline}
                            </a>
                            <p className={styles.contactNote}>{contactInfo.hotlineNote}</p>
                        </article>

                        <article className={styles.contactCard}>
                            <h2 className={styles.contactCardTitle}>Email</h2>
                            <a href={`mailto:${contactInfo.email}`} className={styles.contactValue}>
                                {contactInfo.email}
                            </a>
                            <p className={styles.contactNote}>{contactInfo.emailNote}</p>
                        </article>

                        <article className={styles.contactCard}>
                            <h2 className={styles.contactCardTitle}>Địa chỉ</h2>
                            <p className={styles.contactValue}>{contactInfo.address}</p>
                            <p className={styles.contactNote}>{contactInfo.workingHours}</p>
                        </article>
                    </section>

                    {/* Thông tin công ty */}
                    <aside className={styles.companyBox}>
                        <h2 className={styles.companyTitle}>{companyInfo.name}</h2>
                        <ul className={styles.companyList}>
                            <li>
                                <strong>MST:</strong> {companyInfo.taxCode}
                            </li>
                            <li>
                                <strong>Người đại diện:</strong> {companyInfo.representative}
                            </li>
                            <li>
                                <strong>Địa chỉ:</strong> {contactInfo.address}
                            </li>
                            <li>
                                <strong>Email:</strong> {contactInfo.email}
                            </li>
                            <li>
                                <strong>Hotline:</strong> {contactInfo.hotline} ({contactInfo.workingHours})
                            </li>
                        </ul>
                    </aside>

                    {/* Showroom */}
                    <section className={styles.showroomSection}>
                        <h2 className={styles.sectionTitle}>{showroomInfo.title}</h2>
                        <p className={styles.paragraph}>{showroomInfo.description}</p>
                        <ul className={styles.highlightList}>
                            {showroomInfo.highlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Kênh hỗ trợ */}
                    <section className={styles.supportSection}>
                        <h2 className={styles.sectionTitle}>Hỗ trợ khách hàng</h2>
                        <div className={styles.supportGrid}>
                            {supportChannels.map((channel) => (
                                <article key={channel.id} className={styles.supportCard}>
                                    <h3 className={styles.supportTitle}>{channel.title}</h3>
                                    <p className={styles.supportDesc}>{channel.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <nav className={styles.policyNav} aria-label="Chính sách">
                        <h3 className={styles.policyTitle}>Chính sách</h3>
                        <ul className={styles.policyList}>
                            {policyLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </MainLayout>

            {/* Map full-width — nằm trước footer */}
            <ContactMap />

            <MyFooter />
        </>
    );
}

export default ContactPage;

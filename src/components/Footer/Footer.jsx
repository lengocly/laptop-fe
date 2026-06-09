import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import BetaTechLogo from '@components/BetaTechLogo/BetaTechLogo';
import { footerColumns, footerContact, paymentMethods } from './constant';

function MyFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <BetaTechLogo variant="dark" className={styles.footerLogo} />
                        <p className={styles.tagline}>
                            Laptop &amp; phụ kiện chính hãng — tư vấn cấu hình, giao hàng nhanh,
                            bảo hành đầy đủ.
                        </p>
                        <ul className={styles.contactList}>
                            <li>
                                <span className={styles.contactLabel}>Hotline</span>
                                <a href={`tel:${footerContact.hotline.replace(/\s/g, '')}`}>
                                    {footerContact.hotline}
                                </a>
                            </li>
                            <li>
                                <span className={styles.contactLabel}>Email</span>
                                <a href={`mailto:${footerContact.email}`}>{footerContact.email}</a>
                            </li>
                            <li>
                                <span className={styles.contactLabel}>Địa chỉ</span>
                                <span>{footerContact.address}</span>
                            </li>
                            <li>
                                <span className={styles.contactLabel}>Giờ mở cửa</span>
                                <span>{footerContact.hours}</span>
                            </li>
                        </ul>
                    </div>

                    {footerColumns.map((col) => (
                        <div key={col.title} className={styles.linkCol}>
                            <h3 className={styles.colTitle}>{col.title}</h3>
                            <ul className={styles.linkList}>
                                {col.links.map((link) => (
                                    <li key={link.to}>
                                        <Link to={link.to} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={styles.trustRow}>
                    <div className={styles.trustItem}>
                        <strong>Giao hàng nhanh</strong>
                        <span>Toàn quốc 2–5 ngày</span>
                    </div>
                    <div className={styles.trustItem}>
                        <strong>Thanh toán an toàn</strong>
                        <span>COD &amp; Stripe</span>
                    </div>
                    <div className={styles.trustItem}>
                        <strong>Đổi trả 14 ngày</strong>
                        <span>Lỗi nhà sản xuất</span>
                    </div>
                    <div className={styles.trustItem}>
                        <strong>Hỗ trợ 24/7</strong>
                        <span>Hotline &amp; email</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.bottomInner}>
                    <div className={styles.paymentBlock}>
                        <span className={styles.paymentLabel}>Phương thức thanh toán</span>
                        <div className={styles.paymentTags}>
                            {paymentMethods.map((method) => (
                                <span key={method} className={styles.paymentTag}>
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} BetaTech E-Commerce. Đồ án website bán
                        laptop.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default MyFooter;

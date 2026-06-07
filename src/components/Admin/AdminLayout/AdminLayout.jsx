import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';

const menuItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/don-hang', label: 'Đơn hàng' },
    { to: '/admin/san-pham', label: 'Sản phẩm' },
    { to: '/admin/voucher', label: 'Voucher' },
];

function AdminLayout({ title, children }) {
    const { pathname } = useLocation();

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHead}>
                    <strong>Admin Panel</strong>
                    <Link to="/" className={styles.backStore}>← Về cửa hàng</Link>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={classNames(styles.navItem, {
                                [styles.navItemActive]: pathname === item.to,
                            })}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.mainHead}>
                    <h1>{title}</h1>
                </header>
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;
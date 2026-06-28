import BoxIcon from './BoxIcon/BoxIcon';
import Menu from './Menu/Menu';
import StoreCategoryMenu from './StoreCategoryMenu/StoreCategoryMenu';
import HeaderMarquee from './HeaderMarquee';
import { dataBoxIcon, dataMenu } from './constants';
import styles from './styles.module.scss';
import BetaTechLogo from '@components/BetaTechLogo/BetaTechLogo';
import { TfiReload } from 'react-icons/tfi';
import { CiHeart } from 'react-icons/ci';
import { PiShoppingCart } from 'react-icons/pi';
import useScrollHandling from '@/hooks/useScrollHandling';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { AuthContext } from '@/contexts/AuthProvider';
import { CartContext } from '@/contexts/CartProvider';
import { WishlistContext } from '@/contexts/WishlistProvider';
import { CompareContext } from '@/contexts/CompareProvider';
import { Link } from 'react-router-dom';
import { PiUserCircle } from 'react-icons/pi';
import { FiMenu, FiX } from 'react-icons/fi';
import SearchOverlay from './SearchOverlay/SearchOverlay';
function MyHeader() {
    const {
        containerBoxIcon,
        containerMenu,
        containerHeader,
        menu,
        containerBox,
        container,
        fixedHeader,
        topHeader,
    } = styles;
    const { scrollPosition } = useScrollHandling();
    const [fixedPosition, setFixedPosition] = useState(false);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const { user, logout, loading , isAdmin} = useContext(AuthContext);
    const handleOpenSideBar = (type) => {
        setIsOpen(true);
        setType(type);
    };
    const { totalCount } = useContext(CartContext);
    const { count: wishlistCount } = useContext(WishlistContext);
    const { count: compareCount } = useContext(CompareContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);
    const closeMobileMenu = () => setMobileMenuOpen(false);
    const openSearch = () => {
        setIsSearchOpen(true);
        closeMobileMenu();
    };
    const openLogin = () => {
        setIsOpen(true);
        setType('login');
        closeMobileMenu();
    };
    useEffect(() => {
        setFixedPosition(scrollPosition > 80);
    }, [scrollPosition]);
    return (
        <div
            className={classNames(container, topHeader, {
                [fixedHeader]: fixedPosition
            })}
        >
            <HeaderMarquee />
            <div className={containerHeader}>
                <button
                    type="button"
                    className={styles.mobileMenuBtn}
                    aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((open) => !open)}
                >
                    {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
                <div className={classNames(containerBox, styles.desktopOnly)}>
                    <div className={containerBoxIcon}>
                        {dataBoxIcon.map((item) => {
                            return (
                                <BoxIcon type={item.type} href={item.href} />
                            );
                        })}
                    </div>
                    <div className={containerMenu}>
                        <Menu
                            key={dataMenu[0].content}
                            content={dataMenu[0].content}
                            href={dataMenu[0].href}
                        />
                        <StoreCategoryMenu />
                        <Menu content={dataMenu[2].content} href={dataMenu[2].href} />
                    </div>
                </div>
                <BetaTechLogo variant="light" />
                <div className={classNames(containerBox, styles.desktopOnly)}>
                    <div className={containerMenu}>
                            {dataMenu
                                .slice(3)
                                .filter(
                                    (item) =>
                                        item.content !== 'Đăng nhập' &&
                                        item.content !== 'Tìm kiếm'
                                )
                                .map((item) => (
                                    <Menu
                                        key={item.content}
                                        content={item.content}
                                        href={item.href}
                                    />
                                ))}
                            <Menu
                                content="Tìm kiếm"
                                href="#"
                                onClick={() => setIsSearchOpen(true)}
                            />
                            {!loading && !user && (
                                <Menu content="Đăng nhập" href="#" />
                            )}
                            {user && (
                                <div className={styles.userMenuWrap}>
                                    <button type="button"       className={classNames(menu, styles.userMenuTrigger)}>
                                        <span className={styles.userTriggerInner}>
                                            <PiUserCircle size={22} />
                                            <span>{user.name}</span>
                                        </span>
                                    </button>
                                    <div className={styles.userDropdown}>
                                        <div className={styles.userInfo}>
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className={styles.userDivider} />
                                        <Link to="/don-hang-cua-toi" className={styles.userMenuItem}>
                                            Đơn hàng
                                        </Link>
                                        <Link to="/tai-khoan" className={styles.userMenuItem}>
                                            Tài khoản
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/admin/dashboard" className={styles.userMenuItem}>
                                                Admin
                                            </Link>
                                        )}
                                        <div className={styles.userDivider} />
                                        <button
                                            type="button"
                                            className={styles.userMenuItemLogout}
                                            onClick={logout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                <div className={classNames(containerBoxIcon, styles.mobileActions)}>
                        <div
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => handleOpenSideBar('compare')}
                        >
                            <TfiReload style={{ fontSize: '20px' }} />
                            {compareCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -8,
                                    minWidth: 18,
                                    height: 18,
                                    padding: '0 4px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: '#e74c3c',
                                    borderRadius: 999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {compareCount > 99 ? '99+' : compareCount}
                                </span>
                            )}
                        </div>
                        <div
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => handleOpenSideBar('wishlist')}
                        >
                            <CiHeart style={{ fontSize: '25px' }} />
                            {wishlistCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -8,
                                    minWidth: 18,
                                    height: 18,
                                    padding: '0 4px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: '#e74c3c',
                                    borderRadius: 999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </div>
                        <div style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => handleOpenSideBar('cart')}>
                            <PiShoppingCart style={{ fontSize: '25px' }} />
                            {totalCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -8,
                                    minWidth: 18,
                                    height: 18,
                                    padding: '0 4px',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: '#e74c3c',
                                    borderRadius: 999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {totalCount > 99 ? '99+' : totalCount}
                                </span>
                            )}
                        </div>
                    </div>
            </div>
            <div
                className={classNames(styles.mobileNavOverlay, {
                    [styles.mobileNavOverlayOpen]: mobileMenuOpen,
                })}
                aria-hidden={!mobileMenuOpen}
                onClick={closeMobileMenu}
            />
            <nav
                className={classNames(styles.mobileNav, {
                    [styles.mobileNavOpen]: mobileMenuOpen,
                })}
                aria-hidden={!mobileMenuOpen}
            >
                <div className={styles.mobileNavHeader}>
                    <strong>Menu</strong>
                    <button type="button" className={styles.mobileNavClose} onClick={closeMobileMenu}>
                        <FiX size={20} />
                    </button>
                </div>
                <Link to="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                    Trang chủ
                </Link>
                <Link to="/cua-hang" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                    Cửa hàng
                </Link>
                <Link to="/gioi-thieu" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                    Giới thiệu
                </Link>
                <Link to="/lien-he" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                    Liên hệ
                </Link>
                <button type="button" className={styles.mobileNavLink} onClick={openSearch}>
                    Tìm kiếm
                </button>
                {!loading && !user && (
                    <button type="button" className={styles.mobileNavLink} onClick={openLogin}>
                        Đăng nhập
                    </button>
                )}
                {user && (
                    <>
                        <div className={styles.mobileNavUser}>
                            <PiUserCircle size={20} />
                            <span>{user.name}</span>
                        </div>
                        <Link to="/don-hang-cua-toi" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                            Đơn hàng
                        </Link>
                        <Link to="/tai-khoan" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                            Tài khoản
                        </Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                                Admin
                            </Link>
                        )}
                        <button
                            type="button"
                            className={styles.mobileNavLogout}
                            onClick={() => {
                                logout();
                                closeMobileMenu();
                            }}
                        >
                            Đăng xuất
                        </button>
                    </>
                )}
            </nav>
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
}
export default MyHeader;


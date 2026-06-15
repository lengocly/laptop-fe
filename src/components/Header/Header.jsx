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
import SearchOverlay from './SearchOverlay/SearchOverlay';


function MyHeader() {
    // cho icon nằm ngang
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

    //lấy ra scrollY để xử lý scroll
    const { scrollPosition } = useScrollHandling();

    //= true khi scrollY > 0, false khi scrollY = 0
    const [fixedPosition, setFixedPosition] = useState(false);

    //sử dụng context để lấy trạng thái mở đóng của sidebar
    const { setIsOpen, setType } = useContext(SideBarContext);

    //AuthContext lấy user, logout, loading, isAdmin để kiểm tra user có phải admin không
    const { user, logout, loading , isAdmin} = useContext(AuthContext);

    const handleOpenSideBar = (type) => {
        setIsOpen(true);
        setType(type);
    };

    
    const { totalCount } = useContext(CartContext);
    const { count: wishlistCount } = useContext(WishlistContext);
    const { count: compareCount } = useContext(CompareContext);

    // Trạng thái mở/đóng overlay tìm kiếm
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        //cách 1
        // if (scrollPosition > 80) {
        //     setFixedPosition(true);
        // } else {
        //     setFixedPosition(false);
        // }

        //cách 2 ngắn gọn hơn
        // setFixedPosition(scrollPosition > 80 ? true : false);

        //cách 3:
        setFixedPosition(scrollPosition > 80);
    }, [scrollPosition]);

    return (
        // nếu fixedPosition = true thì thêm class fixedHeader, ngược lại thì thêm class topHeader; cả 2 class đều có class container
        <div
            className={classNames(container, topHeader, {
                [fixedHeader]: fixedPosition
            })}
        >
            <HeaderMarquee />
            <div className={containerHeader}>
                <div className={containerBox}>
                    <div className={containerBoxIcon}>
                        {dataBoxIcon.map((item) => {
                            return (
                                <BoxIcon type={item.type} href={item.href} />
                            );
                        })}
                    </div>
                    {/* lấy data từ constant */}
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
                <div className={containerBox}>
                    <div className={containerMenu}>
                        {/* lấy tiếp theo đến cuối cùng */}
                        {/* Menu phải — Tìm kiếm mở overlay, không dùng link # */}
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

                            {/* Chưa login → Đăng nhập */}
                            {!loading && !user && (
                                <Menu content="Đăng nhập" href="#" />
                            )}

                            {/* Đã login → chào + đăng xuất */}
                            {user && (
                                <div className={styles.userMenuWrap}>
                                    <button type="button"       className={classNames(menu, styles.userMenuTrigger)}>
                                        <span className={styles.userTriggerInner}>
                                            <PiUserCircle size={22} />
                                            <span>{user.name}</span>
                                        </span>
                                    </button>
                                    {/* hiển thị menu dropdown */}
                                    <div className={styles.userDropdown}>

                                        {/* hiển thị thông tin user */}
                                        <div className={styles.userInfo}>
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>

                                        {/* hiển thị đường ngắn */}
                                        <div className={styles.userDivider} />

                                        {/* hiển thị menu item đơn hàng */}
                                        <Link to="/don-hang-cua-toi" className={styles.userMenuItem}>
                                            Đơn hàng
                                        </Link>

                                        <Link to="/tai-khoan" className={styles.userMenuItem}>
                                            Tài khoản
                                        </Link>

                                        {/* hiển thị menu item admin */}
                                
                                        {isAdmin && (
                                            <Link to="/admin/dashboard" className={styles.userMenuItem}>
                                                Admin
                                            </Link>
                                        )}
                                        {/* hiển thị đường ngắn */}
                                        <div className={styles.userDivider} />

                                        {/* hiển thị menu item đăng xuất */}
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

                    <div className={containerBoxIcon}>
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
                        
                        {/* // bọc icon giỏ (thêm span badge): */}
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
            </div>

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
}

export default MyHeader;

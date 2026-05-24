import BoxIcon from './BoxIcon/BoxIcon';
import Menu from './Menu/Menu';
import { dataBoxIcon, dataMenu } from './constants';
import styles from './styles.module.scss';
import Logo from '@icons/images/logo.png';
import { TfiReload } from 'react-icons/tfi';
import { CiHeart } from 'react-icons/ci';
import { PiShoppingCart } from 'react-icons/pi';
import useScrollHandling from '@/hooks/useScrollHandling';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { AuthContext } from '@/contexts/AuthProvider';

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
        topHeader
    } = styles;

    //lấy ra scrollY để xử lý scroll
    const { scrollPosition } = useScrollHandling();

    //= true khi scrollY > 0, false khi scrollY = 0
    const [fixedPosition, setFixedPosition] = useState(false);

    //sử dụng context để lấy trạng thái mở đóng của sidebar
    const { setIsOpen, setType } = useContext(SideBarContext);

    //AuthContext lấy user, logout, loading
    const { user, logout, loading } = useContext(AuthContext);

    const handleOpenSideBar = (type) => {
        setIsOpen(true);
        setType(type);
    };

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
                        {dataMenu.slice(1, 3).map((item) => (
                            <Menu key={item.content} content={item.content} href={item.href} />
                        ))}
                    </div>
                </div>
                <div>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ width: '153px', height: '53px' }}
                    />
                </div>
                <div className={containerBox}>
                    <div className={containerMenu}>
                        {/* lấy tiếp theo đến cuối cùng */}
                        {/* Tìm kiếm + menu khác (bỏ Đăng nhập khỏi map) */}
                            {dataMenu
                                .slice(3)
                                .filter((item) => item.content !== 'Đăng nhập')
                                .map((item) => (
                                    <Menu
                                        key={item.content}
                                        content={item.content}
                                        href={item.href}
                                    />
                                ))}

                            {/* Chưa login → Đăng nhập */}
                            {!loading && !user && (
                                <Menu content="Đăng nhập" href="#" />
                            )}

                            {/* Đã login → chào + đăng xuất */}
                            {user && (
                                <>
                                    <span className={menu} style={{ cursor: 'default' }}>
                                        Xin chào, {user.name}
                                    </span>
                                    <div
                                        className={menu}
                                        onClick={logout}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Đăng xuất
                                    </div>
                                </>
                            )}
                    </div>

                    <div className={containerBoxIcon}>
                        <TfiReload
                            style={{ fontSize: '20px' }}
                            onClick={() => handleOpenSideBar('compare')}
                        />
                        <CiHeart
                            style={{ fontSize: '25px' }}
                            onClick={() => handleOpenSideBar('wishlist')}
                        />
                        <PiShoppingCart
                            style={{ fontSize: '25px' }}
                            onClick={() => handleOpenSideBar('cart')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyHeader;

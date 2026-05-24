import styles from './styles.module.scss';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import classNames from 'classnames';
import { TfiClose } from 'react-icons/tfi';
import BoxIcon from '@components/Header/BoxIcon/BoxIcon';
import Login from '@components/ContentSideBar/Login/Login';
import Compare from '@components/ContentSideBar/Compare/Compare';
import Register from '@components/ContentSideBar/Register/Register';

function Sidebar() {
    const { container, overlay, sideBar, slideSideBar, boxIcon } = styles;

    //lấy ra biến isOpen từ context để biết được sidebar đang mở hay đóng, từ đó hiển thị lớp phủ và sidebar tương ứng
    const { isOpen, setIsOpen, type } = useContext(SideBarContext);

    const handleToggle = () => {
        setIsOpen(!isOpen); //đảo ngược giá trị của isOpen để mở hoặc đóng sidebar
    };

    //hàm này sẽ trả về nội dung tương ứng với type mà người dùng chọn khi mở sidebar, nếu type là 'login' thì trả về component Login, nếu type là 'compare' thì trả về chuỗi 'compare', nếu type là 'wishlist' thì trả về chuỗi 'wishlist', nếu type là 'cart' thì trả về chuỗi 'cart', nếu không có type nào khớp thì mặc định trả về component Login
    const handleRenderContent = () => {
        switch (type) {
            case 'login':
                return <Login />;
            case 'compare':
                return <Compare />;
            case 'wishlist':
                return 'wishlist';
            case 'cart':
                return 'cart';
            case 'register':
                return <Register />;
            default:
                return <Login />;
        }
    };

    return (
        <div className={container}>
            {/* hiển thị lớp phủ */}
            <div
                className={classNames({
                    [overlay]: isOpen
                })}
                onClick={handleToggle} //khi click vào lớp phủ sẽ gọi hàm handleToggle để đóng sidebar click ở đâu màn hình cx dc
            />
            <div
                className={classNames(sideBar, {
                    [slideSideBar]: isOpen //khi isOpen = true thì thêm class slideSideBar để hiển thị sidebar, ngược lại thì không thêm class nào để ẩn sidebar
                })}
            >
                {/* nếu isopen=true mới sử dụng, handletoggle là click dấu X tắt đi */}
                {isOpen && (
                    <div className={boxIcon} onClick={handleToggle}>
                        <TfiClose />
                        {/* icon để đóng sidebar */}
                    </div>
                )}

                {handleRenderContent()}
            </div>
        </div>
    );
}

export default Sidebar;

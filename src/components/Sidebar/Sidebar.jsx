import styles from './styles.module.scss';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import classNames from 'classnames';
import { TfiClose } from 'react-icons/tfi';
import BoxIcon from '@components/Header/BoxIcon/BoxIcon';
import Login from '@components/ContentSideBar/Login/Login';

function Sidebar() {
    const { container, overlay, sideBar, slideSideBar, boxIcon } = styles;

    //lấy ra biến isOpen từ context để biết được sidebar đang mở hay đóng, từ đó hiển thị lớp phủ và sidebar tương ứng
    const { isOpen, setIsOpen } = useContext(SideBarContext);

    const handleToggle = () => {
        setIsOpen(!isOpen); //đảo ngược giá trị của isOpen để mở hoặc đóng sidebar
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

                <Login />
            </div>
        </div>
    );
}

export default Sidebar;

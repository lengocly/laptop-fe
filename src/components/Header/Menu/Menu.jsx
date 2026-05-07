import styles from '../styles.module.scss';

function Menu({ content, href, setIsOpen }) {
    const { menu } = styles;
    return (
        // khi click vào menu sẽ gọi hàm setIsOpen với giá trị true để mở sidebar
        <div className={menu} onClick={() => setIsOpen(true)}>
            {content}
        </div>
    );
}

export default Menu;

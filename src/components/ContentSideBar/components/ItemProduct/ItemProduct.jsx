import styles from './styles.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

//thông tin sản phẩm trong compare
function ItemProduct() {
    const { container, boxContent, title, price, boxClose } = styles;
    return (
        <div className={container}>
            <img
                src='https://macone.vn/wp-content/uploads/2026/03/macbook-neo-specs-select-202603-silver-1024x656.jpeg'
                alt=''
            />

            <div className={boxClose}>
                <IoCloseOutline
                    style={{ fontSize: '25px', color: '#c1c1c1' }}
                />
            </div>

            <div className={boxContent}>
                <div className={title}>Macbook Neo</div>
                <div className={price}>Giá: 30.000.000đ</div>
            </div>
        </div>
    );
}

export default ItemProduct;

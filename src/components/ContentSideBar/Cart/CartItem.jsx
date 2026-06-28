import styles from './styles.module.scss';
import { FiTrash2 } from 'react-icons/fi';
function CartItem({ item, onRemove, onUpdateQty }) {
    const { item: itemClass, image, body, name, variant, price, qtyRow, qtyBtn, qtyValue } =
        styles;
    return (
        <div className={itemClass}>
            <img src={item.image} alt="" className={image} />
            <div className={body}>
                <div className={name}>{item.name}</div>
                {item.optionLabel && (
                    <div className={variant}>Biến thể: {item.optionLabel}</div>
                )}
                <div className={price}>{item.price}</div>
                <div className={qtyRow}>
                    <button
                        type="button"
                        className={qtyBtn}
                        onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                    >
                        −
                    </button>
                    <span className={qtyValue}>{item.quantity}</span>
                    <button
                        type="button"
                        className={qtyBtn}
                        onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                    >
                        +
                    </button>
                </div>
            </div>
            <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(item.key)}
                aria-label="Xóa"
            >
                 <FiTrash2 size={18} />
            </button>
        </div>
    );
}
export default CartItem;
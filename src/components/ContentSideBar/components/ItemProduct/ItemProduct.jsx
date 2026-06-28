import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { IoCloseOutline } from 'react-icons/io5';
const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=640&q=80';
function ItemProduct({ item, onRemove, showSpecs = false }) {
    const { container, boxContent, title, price, boxClose, specs } = styles;
    if (!item) return null;
    const detailUrl = `/product/${item.productId}`;
    const imageSrc = item.image || IMG_FALLBACK;
    const specParts = [item.cpu, item.ram, item.storage, item.screen].filter(Boolean);
    return (
        <div className={container}>
            <Link to={detailUrl}>
                <img
                    src={imageSrc}
                    alt={item.name || ''}
                    onError={(e) => {
                        e.currentTarget.src = IMG_FALLBACK;
                    }}
                />
            </Link>
            <button
                type="button"
                className={boxClose}
                onClick={onRemove}
                aria-label="Xóa sản phẩm"
            >
                <IoCloseOutline
                    style={{ fontSize: '25px', color: '#c1c1c1' }}
                />
            </button>
            <div className={boxContent}>
                <Link to={detailUrl} className={title}>
                    {item.name}
                </Link>
                <div className={price}>Giá: {item.price}</div>
                {showSpecs && specParts.length > 0 && (
                    <p className={specs}>{specParts.join(' · ')}</p>
                )}
            </div>
        </div>
    );
}
export default ItemProduct;


import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { CompareContext, MAX_COMPARE_ITEMS } from '@/contexts/CompareProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
import styles from './styles.module.scss';

const IMG_FALLBACK =
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=640&q=80';

function CompareBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { items, removeFromCompare, clearCompare, count } = useContext(CompareContext);
    const { setIsOpen } = useContext(SideBarContext);

    const isComparePage = location.pathname === '/so-sanh';
    const isAdmin = location.pathname.startsWith('/admin');
    const showBar = count > 0 && !isComparePage && !isAdmin;

    useEffect(() => {
        document.body.style.paddingBottom = showBar ? '120px' : '';
        return () => {
            document.body.style.paddingBottom = '';
        };
    }, [showBar]);

    if (!showBar) {
        return null;
    }

    const slots = Array.from({ length: MAX_COMPARE_ITEMS }, (_, i) => items[i] ?? null);
    const canCompareNow = count >= 2;

    const handleCompareNow = () => {
        if (!canCompareNow) return;
        setIsOpen(false);
        navigate('/so-sanh');
    };

    return (
        <div className={styles.bar} role="region" aria-label="Thanh so sánh sản phẩm">
            <div className={styles.inner}>
                <div className={styles.slots}>
                    {slots.map((item, index) => (
                        <div key={item?.productId ?? `empty-${index}`} className={styles.slot}>
                            {item ? (
                                <>
                                    <button
                                        type="button"
                                        className={styles.slotRemove}
                                        onClick={() => removeFromCompare(item.productId)}
                                        aria-label={`Xóa ${item.name}`}
                                    >
                                        <IoCloseOutline />
                                    </button>
                                    <img
                                        src={item.image || IMG_FALLBACK}
                                        alt=""
                                        className={styles.slotImage}
                                        onError={(e) => {
                                            e.currentTarget.src = IMG_FALLBACK;
                                        }}
                                    />
                                    <p className={styles.slotName}>{item.name}</p>
                                </>
                            ) : (
                                <div className={styles.slotEmpty} aria-hidden />
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.compareBtn}
                        onClick={handleCompareNow}
                        disabled={!canCompareNow}
                        title={
                            canCompareNow
                                ? 'Xem bảng so sánh chi tiết'
                                : 'Cần ít nhất 2 sản phẩm'
                        }
                    >
                        So sánh ngay
                    </button>
                    <button
                        type="button"
                        className={styles.clearLink}
                        onClick={clearCompare}
                    >
                        Xóa tất cả sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CompareBar;

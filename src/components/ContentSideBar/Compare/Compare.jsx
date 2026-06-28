import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSideBar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import { TfiReload } from 'react-icons/tfi';
import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import { CompareContext } from '@/contexts/CompareProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
import styles from './styles.module.scss';
function Compare() {
    const navigate = useNavigate();
    const { setIsOpen } = useContext(SideBarContext);
    const { items, removeFromCompare, clearCompare, count, maxItems } =
        useContext(CompareContext);
    const { container, empty, footer, clearBtn, hint, compareNowBtn } = styles;
    const title = count > 0 ? `SO SÁNH (${count})` : 'SO SÁNH';
    const canCompareNow = count >= 2;
    const handleCompareNow = () => {
        if (!canCompareNow) return;
        setIsOpen(false);
        navigate('/so-sanh');
    };
    return (
        <div className={container}>
            <HeaderSideBar
                icon={<TfiReload style={{ fontSize: '30px' }} />}
                title={title}
            />
            {items.length === 0 ? (
                <p className={empty}>Chưa có laptop để so sánh</p>
            ) : (
                <>
                    {items.map((item) => (
                        <ItemProduct
                            key={item.productId}
                            item={item}
                            onRemove={() => removeFromCompare(item.productId)}
                            showSpecs
                        />
                    ))}
                    <div className={footer}>
                        <p className={hint}>
                            Chỉ so sánh laptop (tối đa {maxItems}). ({count}/{maxItems})
                        </p>
                        <button
                            type="button"
                            className={compareNowBtn}
                            onClick={handleCompareNow}
                            disabled={!canCompareNow}
                        >
                            So sánh ngay
                        </button>
                        <button
                            type="button"
                            className={clearBtn}
                            onClick={clearCompare}
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
export default Compare;


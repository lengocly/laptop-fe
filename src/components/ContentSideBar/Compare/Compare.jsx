import { useContext } from 'react';
import HeaderSideBar from '@components/ContentSideBar/components/HeaderSidebar/HeaderSidebar';
import { TfiReload } from 'react-icons/tfi';
import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import { CompareContext } from '@/contexts/CompareProvider';
import styles from './styles.module.scss';

function Compare() {
    const { items, removeFromCompare, clearCompare, count, maxItems } =
        useContext(CompareContext);
    const { container, empty, footer, clearBtn, hint } = styles;

    const title = count > 0 ? `SO SÁNH (${count})` : 'SO SÁNH';

    return (
        <div className={container}>
            <HeaderSideBar
                icon={<TfiReload style={{ fontSize: '30px' }} />}
                title={title}
            />

            {items.length === 0 ? (
                <p className={empty}>Chưa có sản phẩm để so sánh</p>
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
                            Tối đa {maxItems} sản phẩm ({count}/{maxItems})
                        </p>
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

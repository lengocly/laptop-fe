/**
 * VariantPicker — chọn 256GB / màu (sau khi BE có product_variants).
 */
import styles from './styles.module.scss';

function VariantPicker({
    variantGroup, //Thông tin nhóm biến thể.
    variants, //Danh sách biến thể.
    selectedVariantId, //ID của biến thể đang chọn.
    onSelectVariant, //Hàm xử lý khi chọn biến thể.
}) {
    if (!variantGroup || !variants?.length) return null;

    return (
        <div className={styles.variantBlock}>
            {/* Label: Tên nhóm biến thể: màu, cấu hình */}
            <p className={styles.variantLabel}>{variantGroup.label}</p>
            <div className={styles.variantOptions}>
                {/* variants.map() dùng để lặp qua từng biến thể và tạo ra một button. */}
                {variants.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        //className: định dạng button theo trạng thái đang chọn hay chưa chọn.
                        className={
                            v.id === selectedVariantId
                                ? styles.variantBtnActive
                                : styles.variantBtn
                        }
                        //onClick: khi bấm vào button, sẽ gọi hàm onSelectVariant và truyền vào ID của biến thể đó.
                        onClick={() => onSelectVariant(v.id)}
                        //Nếu tồn kho của variant nhỏ hơn hoặc bằng 0, button sẽ bị khóa
                        disabled={v.stock <= 0}
                    >
                        {/* Tên biến thể và số lượng tồn kho. */}
                        {v.option_label} ({v.stock}) 
                    </button>
                ))}
            </div>
        </div>
    );
}

export default VariantPicker;
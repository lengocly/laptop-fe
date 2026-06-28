import styles from './styles.module.scss';
function VariantPicker({
    variantGroup,
    variants,
    selectedVariantId,
    onSelectVariant,
}) {
    if (!variantGroup || !variants?.length) return null;
    return (
        <div className={styles.variantBlock}>
            <p className={styles.variantLabel}>{variantGroup.label}</p>
            <div className={styles.variantOptions}>
                {variants.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        className={
                            v.id === selectedVariantId
                                ? styles.variantBtnActive
                                : styles.variantBtn
                        }
                        onClick={() => onSelectVariant(v.id)}
                        disabled={v.stock <= 0}
                    >
                        {v.option_label} ({v.stock})
                    </button>
                ))}
            </div>
        </div>
    );
}
export default VariantPicker;
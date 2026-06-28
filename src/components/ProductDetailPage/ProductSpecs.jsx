import styles from './styles.module.scss';
function ProductSpecs({ product }) {
    const hasSpecs =
        product.cpu || product.ram || product.storage || product.screen;
    return (
        <section className={styles.specsCard}>
            <h2 className={styles.sectionTitle}>Thông số kỹ thuật</h2>
            <dl className={styles.specList}>
                {product.cpu && (
                    <>
                        <dt>CPU</dt>
                        <dd>{product.cpu}</dd>
                    </>
                )}
                {product.ram && (
                    <>
                        <dt>RAM</dt>
                        <dd>{product.ram}</dd>
                    </>
                )}
                {product.storage && (
                    <>
                        <dt>Ổ cứng</dt>
                        <dd>{product.storage}</dd>
                    </>
                )}
                {product.screen && (
                    <>
                        <dt>Màn hình</dt>
                        <dd>{product.screen}</dd>
                    </>
                )}
                {!hasSpecs && (
                    <dd className={styles.specEmpty}>
                        Phụ kiện — xem mô tả trên bao bì hoặc liên hệ shop.
                    </dd>
                )}
            </dl>
        </section>
    );
}
export default ProductSpecs;
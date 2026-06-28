import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
function AdvanceHeadling({
    subtitle = 'ĐỪNG BỎ LỠ ƯU ĐÃI',
    title = 'Sản phẩm nổi bật',
    compact = false,
}) {
    const { container, containerCompact, headline, containerMiddleBox, title: titleClass, des } =
        styles;
    return (
        <MainLayout>
            <div className={compact ? containerCompact : container}>
                <div className={headline}></div>
                <div className={containerMiddleBox}>
                    <p className={des}>{subtitle}</p>
                    <p className={titleClass}>{title}</p>
                </div>
                <div className={headline}></div>
            </div>
        </MainLayout>
    );
}
export default AdvanceHeadling;


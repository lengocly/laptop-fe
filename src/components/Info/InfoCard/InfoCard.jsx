import styles from '../styles.module.scss';
function InfoCard({ content, description, src }) {
    const { containerCard, iconWrap, containerContent, title, des } = styles;
    return (
        <div className={containerCard}>
            <span className={iconWrap}>
                <img src={src} alt="" width={28} height={28} />
            </span>
            <div className={containerContent}>
                <div className={title}>{content}</div>
                <div className={des}>{description}</div>
            </div>
        </div>
    );
}
export default InfoCard;


import styles from './styles.module.scss';
function StatusBadge({ type = 'order', value, label }) {
  return (
    <span className={`${styles.badge} ${styles[value] || styles.default}`}>
      {label || value}
    </span>
  );
}
export default StatusBadge;
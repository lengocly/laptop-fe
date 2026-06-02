// Component badge màu (xanh dương / xanh lá / cam / đỏ) — dùng chung MyOrders + Admin.

import styles from './styles.module.scss';

function StatusBadge({ type = 'order', value, label }) {
  return (
    <span className={`${styles.badge} ${styles[value] || styles.default}`}>
      {label || value}
    </span>
  );
}

export default StatusBadge;
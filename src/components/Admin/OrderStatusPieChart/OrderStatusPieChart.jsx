import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import styles from './styles.module.scss';
function OrderStatusPieChart({ data }) {
    if (!data?.length) {
        return (
            <div className={styles.chartCard}>
                <h3>Phân bổ trạng thái đơn hàng</h3>
                <p className={styles.sub}>Chưa có đơn hàng để thống kê.</p>
            </div>
        );
    }
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className={styles.chartCard}>
            <h3>Phân bổ trạng thái đơn hàng</h3>
            <p className={styles.sub}>Tổng {total} đơn trong hệ thống</p>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={96}
                        paddingAngle={2}
                    >
                        {data.map((entry) => (
                            <Cell key={entry.status} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name) => [`${value} đơn`, name]}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                            <span className={styles.legendText}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
export default OrderStatusPieChart;


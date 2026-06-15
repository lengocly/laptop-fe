import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatVnd } from '@/utils/price';
import styles from './styles.module.scss';

function RevenueByDayChart({ data }) {
    if (!data?.length) {
        return <p className={styles.empty}>Chưa có dữ liệu doanh thu.</p>;
    }

    return (
        <div className={styles.chartCard}>
            <h3>Doanh thu theo tuần</h3>
            <p className={styles.sub}>7 ngày gần nhất — chỉ đơn đã thanh toán</p>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) =>
                            v >= 1_000_000 ? `${Math.round(v / 1_000_000)}tr` : `${Math.round(v / 1000)}k`
                        }
                    />
                    <Tooltip
                        formatter={(value) => [formatVnd(value), 'Doanh thu']}
                        labelFormatter={(_, payload) => {
                            const row = payload?.[0]?.payload;
                            return row?.date ? `Ngày ${row.date}` : '';
                        }}
                    />
                    <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RevenueByDayChart;
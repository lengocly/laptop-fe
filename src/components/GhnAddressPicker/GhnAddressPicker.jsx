import { useEffect, useState } from 'react';
import {
    getProvinces,
    getDistricts,
    getWards,
} from '@/apis/shippingService';
import styles from './styles.module.scss';
const emptyAddress = { province: null, district: null, ward: null };
function GhnAddressPicker({ value = emptyAddress, onChange }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        setLoadingProvinces(true);
        setError('');
        getProvinces()
            .then(setProvinces)
            .catch(() => setError('Không tải được danh sách tỉnh/thành.'))
            .finally(() => setLoadingProvinces(false));
    }, []);
    useEffect(() => {
        if (!value.province?.id) {
            setDistricts([]);
            return;
        }
        let cancelled = false;
        setLoadingDistricts(true);
        setError('');
        getDistricts(value.province.id)
            .then((list) => {
                if (!cancelled) setDistricts(list);
            })
            .catch(() => {
                if (!cancelled) setError('Không tải được quận/huyện.');
            })
            .finally(() => {
                if (!cancelled) setLoadingDistricts(false);
            });
        return () => {
            cancelled = true;
        };
    }, [value.province?.id]);
    useEffect(() => {
        if (!value.district?.id) {
            setWards([]);
            return;
        }
        let cancelled = false;
        setLoadingWards(true);
        setError('');
        getWards(value.district.id)
            .then((list) => {
                if (!cancelled) setWards(list);
            })
            .catch(() => {
                if (!cancelled) setError('Không tải được phường/xã.');
            })
            .finally(() => {
                if (!cancelled) setLoadingWards(false);
            });
        return () => {
            cancelled = true;
        };
    }, [value.district?.id]);
    const handleProvinceChange = (e) => {
        const id = Number(e.target.value);
        const province = provinces.find((p) => p.id === id) ?? null;
        onChange({ province, district: null, ward: null });
    };
    const handleDistrictChange = (e) => {
        const id = Number(e.target.value);
        const district = districts.find((d) => d.id === id) ?? null;
        onChange({ ...value, district, ward: null });
    };
    const handleWardChange = (e) => {
        const code = e.target.value;
        const ward = wards.find((w) => w.code === code) ?? null;
        onChange({ ...value, ward });
    };
    return (
        <div className={styles.wrap}>
            <label className={styles.fieldLabel}>Tỉnh / Thành phố *</label>
            <select
                className={styles.select}
                value={value.province?.id ?? ''}
                onChange={handleProvinceChange}
                disabled={loadingProvinces}
                required
            >
                <option value="">
                    {loadingProvinces ? 'Đang tải...' : '— Chọn tỉnh/thành —'}
                </option>
                {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
            <label className={styles.fieldLabel}>Quận / Huyện *</label>
            <select
                className={styles.select}
                value={value.district?.id ?? ''}
                onChange={handleDistrictChange}
                disabled={!value.province?.id || loadingDistricts}
                required
            >
                <option value="">
                    {loadingDistricts ? 'Đang tải...' : '— Chọn quận/huyện —'}
                </option>
                {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>
            <label className={styles.fieldLabel}>Phường / Xã *</label>
            <select
                className={styles.select}
                value={value.ward?.code ?? ''}
                onChange={handleWardChange}
                disabled={!value.district?.id || loadingWards}
                required
            >
                <option value="">
                    {loadingWards ? 'Đang tải...' : '— Chọn phường/xã —'}
                </option>
                {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                        {w.name}
                    </option>
                ))}
            </select>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
export default GhnAddressPicker;


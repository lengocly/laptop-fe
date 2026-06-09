import { useEffect, useState } from 'react';
import {
    fetchProvinces,
    fetchDistricts,
    fetchWards,
} from '@/apis/addressService';
import styles from './styles.module.scss';

const TABS = [
    { key: 'province', label: 'Tỉnh / TP' },
    { key: 'district', label: 'Quận / Huyện' },
    { key: 'ward', label: 'Phường / Xã' },
];

const emptyAdmin = { province: null, district: null, ward: null };

function normalized(s) {
    return (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function keywordForTab(keyword, tab) {
    const parts = keyword.split(/[,/]/).map((s) => s.trim()).filter(Boolean);
    if (tab === 'province') return parts[0] || keyword;
    if (tab === 'district') return parts[1] || parts[0] || keyword;
    return parts[2] || parts[parts.length - 1] || keyword;
}

function stripAdminPrefix(s) {
    return normalized(s).replace(
        /^(tinh|thanh pho|quan|huyen|thi xa|phuong|xa)\s+/,
        ''
    );
}

function AddressPicker({ open, onClose, value, onChange, keyword = '' }) {
    const [tab, setTab] = useState('province');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    // Effect 1: luôn load tỉnh khi mở popup
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetchProvinces()
            .then(setProvinces)
            .finally(() => setLoading(false));
    }, [open]);

    // Effect 2: sync tab + load quận/phường nếu đã chọn trước đó
    useEffect(() => {
        if (!open || !value?.province?.code) return;

        setTab(value.ward ? 'ward' : value.district ? 'ward' : 'district');

        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const d = await fetchDistricts(value.province.code);
                if (cancelled) return;
                setDistricts(d);

                if (value?.district?.code) {
                    const w = await fetchWards(value.district.code);
                    if (!cancelled) setWards(w);
                } else {
                    setWards([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [open, value?.province?.code, value?.district?.code]);

    // chọn tỉnh/TP
    const selectProvince = async (item) => {
        onChange({ ...emptyAdmin, province: item });
        setTab('district');
        setLoading(true);
        const list = await fetchDistricts(item.code);
        if (!open) return; // Popup đã đóng — không setState trên component unmount
        setDistricts(list);
        setWards([]);
        setLoading(false);
    };

    // chọn quận/Huyện
    const selectDistrict = async (item) => {
        onChange({
            province: value.province,
            district: item,
            ward: null,
        });
        setTab('ward');
        setLoading(true);
        const list = await fetchWards(item.code);
        if (!open) return;
        setWards(list);
        setLoading(false);
    };

    // chọn phường/Xã
    const selectWard = (item) => {
        onChange({
            province: value.province,
            district: value.district,
            ward: item,
        });
        onClose();
    };

    if (!open) return null;

    // lấy danh sách tương ứng với tab
    const list =
        tab === 'province' ? provinces
        : tab === 'district' ? districts
        : wards;

    // hàm chọn tương ứng với tab
    const onSelect =
        tab === 'province' ? selectProvince
        : tab === 'district' ? selectDistrict
        : selectWard;

    // tìm kiếm tự động
    const raw = keyword.trim();
    const q = raw
        ? stripAdminPrefix(keywordForTab(raw, tab)) || normalized(keywordForTab(raw, tab))
        : '';

    // lọc danh sách
    const filteredList = q
        ? list.filter((item) => {
              const name = normalized(item.name);
              return (
                  name.includes(q) ||
                  q.split(/\s+/).filter(Boolean).every((w) => name.includes(w))
              );
          })
        : list;

    // lấy mã tương ứng với tab
    const selectedCode =
        tab === 'province' ? value?.province?.code
        : tab === 'district' ? value?.district?.code
        : value?.ward?.code;

    return (
        <div className={styles.root}>
            <div className={styles.tabs}>
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        className={tab === key ? styles.tabActive : styles.tab}
                        disabled={
                            (key === 'district' && !value?.province) ||
                            (key === 'ward' && !value?.district)
                        }
                        onClick={() => setTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className={styles.list}>
                {loading && <p className={styles.hint}>Đang tải...</p>}
                {!loading && filteredList.length === 0 && (
                    <p className={styles.hint}>Không có kết quả</p>
                )}
                {!loading &&
                    filteredList.map((item) => (
                        <button
                            key={item.code}
                            type="button"
                            className={
                                selectedCode === item.code
                                    ? styles.itemActive
                                    : styles.item
                            }
                            onClick={() => onSelect(item)}
                        >
                            {item.name}
                        </button>
                    ))}
            </div>
        </div>
    );
}

export default AddressPicker;
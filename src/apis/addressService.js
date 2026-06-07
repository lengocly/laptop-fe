// file này là API địa chỉ
import axios from 'axios';

// API công khai, không qua axiosClient Laravel
const client = axios.create({
    baseURL: 'https://provinces.open-api.vn/api',
    timeout: 15000,
});

/** Danh sách Tỉnh/TP */
export async function fetchProvinces() {
    const { data } = await client.get('/p/');
    return data; // [{ code, name, ... }]
}

/** Quận/Huyện theo mã tỉnh */
export async function fetchDistricts(provinceCode) {
    const { data } = await client.get(`/p/${provinceCode}`, {
        params: { depth: 2 },
    });
    return data.districts || [];
}

/** Phường/Xã theo mã quận */
export async function fetchWards(districtCode) {
    const { data } = await client.get(`/d/${districtCode}`, {
        params: { depth: 2 },
    });
    return data.wards || [];
}
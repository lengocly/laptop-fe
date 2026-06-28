import axiosClient from './axiosClient';
export function getProvinces() {
    return axiosClient.get('/shipping/provinces').then((res) => res.data.provinces ?? []);
}
export function getDistricts(provinceId) {
    return axiosClient
        .get('/shipping/districts', { params: { province_id: provinceId } })
        .then((res) => res.data.districts ?? []);
}
export function getWards(districtId) {
    return axiosClient
        .get('/shipping/wards', { params: { district_id: districtId } })
        .then((res) => res.data.wards ?? []);
}
export function calculateShippingFee(body) {
    return axiosClient.post('/shipping/calculate-fee', body).then((res) => res.data);
}


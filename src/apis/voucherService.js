import axiosClient from './axiosClient';
export function getPublicVouchers() {
    return axiosClient.get('/vouchers');
}
export function saveVoucher(voucherId) {
    return axiosClient.post(`/vouchers/${voucherId}/save`);
}
export function getMySavedVouchers() {
    return axiosClient.get('/me/vouchers');
}
export function validateVoucher({ subtotal, voucher_id, voucher_code }) {
    return axiosClient.post('/vouchers/validate', {
        subtotal,
        voucher_id,
        voucher_code,
    });
}


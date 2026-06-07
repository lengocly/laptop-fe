import axiosClient from './axiosClient';

// ===== API voucher cho user (trang chủ, checkout) =====

// Danh sách voucher đang active — trang chủ
export function getPublicVouchers() {
    return axiosClient.get('/vouchers');
}

// User lưu voucher vào tài khoản (cần đăng nhập)
export function saveVoucher(voucherId) {
    return axiosClient.post(`/vouchers/${voucherId}/save`);
}

// Voucher đã lưu, chưa dùng — dùng ở checkout
export function getMySavedVouchers() {
    return axiosClient.get('/me/vouchers');
}

// Kiểm tra voucher trước khi đặt hàng
export function validateVoucher({ subtotal, voucher_id, voucher_code }) {
    return axiosClient.post('/vouchers/validate', {
        subtotal,
        voucher_id,
        voucher_code,
    });
}

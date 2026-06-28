import axiosClient from './axiosClient';
export function getAdminOrders() {
    return axiosClient.get('/admin/orders');
}
export function updateOrderStatus(orderId, status, note = '') {
    return axiosClient.patch(`/admin/orders/${orderId}/status`, {
        status,
        note: note || undefined,
    });
}
export function getAdminOrder(orderId) {
    return axiosClient.get(`/admin/orders/${orderId}`);
}
export function cancelAdminOrder(orderId) {
    return axiosClient.patch(`/admin/orders/${orderId}/cancel`);
}
export function sendOrderInvoice(orderId) {
    return axiosClient.post(`/admin/orders/${orderId}/send-invoice`);
}
export function getAdminProducts(params = {}) {
    return axiosClient.get('/admin/products', { params });
}
export function getAdminProduct(id) {
    return axiosClient.get(`/admin/products/${id}`);
}
export function createProduct(body) {
    return axiosClient.post('/admin/products', body);
}
export function updateProduct(id, body) {
    return axiosClient.put(`/admin/products/${id}`, body);
}
export function deleteProduct(id) {
    return axiosClient.delete(`/admin/products/${id}`);
}
export function uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/admin/products/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
export function getAdminVouchers(params = {}) {
    return axiosClient.get('/admin/vouchers', { params });
}
export function getAdminVoucher(id) {
    return axiosClient.get(`/admin/vouchers/${id}`);
}
export function createVoucher(body) {
    return axiosClient.post('/admin/vouchers', body);
}
export function updateVoucher(id, body) {
    return axiosClient.put(`/admin/vouchers/${id}`, body);
}
export function deleteVoucher(id) {
    return axiosClient.delete(`/admin/vouchers/${id}`);
}
export function toggleVoucherActive(id) {
    return axiosClient.patch(`/admin/vouchers/${id}/toggle`);
}
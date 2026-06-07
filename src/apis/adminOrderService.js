import axiosClient from './axiosClient';

//API service trên frontend để gọi các route admin mà bạn đã tạo trong backend. Đây là cách frontend giao tiếp với backend để quản lý đơn hàng

//Admin xem danh sách đơn hàng
export function getAdminOrders() {
    return axiosClient.get('/admin/orders');
}

//Admin đổi trạng thái giao hàng
export function updateOrderStatus(orderId, status, note = '') {
    return axiosClient.patch(`/admin/orders/${orderId}/status`, {
        status,
        note: note || undefined,
    });
}
// Gọi API có token Sanctum (axiosClient đã gắn sẵn token vào header Authorization).

//Admin xem chi tiết đơn hàng
export function getAdminOrder(orderId) {
    return axiosClient.get(`/admin/orders/${orderId}`);
}

//Admin hủy đơn hàng
export function cancelAdminOrder(orderId) {
    return axiosClient.patch(`/admin/orders/${orderId}/cancel`);
}

//Admin gửi hóa đơn qua email
export function sendOrderInvoice(orderId) {
    return axiosClient.post(`/admin/orders/${orderId}/send-invoice`);
}

//Admin xem danh sách sản phẩm
export function getAdminProducts(params = {}) {
    return axiosClient.get('/admin/products', { params });
}
//Admin xem chi tiết sản phẩm
export function getAdminProduct(id) {
    return axiosClient.get(`/admin/products/${id}`);
}
//Admin thêm sản phẩm
export function createProduct(body) {
    return axiosClient.post('/admin/products', body);
}
//Admin sửa sản phẩm
export function updateProduct(id, body) {
    return axiosClient.put(`/admin/products/${id}`, body);
}
//Admin xóa sản phẩm
export function deleteProduct(id) {
    return axiosClient.delete(`/admin/products/${id}`);
}

//Admin upload ảnh sản phẩm
export function uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file); // tên field phải khớp BE: 'image'

    return axiosClient.post('/admin/products/upload-image', formData, {
        headers: {
            // Bắt buộc: axiosClient mặc định application/json → upload hỏng
            'Content-Type': 'multipart/form-data',
        },
    });
}

// ===== Admin voucher =====
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
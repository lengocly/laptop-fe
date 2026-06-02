import axiosClient from './axiosClient';

//API service trên frontend để gọi các route admin mà bạn đã tạo trong backend. Đây là cách frontend giao tiếp với backend để quản lý đơn hàng

//Admin xem danh sách đơn hàng
export function getAdminOrders() {
    return axiosClient.get('/admin/orders');
}

//Admin đổi trạng thái giao hàng
export function updateOrderStatus(orderId, status) {
    return axiosClient.patch(`/admin/orders/${orderId}/status`, { status });
}
// Gọi API có token Sanctum (axiosClient đã gắn sẵn token vào header Authorization).
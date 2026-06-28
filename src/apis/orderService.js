import axiosClient from './axiosClient';
export function createOrder(payload) {
    return axiosClient.post('/orders', payload);
}
export function getMyOrders() {
    return axiosClient.get('/orders');
}
export function cancelOrder(orderId) {
    return axiosClient.patch(`/orders/${orderId}/cancel`);
}
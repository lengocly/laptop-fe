import axiosClient from './axiosClient';

//Đặt hàng
export function createOrder(payload) {
    return axiosClient.post('/orders', payload);
}

//lịch sử mua hàng
export function getMyOrders() {
    return axiosClient.get('/orders');
}
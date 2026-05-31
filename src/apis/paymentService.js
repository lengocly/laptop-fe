import axiosClient from './axiosClient';

// tạo phiên thanh toán Stripe cho đơn hàng
export function createPaymentIntent(orderId) {
    return axiosClient.post('/payment/intent', { order_id: orderId });
}

// sau khi thanh toán thành công để backend kiểm tra lại với Stripe rồi cập nhật đơn
export const confirmPayment = (orderId, paymentIntentId) => {
    return axiosClient.post('/payment/confirm', {
        order_id: orderId,
        payment_intent_id: paymentIntentId,
    });
};
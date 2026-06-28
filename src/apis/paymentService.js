import axiosClient from './axiosClient';
export function createPaymentIntent(orderId) {
    return axiosClient.post('/payment/intent', { order_id: orderId });
}
export const confirmPayment = (orderId, paymentIntentId) => {
    return axiosClient.post('/payment/confirm', {
        order_id: orderId,
        payment_intent_id: paymentIntentId,
    });
};
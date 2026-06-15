export const ORDER_STATUS_LABEL = {
    pending_payment: 'Chờ thanh toán',
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipping: 'Đã giao cho vận chuyển',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
};

export const PAYMENT_STATUS_LABEL = {
    paid: 'Đã thanh toán',
    unpaid: 'Chờ thanh toán',
    failed: 'Thanh toán thất bại',
    expired: 'Hết hạn thanh toán',
    refunded: 'Đã hoàn tiền',
    requires_refund: 'Cần hoàn tiền',
};

/** Tuỳ chọn lọc danh sách đơn (hiển thị mọi trạng thái legacy). */
export const ORDER_STATUS_FILTER_OPTIONS = Object.entries(ORDER_STATUS_LABEL).map(
    ([value, label]) => ({ value, label }),
);

/** Chỉ các bước fulfillment admin API chấp nhận — không gồm pending_payment. */
export const ADMIN_FULFILLMENT_LABEL = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipping: 'Đã giao cho vận chuyển',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
};

const FULFILLMENT_FLOW = {
    pending: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
    pending_payment: [],
};

/** Trả về các bước chuyển hợp lệ tiếp theo cho admin (legacy status). */
export function getAdminFulfillmentOptions(currentStatus) {
    const next = FULFILLMENT_FLOW[currentStatus] ?? ['cancelled'];

    return next.map((value) => ({
        value,
        label: ADMIN_FULFILLMENT_LABEL[value] ?? value,
    }));
}

// Khách được hủy khi chưa xác nhận giao hàng và chưa thanh toán
export const canCustomerCancelOrder = (order) => {
    if (!order) return false;
    if (order.payment_status === 'paid') return false;
    if (order.order_status === 'cancelled' || order.status === 'cancelled') return false;
    if (order.order_status === 'pending_payment') return true;
    return order.status === 'pending' || order.fulfillment_status === 'unfulfilled';
};

/** Stripe chưa trả — cho phép mở lại trang thanh toán. */
export const canRetryStripePayment = (order) => {
    if (!order) return false;
    if (order.payment_method !== 'stripe') return false;
    if (order.payment_status !== 'unpaid') return false;
    if (order.order_status === 'cancelled' || order.status === 'cancelled') return false;

    return order.order_status === 'pending_payment' || order.status === 'pending_payment';
};

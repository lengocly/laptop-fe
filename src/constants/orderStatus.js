export const ORDER_STATUS_LABEL = {
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
};

//biến object thành array để hiển thị trong select
export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABEL)
    .map(([value, label]) => ({ value, label }));

// Khách được hủy khi admin chưa xác nhận
export const canCustomerCancelOrder = (status) => status === 'pending';
const footerColumns = [
    {
        title: 'Mua sắm',
        links: [
            { label: 'Trang chủ', to: '/' },
            { label: 'Cửa hàng', to: '/cua-hang' },
            { label: 'Giới thiệu', to: '/gioi-thieu' },
            { label: 'Liên hệ', to: '/lien-he' },
        ],
    },
    {
        title: 'Tài khoản',
        links: [
            { label: 'Đăng nhập', to: '/dang-nhap' },
            { label: 'Đơn hàng của tôi', to: '/don-hang-cua-toi' },
            { label: 'Quản lý tài khoản', to: '/tai-khoan' },
        ],
    },
    {
        title: 'Tin tức',
        links: [
            {
                label: 'TOP laptop sinh viên 2026',
                to: '/gioi-thieu/bai-viet/chon-laptop-sinh-vien-2026',
            },
            {
                label: 'Đánh giá MacBook Pro 14 M3',
                to: '/gioi-thieu/bai-viet/danh-gia-macbook-pro-14-m3',
            },
            {
                label: 'TOP phụ kiện laptop 2026',
                to: '/gioi-thieu/bai-viet/top-phu-kien-laptop-2026',
            },
        ],
    },
];

const footerContact = {
    hotline: '1900 1234',
    email: 'support@betatech.vn',
    address: '175 Tây Sơn, P. Quang Trung, Q. Đống Đa, Hà Nội',
    hours: '9:00 – 21:00 (T2 – CN)',
};

const paymentMethods = ['Visa', 'Mastercard', 'COD', 'Stripe'];

export { footerColumns, footerContact, paymentMethods };

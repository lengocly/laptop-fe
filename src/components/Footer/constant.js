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
                label: 'Chọn laptop sinh viên 2026',
                to: '/gioi-thieu/bai-viet/chon-laptop-sinh-vien-2026',
            },
            {
                label: 'Đánh giá MacBook Air M3',
                to: '/gioi-thieu/bai-viet/danh-gia-macbook-air-m3',
            },
            {
                label: 'Trả góp 0% tại BetaTech',
                to: '/gioi-thieu/bai-viet/betatech-tra-gop-0-phan-tram',
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

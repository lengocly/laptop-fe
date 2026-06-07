// lưu trữ data header

const dataBoxIcon = [
    { type: 'fb', href: '#' },
    { type: 'ins', href: '#' },
    { type: 'ytb', href: '#' }
];

const dataMenu = [
    { content: 'Trang chủ', href: '/' },
    { content: 'Cửa hàng', href: '/cua-hang' },
    { content: 'Giới thiệu', href: '/gioi-thieu' },
    { content: 'Liên hệ', href: '/lien-he' },
    // href '#' — mở SearchOverlay trong Header, không điều hướng trang
    { content: 'Tìm kiếm', href: '#', action: 'search' },
    { content: 'Đăng nhập', href: '#' }
];

export { dataBoxIcon, dataMenu };

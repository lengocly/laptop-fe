/**
 * constants.js — Nội dung trang Liên hệ
 * Sửa thông tin liên hệ / địa chỉ / link map ở đây.
 */

export const contactPageMeta = {
    pageTitle: 'Liên hệ BetaTech',
    pageSubtitle:
        'Tư vấn laptop chính hãng, hỗ trợ đơn hàng và đặt lịch trải nghiệm tại showroom',
};

// Thông tin liên hệ chính — hiển thị ở khối đầu trang
export const contactInfo = {
    hotline: '1900 1234',
    hotlineNote: 'Miễn phí cuộc gọi — hỗ trợ tư vấn & bảo hành',
    email: 'support@betatech.vn',
    emailNote: 'Phản hồi trong vòng 24 giờ làm việc',
    address: '175 Tây Sơn, P. Quang Trung, Q. Đống Đa, Hà Nội',
    workingHours: '9:00 – 21:00 (Thứ 2 – Chủ nhật)',
};

// Thông tin pháp lý công ty
export const companyInfo = {
    name: 'CÔNG TY TNHH BETATECH',
    taxCode: '0312345678',
    representative: 'Nguyễn Văn Beta',
};

// Showroom — mô tả trải nghiệm tại cửa hàng
export const showroomInfo = {
    title: 'Showroom BetaTech — Hà Nội',
    description:
        'Ghé showroom để trải nghiệm laptop thật, so sánh cấu hình và nhận tư vấn trực tiếp ' +
        'từ đội ngũ kỹ thuật BetaTech.',
    highlights: [
        'Trưng bày laptop Dell, Lenovo, HP, Asus, MSI, Apple chính hãng',
        'Hỗ trợ cài đặt phần mềm, kiểm tra máy trước khi giao',
        'Thanh toán tiền mặt, chuyển khoản, thẻ và trả góp 0%',
        'Bãi đỗ xe miễn phí — thuận tiện trên trục Tây Sơn',
    ],
};

// Kênh hỗ trợ khách hàng
export const supportChannels = [
    {
        id: 'tu-van',
        title: 'Tư vấn mua hàng',
        description:
            'Gọi hotline hoặc đến showroom để được gợi ý cấu hình phù hợp ngân sách và nhu cầu.',
    },
    {
        id: 'don-hang',
        title: 'Theo dõi đơn hàng',
        description:
            'Kiểm tra trạng thái đơn qua email xác nhận hoặc liên hệ hotline với mã đơn hàng.',
    },
    {
        id: 'bao-hanh',
        title: 'Bảo hành & kỹ thuật',
        description:
            'Hỗ trợ kích hoạt bảo hành hãng, tiếp nhận máy bảo hành và tư vấn nâng cấp phần cứng.',
    },
];

export const policyLinks = [
    { label: 'Chính sách vận chuyển', href: '#' },
    { label: 'Chính sách đổi trả', href: '#' },
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Chính sách bảo hành', href: '#' },
];

// Google Maps — địa chỉ showroom
export const mapConfig = {
    title: 'Showroom BetaTech — Hà Nội',
    address: '175 Tây Sơn, P. Quang Trung, Q. Đống Đa, Hà Nội',
    // iframe embed (không cần API key)
    embedUrl:
        'https://maps.google.com/maps?q=175+T%C3%A2y+S%C6%A1n,+Quang+Trung,+%C4%90%E1%BB%91ng+%C4%90a,+H%C3%A0+N%E1%BB%99i,+Vietnam&hl=vi&z=17&output=embed',
    // Mở Google Maps chỉ đường (tab mới)
    directionsUrl:
        'https://www.google.com/maps/dir/?api=1&destination=175+T%C3%A2y+S%C6%A1n,+Quang+Trung,+Đống+Đa,+Hà+Nội',
};

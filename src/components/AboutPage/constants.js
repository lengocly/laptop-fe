/**
 * constants.js — Nội dung trang Giới thiệu & bài viết blog
 * Sửa text giới thiệu / thẻ tin tức / nội dung bài viết ở đây.
 */

export const aboutPageMeta = {
    pageTitle: 'Giới thiệu về BetaTech',
    pageSubtitle: 'Câu chuyện thương hiệu và tin tức công nghệ từ BetaTech',
};

export const aboutSections = [
    {
        id: 've-betatech',
        heading: 'Về BetaTech',
        paragraphs: [
            'BetaTech chuyên cung cấp laptop và tablet chính hãng với giá minh bạch, ' +
                'tư vấn cấu hình phù hợp nhu cầu học tập, làm việc và doanh nghiệp.',
            'Chúng tôi phân phối các thương hiệu Dell, Lenovo ThinkPad, HP, Asus, MSI và Apple — ' +
                'cam kết hàng chính hãng, bảo hành đầy đủ theo hãng.',
        ],
    },
    {
        id: 'tam-nhin',
        heading: 'Tầm nhìn & Sứ mệnh',
        quote:
            'BetaTech hướng tới trở thành điểm đến đáng tin cậy, giúp khách hàng chọn đúng sản phẩm ' +
            'và có trải nghiệm mua sắm tuyệt vời từ tư vấn đến hậu mãi.',
    },
    {
        id: 'gia-tri',
        heading: 'Giá trị cốt lõi',
        values: [
            'Sự hài lòng của khách hàng là trọng tâm',
            'Trung thực trong kinh doanh — minh bạch giá và cấu hình',
            'Chất lượng sản phẩm chính hãng, bảo hành đầy đủ',
            'Khách hàng là giá trị lớn nhất',
        ],
    },
    {
        id: 'triet-ly',
        heading: 'Triết lý kinh doanh',
        quote:
            'BetaTech chân thành cảm ơn sự tin tưởng của quý khách. ' +
            'Chúng tôi không ngừng cải thiện dịch vụ để đồng hành cùng khách hàng ' +
            'trên hành trình công nghệ.',
    },
];

/** Chuẩn hóa blocks — mọi bài viết dùng `blocks` */
function normalizeArticleBlocks(article) {
    return article.blocks ?? [];
}

// Thẻ tin tức — ảnh dùng path DB (products/...) → /storage/..., cùng nguồn với Cửa hàng
export const aboutNewsCards = [
    {
        id: 1,
        slug: 'chon-laptop-sinh-vien-2026',
        category: 'Hướng dẫn',
        date: '08 Tháng 06, 2026',
        author: 'BetaTech',
        title: 'TOP 4 laptop sinh viên 2026 đáng mua nhất',
        excerpt:
            'RAM 16GB, SSD 512GB và pin trâu — gợi ý 4 mẫu laptop phù hợp học tập, làm đồ án và học online.',
        image: 'products/asus1.jpg',
        blocks: [
            {
                type: 'p',
                text:
                    'Mỗi năm học mới, sinh viên lại đứng trước hàng chục lựa chọn laptop từ 12 đến 25 triệu. Thay vì chỉ nhìn thông số, hãy chọn theo nhu cầu thực tế: đa nhiệm mượt, pin đủ dùng cả buổi, màn sắc nét và trọng lượng vừa balo. Dưới đây là 4 mẫu BetaTech khuyên dùng cho sinh viên năm 2026.',
            },
            {
                type: 'h2',
                text: '5 tiêu chí chọn laptop sinh viên',
            },
            {
                type: 'p',
                text:
                    'RAM tối thiểu 16GB, SSD từ 512GB, màn Full HD IPS 14–15.6 inch, pin thực tế từ 6–8 giờ và CPU Core i5 / Ryzen 5 thế hệ mới. Sinh viên CNTT, thiết kế nên ưu tiên máy có RAM cao và SSD nhanh để chạy IDE, Figma hay môi trường ảo.',
            },
            {
                type: 'img',
                src: 'products/l2.webp',
                alt: 'Sinh viên học nhóm với laptop',
                caption: 'Laptop sinh viên cần cân bằng hiệu năng, pin và trọng lượng khi mang đi học.',
            },
            {
                type: 'h2',
                text: '1. ASUS Vivobook 15 — giá tốt, RAM 16GB',
            },
            {
                type: 'p',
                text:
                    'Core i5-1335U kết hợp 16GB RAM và SSD 512GB — đủ mở nhiều tab, Zoom và VS Code cùng lúc. Màn 15.6 inch rộng, phù hợp ngành kinh tế, luật, ngoại ngữ cần không gian đọc tài liệu.',
            },
            {
                type: 'product',
                productId: 1,
                name: 'ASUS Vivobook 15',
                price: '15.990.000 ₫',
                image: 'products/asus1.jpg',
            },
            {
                type: 'h2',
                text: '2. Lenovo IdeaPad Slim 5 — mỏng nhẹ, đa nhiệm tốt',
            },
            {
                type: 'p',
                text:
                    'Ryzen 5 5500U, 16GB RAM, SSD 512GB — xử lý mượt Office, trình duyệt và phần mềm học tập. Thiết kế slim dễ bỏ balo, bàn phím gõ thoải mái cho thời gian làm đồ án dài.',
            },
            {
                type: 'product',
                productId: 4,
                name: 'Lenovo IdeaPad Slim 5',
                price: '16.990.000 ₫',
                image: 'products/l1.webp',
            },
            {
                type: 'h2',
                text: '3. Dell Inspiron 14 — gọn, dễ di chuyển',
            },
            {
                type: 'h3',
                text: 'Phù hợp ai?',
            },
            {
                type: 'p',
                text:
                    'Sinh viên hay di chuyển giữa các cơ sở, ưu tiên màn 14 inch gọn hơn 15 inch. Ryzen 5 7530U đủ cho học online và soạn thảo văn bản cả ngày.',
            },
            {
                type: 'product',
                productId: 2,
                name: 'Dell Inspiron 14',
                price: '18.490.000 ₫',
                image: 'products/dell1.jpg',
            },
            {
                type: 'h2',
                text: '4. HP Pavilion 15 — màn lớn, SSD 512GB',
            },
            {
                type: 'p',
                text:
                    'Nếu bạn cần màn 15.6 inch cho Excel, thiết kế slide và xem bài giảng, HP Pavilion 15 với Core i5 là lựa chọn cân bằng trong tầm giá dưới 18 triệu.',
            },
            {
                type: 'product',
                productId: 5,
                name: 'HP Pavilion 15',
                price: '17.490.000 ₫',
                image: 'products/h1.webp',
            },
            {
                type: 'h2',
                text: 'Kết luận',
            },
            {
                type: 'p',
                text:
                    'Chọn laptop sinh viên theo ngân sách và thói quen: màn lớn (ASUS/HP), mỏng nhẹ (Lenovo), di động (Dell). Ghé BetaTech để cầm thử trọng lượng và gõ thử bàn phím trước khi mua.',
            },
        ],
    },
    {
        id: 2,
        slug: 'danh-gia-macbook-pro-14-m3',
        category: 'Review',
        date: '02 Tháng 06, 2026',
        author: 'BetaTech',
        title: 'Đánh giá MacBook Pro 14 M3: Có đáng mua?',
        excerpt:
            'Chip M3 mạnh, màn Retina sắc nét, pin trâu — phân tích chi tiết cho sinh viên và dân văn phòng.',
        image: 'products/mac1.png',
        blocks: [
            {
                type: 'p',
                text:
                    'MacBook Pro 14 inch với chip Apple M3 là lựa chọn cao cấp cho người cần hiệu năng ổn định, màn hình đẹp và thời lượng pin vượt trội. Bài viết này tổng hợp trải nghiệm thực tế tại showroom BetaTech để bạn quyết định có nên đầu tư hay không.',
            },
            {
                type: 'h2',
                text: 'Điểm mạnh nổi bật',
            },
            {
                type: 'p',
                text:
                    'Chip M3 xử lý mượt duyệt web, chỉnh sửa ảnh Lightroom, chạy Figma và biên dịch code. Màn Liquid Retina 14.2 inch sắc nét, độ sáng cao — làm việc ngoài trời vẫn nhìn rõ. Máy gần như im lặng nhờ thiết kế tản nhiệt hiệu quả.',
            },
            {
                type: 'img',
                src: 'products/mac2.png',
                alt: 'MacBook trên bàn làm việc',
                caption: 'MacBook Pro 14 phù hợp creator và sinh viên ngành thiết kế, CNTT có ngân sách cao hơn.',
            },
            {
                type: 'h2',
                text: 'Pin và di động',
            },
            {
                type: 'p',
                text:
                    'Trong sử dụng hỗn hợp (lướt web, gõ văn bản, họp online), MacBook Pro 14 trụ 10–12 giờ — vượt hầu hết laptop Windows cùng tầm. Trọng lượng khoảng 1.6 kg, vẫn mang đi học hoặc làm việc quán cà phê thoải mái.',
            },
            {
                type: 'h2',
                text: 'Hạn chế cần cân nhắc',
            },
            {
                type: 'h3',
                text: 'Phần mềm và cổng kết nối',
            },
            {
                type: 'p',
                text:
                    'Một số phần mềm Windows đặc thù (AutoCAD bản đầy đủ, phần mềm kế toán chuyên ngành) có thể không chạy native trên macOS. Cổng Thunderbolt/USB 4 hạn chế — nếu cần nhiều màn hình ngoài, hãy mua hub. RAM và SSD không nâng cấp sau mua, nên chọn 16GB/512GB ngay từ đầu.',
            },
            {
                type: 'h2',
                text: 'MacBook Pro 14 tại BetaTech',
            },
            {
                type: 'p',
                text:
                    'Cấu hình 16GB RAM, SSD 512GB, chip M3 — giá niêm yết minh bạch, bảo hành chính hãng Apple. Nếu bạn đã dùng iPhone hoặc iPad, Handoff và AirDrop giúp đồng bộ file và clipboard liền mạch.',
            },
            {
                type: 'product',
                productId: 3,
                name: 'MacBook Pro 14',
                price: '42.990.000 ₫',
                image: 'products/mac1.png',
            },
            {
                type: 'h2',
                text: 'Kết luận',
            },
            {
                type: 'p',
                text:
                    'MacBook Pro 14 M3 đáng mua nếu bạn ưu tiên pin, màn hình và hiệu năng ổn định lâu dài — không phụ thuộc phần mềm Windows. Đây là khoản đầu tư phù hợp sinh viên thiết kế, developer và nhân viên văn phòng cao cấp.',
            },
        ],
    },
    {
        id: 3,
        slug: 'top-phu-kien-laptop-2026',
        category: 'Tư vấn',
        date: '28 Tháng 05, 2026',
        author: 'BetaTech',
        title: 'TOP 4 phụ kiện laptop nên mua kèm năm 2026',
        excerpt:
            'Chuột, bàn phím và tai nghe chính hãng — nâng trải nghiệm học tập, làm việc và giải trí sau khi có laptop.',
        image: 'products/c1.webp',
        blocks: [
            {
                type: 'p',
                text:
                    'Mua laptop xong chưa đủ — chuột, bàn phím và tai nghe tốt giúp bạn gõ thoải mái hơn, học online rõ tiếng và chơi game chính xác hơn. Dưới đây là 4 phụ kiện BetaTech bán chạy, phù hợp sinh viên và dân văn phòng.',
            },
            {
                type: 'h2',
                text: 'Chọn phụ kiện theo nhu cầu',
            },
            {
                type: 'p',
                text:
                    'Học online cần tai nghe có mic rõ. Lập trình và soạn văn bản nên có bàn phím gõ êm. Game nhẹ hoặc thiết kế cần chuột độ nhạy cao, cảm biến tốt. Ưu tiên hàng chính hãng để bảo hành và độ bền.',
            },
            {
                type: 'img',
                src: 'products/b1.webp',
                alt: 'Bàn phím và chuột trên bàn làm việc',
                caption: 'Combo phụ kiện phù hợp giúp tăng năng suất khi dùng laptop cả ngày.',
            },
            {
                type: 'h2',
                text: '1. Chuột Logitech G102 — giá rẻ, dùng tốt mọi việc',
            },
            {
                type: 'p',
                text:
                    'G102 là chuột gaming phổ thông bán chạy nhất: cảm biến chính xác, 6 nút lập trình được, đèn RGB tùy chỉnh. Dùng học tập, làm việc và chơi LOL, Valorant đều ổn trong tầm giá dưới 500 nghìn.',
            },
            {
                type: 'product',
                productId: 6,
                name: 'Chuột Logitech G102',
                price: '390.000 ₫',
                image: 'products/c1.webp',
            },
            {
                type: 'h2',
                text: '2. Chuột Razer DeathAdder — cầm tay thoải mái',
            },
            {
                type: 'p',
                text:
                    'Ergonomic ôm tay phải, cảm biến chính xác cao — phù hợp game thủ và designer cần thao tác chuột lâu mà không mỏi cổ tay.',
            },
            {
                type: 'product',
                productId: 7,
                name: 'Chuột Razer DeathAdder',
                price: '890.000 ₫',
                image: 'products/ch1.webp',
            },
            {
                type: 'h2',
                text: '3. Bàn phím Keychron K2 — gõ sước, hỗ trợ Mac/Win',
            },
            {
                type: 'h3',
                text: 'Ai nên chọn Keychron K2?',
            },
            {
                type: 'p',
                text:
                    'Sinh viên CNTT, content creator cần bàn phím cơ compact 75%, kết nối Bluetooth và có dây. Switch đủ tactile, gõ lâu vẫn thoải mái — đặc biệt khi code hoặc soạn luận dài.',
            },
            {
                type: 'product',
                productId: 8,
                name: 'Bàn phím Keychron K2',
                price: '1.890.000 ₫',
                image: 'products/b1.webp',
            },
            {
                type: 'h2',
                text: '4. Tai nghe Sony WH-CH520 — nhẹ, pin lâu',
            },
            {
                type: 'p',
                text:
                    'Tai nghe Bluetooth nhẹ, pin đến 50 giờ, mic đủ rõ cho học online và họp nhóm. Âm thanh cân bằng, đeo lâu không đau tai — lựa chọn an toàn trong tầm 1–1.5 triệu.',
            },
            {
                type: 'product',
                productId: 10,
                name: 'Tai nghe Sony WH-CH520',
                price: '1.290.000 ₫',
                image: 'products/t1.webp',
            },
            {
                type: 'h2',
                text: 'Kết luận',
            },
            {
                type: 'p',
                text:
                    'Không cần mua hết một lúc — ưu tiên chuột và tai nghe nếu học online nhiều, thêm bàn phím khi ngân sách cho phép. Xem thêm phụ kiện tại cửa hàng BetaTech hoặc mục Cửa hàng trên website.',
            },
        ],
    },
];

/** Tìm bài viết theo slug — dùng cho trang chi tiết */
export function getBlogArticleBySlug(slug) {
    const card = aboutNewsCards.find((item) => item.slug === slug);
    if (!card) return null;
    return { ...card, blocks: normalizeArticleBlocks(card) };
}

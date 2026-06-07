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

// 3 thẻ tin tức — hiển thị trên trang Giới thiệu, click vào mở trang chi tiết
export const aboutNewsCards = [
    {
        id: 1,
        slug: 'chon-laptop-sinh-vien-2026',
        category: 'Hướng dẫn',
        date: '08 Tháng 06, 2026',
        title: 'Chọn laptop sinh viên 2026: 5 tiêu chí quan trọng',
        excerpt:
            'RAM 16GB, SSD 512GB và pin 8 giờ là bộ ba tối thiểu cho học tập và làm đồ án mượt mà.',
        image:
            'https://macstores.vn/wp-content/uploads/2026/03/macbook-pro-m5-16-inch-pro-max-silver-1.jpg',
        content: [
            'Năm học mới sắp bắt đầu, nhu cầu mua laptop cho sinh viên lại tăng mạnh. Tuy nhiên, thị trường có quá nhiều lựa chọn từ 12 đến 25 triệu đồng khiến nhiều bạn phân vân không biết nên ưu tiên tiêu chí nào. Dưới đây là 5 tiêu chí BetaTech khuyến nghị khi chọn laptop sinh viên năm 2026.',
            'Tiêu chí đầu tiên là RAM tối thiểu 16GB. Các phần mềm học tập hiện nay như Visual Studio Code, Figma, Adobe Photoshop hay môi trường ảo lập trình đều tiêu tốn bộ nhớ đáng kể. RAM 8GB chỉ đủ cho tác vụ văn phòng cơ bản; với 16GB, bạn có thể mở nhiều tab trình duyệt, chạy IDE và Zoom cùng lúc mà không bị giật lag.',
            'Thứ hai, ổ cứng SSD từ 512GB trở lên. SSD giúp máy khởi động nhanh, mở ứng dụng gần như tức thì và giảm thời gian chờ khi lưu file đồ án. Sinh viên ngành thiết kế, kiến trúc hay truyền thông nên cân nhắc 1TB nếu thường xuyên làm việc với file dung lượng lớn.',
            'Thứ ba, thời lượng pin thực tế từ 8 giờ trở lên. Không phải lúc nào bạn cũng ngồi gần ổ cắm điện trong thư viện hay phòng học nhóm. Một chiếc laptop pin trâu giúp bạn yên tâm học cả buổi sáng mà không cần mang theo sạc — tiêu chí này đặc biệt quan trọng với sinh viên di chuyển nhiều giữa các cơ sở.',
            'Thứ tư, màn hình 14–15.6 inch Full HD (1920×1080) với tấm nền IPS. Kích thước này cân bằng giữa di động và không gian hiển thị — đủ rộng để đọc tài liệu, xem slide bài giảng mà vẫn vừa balo. Tấm nền IPS cho góc nhìn rộng, màu sắc ổn định khi làm việc nhóm.',
            'Cuối cùng, cân nhắc CPU phù hợp ngành học. Sinh viên kinh tế, luật, ngoại ngữ có thể chọn Intel Core i5 hoặc AMD Ryzen 5 thế hệ mới. Sinh viên CNTT, kỹ thuật, thiết kế nên ưu tiên Core i7 / Ryzen 7 hoặc chip Apple M-series nếu ngân sách cho phép — đặc biệt khi cần biên dịch code, render video hoặc chạy mô phỏng.',
            'Tại BetaTech, đội ngũ tư vấn sẵn sàng gợi ý cấu hình theo ngành học và ngân sách cụ thể. Bạn có thể đến showroom trải nghiệm trực tiếp, so sánh trọng lượng và bàn phím trước khi quyết định — vì một chiếc laptop tốt sẽ đồng hành cùng bạn suốt 4–5 năm đại học.',
        ],
    },
    {
        id: 2,
        slug: 'danh-gia-macbook-air-m3',
        category: 'Review',
        date: '02 Tháng 06, 2026',
        title: 'MacBook Air M3: Có đáng mua trong tầm giá?',
        excerpt:
            'Mỏng nhẹ, pin trâu — phù hợp sinh viên và nhân viên văn phòng cần máy di động.',
        image:
            'https://macstores.vn/wp-content/uploads/2023/01/macbook-pro-m2-pro-space-gray.jpg',
        content: [
            'MacBook Air M3 là lựa chọn phổ biến nhất trong dòng MacBook của Apple ở phân khúc tầm trung — cao. Với thiết kế mỏng nhẹ quen thuộc, chip Apple M3 mạnh mẽ và thời lượng pin ấn tượng, đây là chiếc laptop được nhiều sinh viên và dân văn phòng quan tâm. Vậy MacBook Air M3 có thực sự đáng mua trong tầm giá hiện tại?',
            'Điểm mạnh đầu tiên là hiệu năng. Chip M3 với 8 nhân CPU và GPU tích hợp xử lý mượt mà các tác vụ hàng ngày: duyệt web, soạn thảo văn bản, họp video, chỉnh sửa ảnh cơ bản trên Lightroom. Với sinh viên ngành thiết kế đồ họa, M3 còn xử lý tốt Figma và Illustrator ở mức trung bình mà không cần quạt tản nhiệt — máy gần như im lặng khi làm việc.',
            'Thiết kế và trải nghiệm sử dụng là lý do thứ hai nhiều người chọn MacBook Air. Vỏ nhôm nguyên khối nặng khoảng 1.24 kg, dày 11.3 mm — dễ bỏ vào balo, cầm tay đi học hay đi cà phê làm việc. Màn hình Liquid Retina 13.6 inch sắc nét, độ sáng 500 nits đủ dùng ngoài trời có bóng râm. Trackpad Force Touch lớn và bàn phím Magic Keyboard mang lại cảm giác gõ thoải mái trong thời gian dài.',
            'Pin là thế mạnh không thể bỏ qua. Apple công bố lên đến 18 giờ xem video; trong sử dụng thực tế hỗn hợp (lướt web, gõ văn bản, họp online), BetaTech ghi nhận máy trụ được 10–12 giờ — vượt xa hầu hết laptop Windows cùng phân khúc. Đây là lợi thế lớn cho người thường xuyên di chuyển hoặc làm việc ở nơi không có ổ cắm điện.',
            'Tuy nhiên, MacBook Air M3 cũng có hạn chế cần cân nhắc. Cổng kết nối chỉ có 2 cổng Thunderbolt/USB 4 và jack tai nghe — nếu cần nhiều màn hình ngoài hoặc USB-A, bạn phải mua hub riêng. RAM và SSD không nâng cấp được sau khi mua, nên nên chọn tối thiểu 16GB/512GB ngay từ đầu. Ngoài ra, một số phần mềm chuyên ngành trên Windows (AutoCAD bản đầy đủ, phần mềm kế toán đặc thù) có thể không tương thích hoặc cần giải pháp thay thế.',
            'Về giá, MacBook Air M3 13 inch (16GB/512GB) tại BetaTech nằm trong tầm 28–32 triệu đồng tùy chương trình khuyến mãi. So với laptop Windows cùng cấu hình, mức giá cao hơn nhưng bù lại bằng tuổi thọ pin, độ bền vỏ máy và hệ sinh thái macOS ổn định. Nếu bạn đã quen iPhone hoặc iPad, tính năng Handoff và AirDrop giúp đồng bộ công việc liền mạch.',
            'Kết luận: MacBook Air M3 đáng mua nếu bạn ưu tiên sự mỏng nhẹ, pin trâu, màn hình đẹp và không phụ thuộc phần mềm Windows độc quyền. Đây là lựa chọn xuất sắc cho sinh viên, nhân viên văn phòng, content creator mới bắt đầu. Ghé BetaTech để trải nghiệm thực tế và nhận tư vấn cấu hình phù hợp trước khi đầu tư.',
        ],
    },
    {
        id: 3,
        slug: 'betatech-tra-gop-0-phan-tram',
        category: 'Tin tức',
        date: '28 Tháng 05, 2026',
        title: 'BetaTech mở rộng trả góp 0% lên đến 9 tháng',
        excerpt:
            'Khách mua laptop chính hãng có thêm lựa chọn trả góp linh hoạt, thủ tục nhanh tại quầy.',
        image:
            'https://macstores.vn/wp-content/uploads/2026/03/macbook-pro-m5-16-inch-pro-max-silver-1.jpg',
        content: [
            'Từ ngày 28/05/2026, BetaTech chính thức mở rộng chương trình trả góp 0% lãi suất lên đến 9 tháng cho khách hàng mua laptop và tablet chính hãng tại showroom. Đây là bước đi nhằm giúp sinh viên, giáo viên và nhân viên văn phòng sở hữu máy tính chất lượng mà không cần thanh toán một lần số tiền lớn.',
            'Theo chương trình mới, khách hàng có thể chọn kỳ hạn trả góp 3, 6 hoặc 9 tháng với lãi suất 0% qua các đối tác tài chính uy tín mà BetaTech hợp tác. Đơn hàng từ 5 triệu đồng trở lên đều đủ điều kiện tham gia. Không thu phí chuyển đổi trả góp, không yêu cầu trả trước tối thiểu — chỉ cần CMND/CCCD và số điện thoại chính chủ để hoàn tất hồ sơ tại quầy.',
            'Thủ tục tại BetaTech được rút gọn tối đa. Nhân viên tư vấn sẽ hỗ trợ điền form, chụp giấy tờ và gửi duyệt trực tiếp trên hệ thống. Thời gian phê duyệt trung bình từ 10–15 phút trong giờ hành chính. Sau khi duyệt, khách mang laptop về ngay trong ngày — không cần chờ giải ngân qua ngày như một số kênh khác.',
            'Chương trình áp dụng cho đa số sản phẩm đang kinh doanh: MacBook, Dell XPS, Lenovo ThinkPad, HP Pavilion, Asus Vivobook, MSI gaming và các dòng tablet iPad, Samsung Galaxy Tab. Một số mặt hàng giảm giá sâu hoặc đã dùng voucher đặc biệt có thể không kết hợp trả góp — nhân viên sẽ thông báo rõ trước khi thanh toán.',
            'Ví dụ thực tế: MacBook Air M3 giá 29.990.000đ, chọn trả góp 9 tháng 0%, khách trả khoảng 3.332.000đ mỗi tháng (chưa tính phí giao dịch ngân hàng nếu có). Laptop Dell Inspiron 15 giá 15.990.000đ, trả góp 6 tháng, mỗi tháng khoảng 2.665.000đ. Mức trả hàng tháng được hiển thị minh bạch trên phiếu tính tiền trước khi khách ký xác nhận.',
            'BetaTech cam kết không ép khách chọn kỳ hạn dài hơn nhu cầu và luôn giải thích rõ nghĩa vụ trả nợ hàng tháng. Đội ngũ tư vấn được đào tạo về quy định tài chính tiêu dùng, đảm bảo khách hiểu đầy đủ trước khi ký hợp đồng trả góp với đối tác ngân hàng.',
            'Để biết thêm chi tiết hoặc kiểm tra sản phẩm cụ thể có áp dụng trả góp hay không, vui lòng liên hệ hotline BetaTech, ghé showroom tại 175 Tây Sơn, Đống Đa, Hà Nội hoặc đặt hàng online và chọn "Trả góp 0%" khi thanh toán. Chương trình có thể kết thúc sớm khi hết hạn mức ưu đãi từ đối tác tài chính.',
        ],
    },
];

/** Tìm bài viết theo slug — dùng cho trang chi tiết */
export function getBlogArticleBySlug(slug) {
    return aboutNewsCards.find((card) => card.slug === slug) ?? null;
}

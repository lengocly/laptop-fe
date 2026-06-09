/**
 * =============================================================================
 * HomePage — Trang chủ BetaTech
 * =============================================================================
 * Luồng từ trên xuống:
 *  1. MyHeader      — menu, giỏ, đăng nhập
 *  2. Banner        — carousel 3 ảnh hero
 *  3. Info          — thanh 4 lợi ích (giao hàng, bảo hành…)
 *  4. AdvanceHeadling — tiêu đề "Sản phẩm nổi bật"
 *  5. HeadingListProduct — countdown khuyến mãi
 *  5b. VoucherSection — mã giảm giá (Lưu voucher)
 *  6. PopularProduct — carousel SP lướt ngang ‹ ›
 *  7. SaleHomepage  — banner sale
 *  8. MyFooter
 *
 * Dữ liệu SP:
 * - useEffect gọi getProducts() một lần khi vào trang
 * - listProducts → truyền hết vào PopularProduct → ProductSlider
 *
 * Luồng: MySQL → Laravel API → getProducts → listProducts → ProductItem
 * =============================================================================
 */
import MyHeader from '@components/Header/Header';
import Banner from '@components/Banner/Banner';
import AdvanceHeadling from '@components/AdvanceHeadling/AdvanceHeadling';
import Info from '@components/Info/Info';
import HeadingListProduct from '@components/HeadingListProduct/HeadingListProducts';
import VoucherSection from '@components/VoucherSection/VoucherSection';
import { useEffect, useState } from 'react';
import { getProducts } from '@/apis/productsService';
import PopularProduct from '@components/PopularProduct/PopularProduct';
import SaleHomepage from '@components/SaleHomepage/SaleHomepage';
import MyFooter from '@components/Footer/Footer';

function HomePage() {
    const [listProducts, setListProducts] = useState([]);

    // Tải danh sách SP từ backend khi mở trang chủ
    useEffect(() => {
        getProducts()
            .then((res) => {
                setListProducts(res.contents ?? []);
            })
            .catch(() => {
                setListProducts([]); // API lỗi — không để carousel crash
            });
    }, []);

    return (
        <>
            <MyHeader />

            {/* Hero 3 ảnh — header nằm trên (z-index Header) */}
            <Banner />
            {/* Thanh đen 4 cột — đè lên đáy banner */}
            <Info />

            <AdvanceHeadling />

            {/* Đếm ngược deal — không kèm SP (carousel ở dưới) */}
            <HeadingListProduct />

            {/* Voucher Shopee-style — giữa countdown và carousel */}
            <VoucherSection />

            {/* Tiêu đề section SP — ngay trên carousel */}
            <AdvanceHeadling
                subtitle="KHÁM PHÁ NGAY"
                title="Gợi ý cho bạn"
                compact
            />

            {/* Carousel toàn bộ SP — ProductSlider */}
            <PopularProduct data={listProducts} />

            <SaleHomepage />
            <MyFooter />
        </>
    );
}

export default HomePage;

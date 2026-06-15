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
 *  6b. ProductReviewSection — review video YouTube + link SP
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
import ScrollReveal from '@components/ScrollReveal/ScrollReveal';
import { useEffect, useState } from 'react';
import { getProducts } from '@/apis/productsService';
import PopularProduct from '@components/PopularProduct/PopularProduct';
import ProductReviewSection from '@components/ProductReviewSection/ProductReviewSection';
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
            <Info />

            <ScrollReveal variant="up">
                <AdvanceHeadling />
            </ScrollReveal>

            <ScrollReveal variant="scale" delay={80}>
                <HeadingListProduct />
            </ScrollReveal>

            <ScrollReveal variant="up" delay={120}>
                <VoucherSection />
            </ScrollReveal>

            <ScrollReveal variant="fade" delay={60}>
                <AdvanceHeadling
                    subtitle="KHÁM PHÁ NGAY"
                    title="Gợi ý cho bạn"
                    compact
                />
            </ScrollReveal>

            <ScrollReveal variant="up" delay={100}>
                <PopularProduct data={listProducts} />
            </ScrollReveal>

            <ScrollReveal variant="up" delay={80}>
                <ProductReviewSection />
            </ScrollReveal>

            <ScrollReveal variant="scale">
                <SaleHomepage />
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={80}>
                <MyFooter />
            </ScrollReveal>
        </>
    );
}

export default HomePage;

import MyHeader from '@components/Header/Header';
import Banner from '@components/Banner/Banner';
import AdvanceHeadling from '@components/AdvanceHeadling/AdvanceHeadling';
import Info from '@components/Info/Info';
import FeaturedCategories from '@components/FeaturedCategories/FeaturedCategories';
import HeadingListProduct from '@components/HeadingListProduct/HeadingListProducts';
import ScrollReveal from '@components/ScrollReveal/ScrollReveal';
import { lazy, Suspense, useEffect, useState } from 'react';
import { getProducts } from '@/apis/productsService';
const VoucherSection = lazy(() => import('@components/VoucherSection/VoucherSection'));
const PopularProduct = lazy(() => import('@components/PopularProduct/PopularProduct'));
const ProductReviewSection = lazy(() => import('@components/ProductReviewSection/ProductReviewSection'));
const SaleHomepage = lazy(() => import('@components/SaleHomepage/SaleHomepage'));
const MyFooter = lazy(() => import('@components/Footer/Footer'));
function SectionFallback() {
    return <div style={{ minHeight: 120 }} aria-hidden />;
}
function HomePage() {
    const [listProducts, setListProducts] = useState([]);
    useEffect(() => {
        getProducts()
            .then((res) => {
                setListProducts(res.contents ?? []);
            })
            .catch(() => {
                setListProducts([]);
            });
    }, []);
    return (
        <>
            <MyHeader />
            <Banner />
            <Info />
            <ScrollReveal variant="up" delay={60}>
                <FeaturedCategories />
            </ScrollReveal>
            <ScrollReveal variant="up">
                <AdvanceHeadling />
            </ScrollReveal>
            <ScrollReveal variant="scale" delay={80}>
                <HeadingListProduct />
            </ScrollReveal>
            <ScrollReveal variant="up" delay={120}>
                <Suspense fallback={<SectionFallback />}>
                    <VoucherSection />
                </Suspense>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={60}>
                <AdvanceHeadling
                    subtitle="KHÁM PHÁ NGAY"
                    title="Gợi ý cho bạn"
                    compact
                />
            </ScrollReveal>
            <ScrollReveal variant="up" delay={100}>
                <Suspense fallback={<SectionFallback />}>
                    <PopularProduct data={listProducts} />
                </Suspense>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={80}>
                <Suspense fallback={<SectionFallback />}>
                    <ProductReviewSection />
                </Suspense>
            </ScrollReveal>
            <ScrollReveal variant="scale">
                <Suspense fallback={<SectionFallback />}>
                    <SaleHomepage />
                </Suspense>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={80}>
                <Suspense fallback={<SectionFallback />}>
                    <MyFooter />
                </Suspense>
            </ScrollReveal>
        </>
    );
}
export default HomePage;


/**
 * =============================================================================
 * PopularProduct — Khối "Sản phẩm nổi bật" trên trang chủ
 * =============================================================================
 * - Chỉ bọc layout 1250px (MainLayout) và truyền data xuống ProductSlider.
 * - Tiêu đề "Sản phẩm nổi bật" nằm ở AdvanceHeadling (phía trên).
 *
 * Props data: toàn bộ listProducts từ HomePage (API getProducts).
 * =============================================================================
 */
import MainLayout from '@components/Layout/Layout';
import ProductSlider from '@components/ProductSlider/ProductSlider';

function PopularProduct({ data }) {
    return (
        <MainLayout>
            <ProductSlider data={data} />
        </MainLayout>
    );
}

export default PopularProduct;

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


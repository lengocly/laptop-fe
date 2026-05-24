/**
 * =============================================================================
 * NHIỆM VỤ FILE NÀY (PopularProduct)
 * =============================================================================
 * - Hiển thị LƯỚI các sản phẩm “phổ biến / còn lại” trên trang chủ.
 *
 * Props `data`:
 * - Mảng sản phẩm do HomePage truyền vào (thường là từ phần tử thứ 3 trở đi sau slice).
 *
 * data.map:
 * - Duyệt từng item; mỗi item render một ProductItem với images[0], images[1], name, price.
 * - key={item.id}: giúp React phân biệt phần tử khi list thay đổi (tránh lỗi hiển thị).
 * =============================================================================
 */
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import ProductItem from '@components/ProductItem/ProductItem';

function PopularProduct({ data }) {
    const { container } = styles;
    return (
        <>
            <MainLayout>
                <div className={container}>
                    {data.map((item) => (
                        <ProductItem
                            key={item.id}
                            id={item.id}
                            src={item.images[0]}
                            prevSrc={item.images[1]}
                            name={item.name}
                            price={item.price}
                            priceOriginal={item.price_original}
                        />
                    ))}
                </div>
            </MainLayout>
        </>
    );
}

export default PopularProduct;

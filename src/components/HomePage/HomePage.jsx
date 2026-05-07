import MyHeader from '@components/Header/Header';
import Banner from '@components/Banner/Banner';
import AdvanceHeadling from '@components/AdvanceHeadling/AdvanceHeadling';
import Info from '@components/Info/Info';
import HeadingListProduct from '@components/HeadingListProduct/HeadingListProducts';
import { useEffect } from 'react';
import { getProducts } from '@/apis/productsService';
import PopularProduct from '@components/PopularProduct/PopularProduct';
import { useState } from 'react';
import SaleHomepage from '@components/SaleHomepage/SaleHomepage';
import MyFooter from '@components/Footer/Footer';

// chứa tất cả trang web
function HomePage() {
    //tạo ra const để lưu giá trị
    const [listProducts, setListProducts] = useState([]); //giá trị khởi tạo là mảng rỗng

    // call api
    useEffect(() => {
        //dữ liệu từ hàm getProduct của productService trả về
        getProducts().then((res) => {
            setListProducts(res.contents);
            //console.log(res);
        }); //.then là lấy ra dữ liệu vì đang trạng thái promis
    }, []);

    //console.log(listProducts, 'listProducts');

    //đầu tiên chạy sẽ là mảng rỗng sau đó thực thi đến call back của useEffect và call API, thành công sử dụng setListProducts để ném cục DAta từ API đó vào trong listProducts để lưu trữ thì khi đấy ffc sẽ đc render lại và nhận đc dữ liệu consolog mà dl set vào còn useEffect sẽ ko chạy lần nào nữa bởi vì đang mảng rỗng

    return (
        <>
            {/* Các thanh công cụ đầu trang */}
            <MyHeader />
            <Banner />

            <Info />
            <AdvanceHeadling />

            {/* tại vì phần này có 2 ảnh thoi */}
            <HeadingListProduct data={listProducts.slice(0, 2)} />

            {/* từ 2 đến hết */}
            <PopularProduct data={listProducts.slice(2, listProducts.length)} />

            <SaleHomepage />
            <MyFooter />
        </>
    );
}

export default HomePage;

import { lazy } from 'react';

// chỉ tải component khi nó được sử dụng, giúp giảm thời gian tải trang ban đầu và cải thiện hiệu suất của ứng dụng
const routers = [
    {
        path: '/',
        component: lazy(() => import('@components/HomePage/HomePage'))
    },
    {
        path: '/dang-nhap',
        component: lazy(() => import('@components/LoginPage/LoginPage'))
    },
    {
        path: '/product/:id',
        component: lazy(() => import('@components/ProductDetailPage/ProductDetailPage'))
    }, 
    {
        path: '/cua-hang',
        component: lazy(() => import('@components/StorePage/StorePage'))
    },
    {
        path: '/checkout',
        component: lazy(() => import('@components/CheckoutPage/CheckoutPage')),
    },
    // thanh toán Stripe
    {
        path: '/thanh-toan/:orderId',
        component: lazy(() => import('@components/PaymentPage/PaymentPage'))
    },

    // lịch sử mua hàng
    {
        path: '/don-hang-cua-toi',
        component: lazy(() => import('@components/MyOrdersPage/MyOrdersPage')),
    },
];

export default routers;

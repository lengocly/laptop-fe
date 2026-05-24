import { lazy } from 'react';

// chỉ tải component khi nó được sử dụng, giúp giảm thời gian tải trang ban đầu và cải thiện hiệu suất của ứng dụng
const routers = [
    {
        path: '/',
        component: lazy(() => import('@components/HomePage/HomePage'))
    },
    {
        path: '/blog',
        component: lazy(() => import('@components/Blog/Blog'))
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
    }
];

export default routers;

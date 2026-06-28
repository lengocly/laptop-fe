import { lazy } from 'react';
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
        path: '/so-sanh',
        component: lazy(() => import('@components/ComparePage/ComparePage'))
    },
    {
        path: '/gioi-thieu/bai-viet/:slug',
        component: lazy(() => import('@components/AboutPage/BlogDetailPage'))
    },
    {
        path: '/gioi-thieu',
        component: lazy(() => import('@components/AboutPage/AboutPage'))
    },
    {
        path: '/lien-he',
        component: lazy(() => import('@components/ContactPage/ContactPage'))
    },
    {
        path: '/checkout',
        component: lazy(() => import('@components/CheckoutPage/CheckoutPage')),
    },
    {
        path: '/thanh-toan/:orderId',
        component: lazy(() => import('@components/PaymentPage/PaymentPage'))
    },
    {
        path: '/don-hang-cua-toi',
        component: lazy(() => import('@components/MyOrdersPage/MyOrdersPage')),
    },
    {
        path: '/tai-khoan',
        component: lazy(() => import('@components/AccountPage/AccountPage')),
    },
    {
        path: '/admin/dashboard',
        component: lazy(() => import('@components/Admin/AdminDashboardPage/AdminDashboardPage')),
    },
    {
        path: '/admin/don-hang',
        component: lazy(() => import('@components/Admin/AdminOrdersPage/AdminOrdersPage')),
    },
    {
        path: '/admin/don-hang/:orderId',
        component: lazy(() => import('@components/Admin/AdminOrderDetailPage/AdminOrderDetailPage')),
    },
    {
        path: '/admin/nguoi-dung',
        component: lazy(() => import('@components/Admin/AdminUsersPage/AdminUsersPage')),
    },
    {
        path: '/admin/nguoi-dung/:userId',
        component: lazy(() => import('@components/Admin/AdminUserDetailPage/AdminUserDetailPage')),
    },
    {
        path: '/admin/san-pham',
        component: lazy(() => import('@components/Admin/AdminProductsPage/AdminProductsPage')),
    },
    {
        path: '/admin/san-pham/tao',
        component: lazy(() => import('@components/Admin/AdminProductFormPage/AdminProductFormPage')),
    },
    {
        path: '/admin/san-pham/:id',
        component: lazy(() => import('@components/Admin/AdminProductFormPage/AdminProductFormPage')),
    },
    {
        path: '/admin/voucher',
        component: lazy(() => import('@components/Admin/AdminVouchersPage/AdminVouchersPage')),
    },
    {
        path: '/admin/voucher/tao',
        component: lazy(() => import('@components/Admin/AdminVoucherFormPage/AdminVoucherFormPage')),
    },
    {
        path: '/admin/voucher/:id',
        component: lazy(() => import('@components/Admin/AdminVoucherFormPage/AdminVoucherFormPage')),
    },
    {
        path: '/admin/danh-muc',
        component: lazy(() => import('@components/Admin/AdminCategoriesPage/AdminCategoriesPage')),
    },
    {
        path: '/admin/danh-muc/tao',
        component: lazy(() => import('@components/Admin/AdminCategoryFormPage/AdminCategoryFormPage')),
    },
    {
        path: '/admin/danh-muc/:id',
        component: lazy(() => import('@components/Admin/AdminCategoryFormPage/AdminCategoryFormPage')),
    },
];
export default routers;


/**
 * =============================================================================
 * NHIỆM VỤ FILE NÀY (productsService)
 * =============================================================================
 * - Gom các hàm gọi API liên quan SẢN PHẨM vào một chỗ (dễ đọc, dễ bảo trì).
 *
 * HÀM getProducts():
 * - Gửi request GET tới /product (nối với baseURL trong axiosClient).
 * - Laravel trả JSON; axios bọc trong res.data → thường là { contents: [...] }.
 * - return res.data để component (HomePage) dùng trực tiếp: res.contents là mảng SP.
 *
 * HÀM getProductById(id):
 * - GET /product/{id} → { product: { ... } } cho trang chi tiết.
 *
 * async/await: hàm bất đồng bộ vì gọi mạng; HomePage có thể .then() hoặc await.
 * =============================================================================
 */
import axiosClient from './axiosClient';

//categorySlug là tên danh mục sản phẩm
const getProducts = async (categorySlug) => {
    //nếu có categorySlug thì thêm vào params, nếu không thì truyền rỗng
    const params = categorySlug ? { category: categorySlug } : {};

    //gọi API với params
    const res = await axiosClient.get('/products', { params });
    return res.data;
};

//Chi tiết sản phẩm
const getProductById = async (id) => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
};

export { getProducts, getProductById };

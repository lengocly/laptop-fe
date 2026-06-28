import axiosClient from './axiosClient';
const getProducts = async ({ categorySlug = null, groupSlug = null } = {}) => {
    const params = {};
    if (categorySlug) params.category = categorySlug;
    if (groupSlug) params.group = groupSlug;
    const res = await axiosClient.get('/products', { params });
    return res.data;
};
const getProductById = async (id) => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
};
export { getProducts, getProductById };


import axiosClient from './axiosClient';
export function getAdminCategories() {
    return axiosClient.get('/admin/categories');
}
export function createCategory(payload) {
    return axiosClient.post('/admin/categories', payload);
}
export function updateCategory(id, payload) {
    return axiosClient.put(`/admin/categories/${id}`, payload);
}
export function deleteCategory(id) {
    return axiosClient.delete(`/admin/categories/${id}`);
}
export function uploadCategoryImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/admin/categories/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}


import axiosClient from './axiosClient';

// ===== Admin — quản lý danh mục =====

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

// Upload ảnh icon từ máy → lưu storage/categories/
export function uploadCategoryImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/admin/categories/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

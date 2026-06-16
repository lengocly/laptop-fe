import axiosClient from './axiosClient';

export function getAdminUsers(params = {}) {
    return axiosClient.get('/admin/users', { params });
}

export function getAdminUser(id) {
    return axiosClient.get(`/admin/users/${id}`);
}

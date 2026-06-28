import axiosClient from './axiosClient';
export function searchByImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/search/by-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
}
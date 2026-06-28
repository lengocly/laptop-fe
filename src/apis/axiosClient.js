import axios from 'axios';
export const AUTH_TOKEN_KEY = 'auth_token';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (import.meta.env.PROD && !apiBaseUrl) {
    throw new Error(
        'Thiếu VITE_API_BASE_URL trong môi trường production. Kiểm tra file .env.'
    );
}
const axiosClient = axios.create({
    baseURL: apiBaseUrl || 'http://127.0.0.1:8000/api/v1',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
});
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const hadToken = localStorage.getItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            if (hadToken && !window.location.pathname.startsWith('/login')) {
                const next = encodeURIComponent(
                    window.location.pathname + window.location.search
                );
                window.location.href = `/login?next=${next}`;
            }
        }
        return Promise.reject(error);
    }
);
export default axiosClient;



import axios from 'axios';

//Key lưu token trong localStorage
export const AUTH_TOKEN_KEY = 'auth_token';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Production bắt buộc có base URL — tránh gọi nhầm localhost
if (import.meta.env.PROD && !apiBaseUrl) {
    throw new Error(
        'Thiếu VITE_API_BASE_URL trong môi trường production. Kiểm tra file .env.'
    );
}

//Tạo 1 client dùng chung, không lặp cấu hình
const axiosClient = axios.create({
    baseURL: apiBaseUrl || 'http://127.0.0.1:8000/api/v1',
    timeout: 60000, //60s
    headers: {
        'Content-Type': 'application/json'
    }
});

//Interceptor = “móc” chạy trước/sau mỗi request/response của axiosClient
axiosClient.interceptors.request.use((config) => {

    //Lấy token đã lưu lúc login
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    //Chưa login → không gắn header (OK cho /products, /login)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; //Đúng format Sanctum
    }
    return config; //Bắt buộc trả config để Axios gửi request
});

// Token hết hạn → xóa token và chuyển về trang đăng nhập
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

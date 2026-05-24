
import axios from 'axios';

//Key lưu token trong localStorage
export const AUTH_TOKEN_KEY = 'auth_token';

//Tạo 1 client dùng chung, không lặp cấu hình
const axiosClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        'http://127.0.0.1:8000/api/v1',
    timeout: 10000, //10s
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


export default axiosClient;

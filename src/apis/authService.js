import axiosClient, { AUTH_TOKEN_KEY } from './axiosClient';

//register — Đăng ký
const register = async (data) => {
    const res = await axiosClient.post('/register', data);
    return res.data; // { message: "Đăng ký thành công..." }
};

//login — Đăng nhập
const login = async ({ email, password }) => {
    const res = await axiosClient.post('/login', { email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
    return res.data; // { user, token }
};

//logout — Đăng xuất
const logout = async () => {
    try {
        await axiosClient.post('/logout');
    } finally {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
};

//getUser — User hiện tại
const getUser = async () => {
    const res = await axiosClient.get('/user');
    return res.data; // object user
};

//updateProfile — Cập nhật thông tin tài khoản
const updateProfile = async ({ name, email }) => {
    const res = await axiosClient.put('/user/profile', { name, email });
    return res.data; // { message, user }
};

//updatePassword — Đổi mật khẩu
const updatePassword = async ({ current_password, password, password_confirmation }) => {
    const res = await axiosClient.put('/user/password', {
        current_password,
        password,
        password_confirmation,
    });
    return res.data; // { message }
};

export { register, login, logout, getUser, updateProfile, updatePassword };
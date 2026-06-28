import axiosClient, { AUTH_TOKEN_KEY } from './axiosClient';
const register = async (data) => {
    const res = await axiosClient.post('/register', data);
    return res.data;
};
const login = async ({ email, password }) => {
    const res = await axiosClient.post('/login', { email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
    return res.data;
};
const logout = async () => {
    try {
        await axiosClient.post('/logout');
    } finally {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
};
const getUser = async () => {
    const res = await axiosClient.get('/user');
    return res.data;
};
const updateProfile = async ({ name, email }) => {
    const res = await axiosClient.put('/user/profile', { name, email });
    return res.data;
};
const updatePassword = async ({ current_password, password, password_confirmation }) => {
    const res = await axiosClient.put('/user/password', {
        current_password,
        password,
        password_confirmation,
    });
    return res.data;
};
export { register, login, logout, getUser, updateProfile, updatePassword };
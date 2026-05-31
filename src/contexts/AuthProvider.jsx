import { createContext, useState, useEffect } from 'react';
import { AUTH_TOKEN_KEY } from '@/apis/axiosClient';
import { login as loginApi, logout as logoutApi, register as registerApi, getUser } from '@/apis/authService';

//AuthContext — Tạo “ống” để component khác bơm vào / hút ra user, login, logout
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mở app: có token thì lấy thông tin user
    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const data = await getUser();
                setUser(data);
            } catch {
                localStorage.removeItem(AUTH_TOKEN_KEY);
            } finally {
                setLoading(false);
            }
        };
        checkLogin();
    }, []);

    const login = async (email, password) => {
        const data = await loginApi({ email, password });
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await logoutApi();
        setUser(null);
        //CartProvider tự xóa giỏ khi user = null
    };

    //Chỉ gọi API đăng ký, không setUser (chưa verify mail).
    const register = async (formData) => {
        return registerApi(formData);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
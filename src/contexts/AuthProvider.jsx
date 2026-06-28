import { createContext, useState, useEffect } from 'react';
import { AUTH_TOKEN_KEY } from '@/apis/axiosClient';
import {
    login as loginApi,
    logout as logoutApi,
    register as registerApi,
    getUser,
    updateProfile as updateProfileApi,
} from '@/apis/authService';
export const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
    };
    const register = async (formData) => {
        return registerApi(formData);
    };
    const updateProfile = async (formData) => {
        const data = await updateProfileApi(formData);
        setUser(data.user);
        return data;
    };
    const refreshUser = async () => {
        const data = await getUser();
        setUser(data);
        return data;
    };
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_admin,
        login,
        logout,
        register,
        updateProfile,
        refreshUser,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
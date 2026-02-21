import React, { createContext, useContext, useState, useEffect } from 'react';
import authApiService from '../services/authApiService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        const token = localStorage.getItem('adminToken');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (phone, password) => {
        try {
            const data = await authApiService.login(phone, password);
            const { user, token } = data;

            setUser(user);
            localStorage.setItem('adminUser', JSON.stringify(user));
            localStorage.setItem('adminToken', token);

            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

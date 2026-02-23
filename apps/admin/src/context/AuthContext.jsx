import React, { createContext, useContext, useState, useEffect } from 'react';
import authApiService from '../services/authApiService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decoded = JSON.parse(decodedJson);
        const exp = decoded.exp;
        const now = Date.now() / 1000;
        return exp < now;
    } catch (e) {
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        toast.info("Session expired or logged out");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        const token = localStorage.getItem('adminToken');
        
        if (storedUser && token) {
            if (isTokenExpired(token)) {
                logout();
            } else {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, []);

    // Proactive token check
    useEffect(() => {
        if (!user) return;

        const checkInterval = setInterval(() => {
            const token = localStorage.getItem('adminToken');
            if (isTokenExpired(token)) {
                logout();
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkInterval);
    }, [user]);

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

    const performLogout = () => {
        logout();
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout: performLogout, isAuthenticated: !!user, loading }}>
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

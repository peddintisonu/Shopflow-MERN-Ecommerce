import { useCallback, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../api/axios";
import AuthContext from "./AuthContext.js"; // Import the context

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axiosInstance.get("/users/me");
                if (response.data && response.status === 200) {
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error.message);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const login = useCallback(async (identifier, password) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                identifier,
                password,
            });
            if (response.data) {
                setUser(response.data.data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const contextValue = useMemo(
        () => ({ user, isAuthenticated, loading, login, logout }),
        [user, isAuthenticated, loading, login, logout]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

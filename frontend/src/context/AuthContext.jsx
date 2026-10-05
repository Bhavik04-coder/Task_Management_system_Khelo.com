import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize session on initial mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await userService.getProfile();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn("Session restore failed:", err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();

    // Listen for unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  /**
   * Logs in user and sets auth state
   */
  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { access_token, user: userData } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || "Login failed");
  };

  /**
   * Registers a new account
   */
  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.success) {
      // Automatically log in after registration
      return await login(email, password);
    }
    throw new Error(res.message || "Registration failed");
  };

  /**
   * Logs out user and cleans local state
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout API call error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  /**
   * Updates locally stored user data
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

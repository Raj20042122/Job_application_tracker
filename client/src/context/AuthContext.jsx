import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jt_token") || null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("jt_token");
      const savedUser = localStorage.getItem("jt_user");

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Verify with backend silently
          const res = await api.get("/auth/me");
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem("jt_user", JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn("Session verification failed, logging out:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    const { token: receivedToken, user: receivedUser } = data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem("jt_token", receivedToken);
    localStorage.setItem("jt_user", JSON.stringify(receivedUser));
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      handleAuthSuccess(res.data);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed. Please check your credentials.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      handleAuthSuccess(res.data);
      toast.success("Account created successfully!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Registration failed. Please try again.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const res = await api.post("/auth/google", { credential });
      handleAuthSuccess(res.data);
      toast.success(`Signed in with Google as ${res.data.user.name}`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Google sign-in failed.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const demoLogin = async () => {
    try {
      const res = await api.post("/auth/demo");
      handleAuthSuccess(res.data);
      toast.success("Logged in as Demo Professional!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to start demo session.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jt_token");
    localStorage.removeItem("jt_user");
    toast.success("Logged out successfully");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("jt_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        loginWithGoogle,
        demoLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

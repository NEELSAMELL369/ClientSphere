import { createContext, useContext, useState } from "react";
import {
  loginService,
  logoutService,
  registerService,
  getProfileService,
  getAllUsersService,
} from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Current logged-in user
  const [loading, setLoading] = useState(false); // Loading state for actions
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false); // Prevent auto-fetch on every mount
  const [users, setUsers] = useState([]);       // All users (admin/manager)
  const [usersLoading, setUsersLoading] = useState(false); // Loading state for fetching users
  const [usersError, setUsersError] = useState(null);

  // ---------- INITIALIZE USER (only once) ----------
  const initializeUser = async () => {
    if (initialized) return;
    setLoading(true);
    try {
      const data = await getProfileService();
      setUser(data.user || data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    setLoading(true);
    try {
      await loginService(email, password);
      const data = await getProfileService();
      setUser(data.user || data);
      setError(null);
      setInitialized(true);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- LOGOUT ----------
  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
      setUsers([]); // Clear users on logout
    } finally {
      setLoading(false);
    }
  };

  // ---------- REGISTER ----------
  const register = async (userData) => {
    return await registerService(userData);
  };

  // ---------- FETCH ALL USERS (Admin/Manager) ----------
  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsersService();
      setUsers(data.users || data); // backend may return { users: [...] } or array directly
      setUsersError(null);
    } catch (err) {
      setUsers([]);
      setUsersError(err.message || "Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        initializeUser,
        isAuthenticated: !!user,
        users,
        usersLoading,
        usersError,
        fetchAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

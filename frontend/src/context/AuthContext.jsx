import { createContext, useContext, useState, useEffect } from "react";
import {
  loginService,
  logoutService,
  registerService,
  getProfileService,
} from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // IMPORTANT
  const [error, setError] = useState(null);

  // -------------------- AUTO LOGIN ON REFRESH --------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getProfileService();
          setUser(data.user || data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // -------------------- LOGIN --------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginService(email, password);
      await fetchProfile();
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -------------------- FETCH PROFILE --------------------
  const fetchProfile = async () => {
    try {
      const data = await getProfileService();
      setUser(data.user || data);
    } catch (err) {
      setUser(null);
    }
  };

  // -------------------- LOGOUT --------------------
  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  // -------------------- REGISTER --------------------
  const register = async (userData) => {
    return await registerService(userData);
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
        fetchProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import axios from "axios";
import { BASE_URL } from "./apiRoutes";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL, // <-- replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important: send cookies automatically
});

// Optional: global response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // handle unauthorized globally
      console.log("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

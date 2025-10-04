import axios from "axios";
import { BASE_URL } from "../api/api";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          localStorage.removeItem("token");
          window.location.href = "/auth";
          return Promise.reject(error);
        }

        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.removeItem("token");
        window.location.href = "/auth";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

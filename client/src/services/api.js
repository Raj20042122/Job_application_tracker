import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Changed to test new local features
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
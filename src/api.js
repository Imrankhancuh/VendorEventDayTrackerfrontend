import axios from "axios";

const api = axios.create({
  baseURL: "https://minivendoreventdaytrackerupdatebackend.onrender.com/api",
  timeout: 10000
});

// Global response interceptor
api.interceptors.response.use(
  (res) => res, 
  (err) => {
    if (!err.response) {
      err.message = "Backend is not connected. Please start the server.";
    }
    return Promise.reject(err);
  }
);

export default api;

import axios from 'axios'

export const BASE_URL = "http://localhost:8080";

const request = axios.create({
    // baseURL: baseUrl,
    timeout: 60000,
})

// 发送请求之前设置config
request.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
})

// 收到响应
request.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);
export default request;
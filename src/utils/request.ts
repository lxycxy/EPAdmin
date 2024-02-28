import axios from 'axios'

const baseUrl = "localhost:3000";

const instance = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
})

// 发送请求之前设置config
instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
})

// 收到响应
instance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        let error_message = '';
        const status_code = error.response.status;
        switch (status_code) {
            case 400:
                error_message = '登录过期';
                break;
            case 404:
                error_message = '地址错误';
                break;
        }
        return Promise.reject(error);
    }
);
export default instance;
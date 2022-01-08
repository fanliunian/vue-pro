import axios from "axios";
import store from "@/store";
import router from "@/router";
import {MessageBox} from "element-ui";

const service = axios.create({
    timeout: 15000 //请求超时
});

// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
service.interceptors.request.use(
    config => {
        //清除token
        // store.commit("admin/SHOW_LOADING");
        if (store.state.admin.access_token) {
            config.headers["access_token"] = store.state.admin.access_token;
            config.headers["Authorization"] = "Bearer " + store.state.admin.access_token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//拦截401重新登录
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            alert(error.response.status);
            switch (error.response.status) {
                // 401: 未登录
                case 401:
                    MessageBox.alert("登录过期或未登录，请重新登录", "登录超时", {
                        confirmButtonText: "跳转登录页",
                        callback: action => {
                            store.commit("admin/OUT_LOGIN");
                            router.replace({
                                path: "/"
                            });
                        }
                    });
                    break;
                // 404请求不存在
                case 404:
                    Toast({
                        message: "网络请求不存在",
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
);

export default service;

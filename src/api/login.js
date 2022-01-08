import config from "@/request/config";
import request from "@/request/request";
import store from "@/store";

//登录
export function getLogin(params) {
    return request({
        method: "post",
        url: config.baseLogin + "/oauth/token",
        params: params
    });
}

//登录oa平台
export function getOALogin(data) {
    return request({
        method: "get",
        url: config.baseMeet + "/login/noneValid",
        params: data
    });
}

export function getoaLogin() {
    return request({
        method: "get",
        url: config.baseMeet + "/login/noneValid",
        params: {
            authcode: localStorage.getItem("authcode")
        }
    });
}

//获取用户信息
export function getUserData() {
    return request({
        url: "/micro-service/oauthService/user/get",
        method: "post",
        params: {
            access_token: store.state.admin.access_token
        }
    });
}

//退出登录
export function outLogin() {
    return request({
        url: config.baseLogin + "/user/out",
        method: "post",
        params: {
            access_token: store.state.admin.access_token
        }
    });
}

//退出登录
export function outOALogin() {
    return request({
        method: "get",
        url: config.baseMeet + "/logout"
    });
}

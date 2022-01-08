import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import axios from "axios";
import {getToken} from "@/request/auth";
import {initOauthUrl} from "@/cas/oauth2";
import config from "@/request/config";

Vue.use(Router);

import meeting from "./modules/meeting";
import el from "element-ui/src/locale/lang/el"; //会议管理

let router = new Router({
    mode: "history", //1、hash哈希：有#号。2、history历史：没有#号
    base: process.env.BASE_URL,
    routes: [
        {
            //登录页
            path: "/",
            name: "login",
            component: () => import("@/login")
        },
        {
            //业务模块
            path: "/main",
            name: "main",
            component: () => import("@/layout"),
            redirect: "/main/home",
            children: [
                meeting //会议管理
            ]
        },
        {
            //会议通知
            path: '/main/meeting/form/meetNotices',
            name: 'meetNotices',
            component: () => import('@/pages/meeting/form/meetNotices'),
        },
        {
            //会议预约
            path: '/main/meeting/form/meetApply',
            name: 'meetApply',
            component: () => import('@/pages/meeting/form/meetApply'),
            meta: {keepAlive: false, title: "会议预约"},
        }
    ]
});
//用户信息
const user = function ({success}) {
    store.dispatch("admin/getUser").then(res => {
        if (success) {
            success();
        }
    });
};

//全局守卫，判断用户是否登录
router.beforeEach((to, from, next) => {
    /*if (to.query.authcode) {
        axios({
            method: "get",
            url: config.baseMeet + "/login/noneValid",
            params: {
                authcode: to.query.authcode,
            }
        }).then(res => {
            if (res.status === 200) {
                if (res.data.success) {
                    // store.commit("admin/LOGIN", {
                    //     token: to.query.authcode
                    // });
                    next();
                } else {
                    MessageBox.alert(res.data.message + ",请联系管理员", "登录失败", {
                        confirmButtonText: "关闭窗口",
                        callback: action => {
                            window.location.href = "about:blank";
                            window.close();
                        }
                    });
                }
            }
        })
    } else {
        next()
    }*/
    if (getToken()) {
        next();
       /* axios({
            method: "get",
            url: config.baseMeet + "/login/noneValid",
            params: {
                authcode: to.query.authcode,
            }
        }).then(res => {
            if (res.status === 200) {
                if (res.data.success) {
                    store.commit("admin/LOGIN", {
                        token: to.query.authcode
                    });
                    next();
                } else {
                    MessageBox.alert(res.data.message + ",请联系管理员", "登录失败", {
                        confirmButtonText: "关闭窗口",
                        callback: action => {
                            window.location.href = "about:blank";
                            window.close();
                        }
                    });
                }
            }
        })*/
    } else {
        next()
    }
    /*if (!getToken()) {
        let code = to.query.code;
        //判断地址是否存在code（cas带过来的）
        if (code) {
            //存在---调用单点登录的接口
            let data = {
                redirect_uri: location.origin,
                code: to.query.code
            };
            store.commit("admin/LOGIN", {
                token: to.query.code
            });
            next({path: to.path});
            // //调用接口，调用成功后加入token---路由跳转没有code的地址，
            axios({
                method: "post",
                url: process.env.VUE_APP_BASE + "/oauthService/user/accessToken",
                data
            })
                .then(res => {
                    if (res.data.status === "0") {
                        store.commit("admin/LOGIN", {
                            token: res.data.data.access_token
                        });
                        user({
                            success: () => {
                                next({path: to.path});
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            //不存在 --- 路径跳转cas登录页，登录后页面会跳转回来 并且地址栏会带一个code参数
            window.location.href = initOauthUrl();
            // initOauthUrl();
        }
    } else {
        // user({
        //     success: () => {
        //         if (to.query.code) {
        //             next({path: to.path});
        //         } else {
        //             next();
        //         }
        //     }
        // });
        next();
    }*/
});

export default router;

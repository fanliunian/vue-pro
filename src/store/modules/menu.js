import axios from "axios";
import {getToken} from "@/request/auth";
import router from "@/router";
import config from "@/request/config";

let modules = {
    namespaced: true,
    state: {
        menu: "", //用户目录
        tags: [] //tags
    },
    mutations: {
        //获取用户目录
        ["SET_MENU"](state, {menu}) {
            state.menu = menu;
        },
        //获取tag
        ["SET_TAG"](state, {tag}) {
            let isSame = false;
            //有多个标签时，将active变成false
            if (state.tags.length > 0) {
                for (let key in state.tags) {
                    if (state.tags[key].active) {
                        state.tags[key].active = false;
                    }
                }
                for (let key in state.tags) {
                    if (state.tags[key].path === tag.path) {
                        isSame = true;
                        state.tags[key].active = true;
                        break;
                    }
                }
            }

            if (!isSame) {
                let obj = {};
                obj.active = true;
                obj.path = tag.path;
                obj.label = tag.label;
                state.tags.push(obj);
            }
        },
        //删除tag
        ["CLOSE_TAG"](state, {index}) {
            let prevPath = state.tags[index - 1].path;
            for (let i = 0; i < state.tags.length; i++) {
                state.tags[i].active = false;
            }
            state.tags[index - 1].active = true;
            router.push(prevPath);
            state.tags.splice(index, 1);
        },
        //跳转标签
        ["GO_TAG"](state, {tag, index}) {
            for (let i = 0; i < state.tags.length; i++) {
                state.tags[i].active = false;
            }
            state.tags[index].active = true;
            router.push(tag.path);
        },
        //跳转清空tag
        ["CLEAR_TAG"](state, payload) {
            state.tags = [];
            if (payload.success) {
                payload.success();
            }
        }
    },
    actions: {
        getMenu({commit}) {
            return new Promise((resolve, reject) => {
                axios({
                    method: "get",
                    url: config.baseMeet + "/meetingService/meetingData/getMeetingMenu",
                    // url: 'http://192.168.21.69/standardoa/meetingService/meetingData/getMeetingMenu',
                    // headers: {
                    //     Authorization: "Bearer " + getToken()
                    // }
                }).then(res => {
                    if (res.status === 200) {
                        commit("SET_MENU", {menu: res.data.data});
                        resolve(true);
                    }
                });
            });
        }
    }
};

export default modules;

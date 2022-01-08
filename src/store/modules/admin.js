import {loadingStart} from "@/components/loading"; //loading
import {getToken, setToken, setExpiresIn, removeToken} from "@/request/auth";
import {getOALogin, getUserData} from "@/api/login";

let modules = {
   namespaced: true,
   state: {
      //token
      access_token: getToken(),
      //用户名
      username: "",
      //全名
      fullName: "",
      //loading
      loadControl: true
   },
   mutations: {
      //登录
      ["LOGIN"](state, {token}) {
         state.access_token = token;
         setToken(token);
      },
      //退出登录
      ["OUT_LOGIN"](state) {
         state.access_token = "";
         removeToken();
      },
      //获取用户名
      ["SET_USERNAME"](state, {username, fullName}) {
         state.username = username;
         state.fullName = fullName;
      },
      //展示loading
      ["SHOW_LOADING"](state) {
         state.loadControl = true;
         loadingStart();
      },
      //关闭loading
      ["HIDE_LOADING"](state) {
         state.loadControl = false;
         loadingStart();
      }
   },
   actions: {
      getUser({commit}) {
         return new Promise((resolve, reject) => {
            getUserData()
                .then(res => {
                   if (res.status === 200) {
                      if (res.data.status === "0") {
                         commit("SET_USERNAME", {
                            username: res.data.data.userinfo.accountname,
                            fullName: res.data.data.userinfo.fullname
                         });
                         let params = {
                            account: res.data.data.userinfo.accountname,
                            password: res.data.data.userinfo.password,
                         }
                         getOALogin(params)
                         resolve(true);
                      } else {
                         console.log(res.data.msg);
                      }
                   }
                })
                .catch(err => {
                   console.log(err);
                });
         });
      }
   }
};

export default modules;

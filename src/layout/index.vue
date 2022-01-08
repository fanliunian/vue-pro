<template>
  <div class="info">
    <!--头部导航栏-->
    <div class="header">
      <div class="container" style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
        <div style="font-size: 30px;color: #FFF;font-weight: bold; ">无纸化会议管理系统</div>
        <div @click="backPortal()"
             style="margin-right: 80px;color: #FFFFFF;line-height: 40px;cursor: pointer;font-size: 14px;display: flex;align-items: center;height: 40px">
        <div style="display: flex;flex-direction: row;align-items: center">
          <div>修改密码</div>
          <div style="margin-left: 5px"><img src="@/assets/images/home/sign_out.png" alt=""/></div></div>
        </div>
      </div>
      <div class="container flex_layout" style="display: none">
        <!--logo-->
        <div class="header_logo">
          <img src="../assets/images/home/logo.png" alt=""/>
        </div>
        <!--用户信息-->
        <div class="header_warp">
          <div class="header_user_info flex_layout">
            <div>换肤</div>
            <div><img src="../assets/images/home/doubt.png" alt=""/></div>
            <div><img src="../assets/images/home/notice.png" alt=""/></div>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link">
                <div class="header_user">
                  <div class="header_user_img">
                    <img src="../assets/images/home/user.png" alt=""/>
                  </div>
                  <div class="header_user_name">{{ fullname }}</div>
                  <div class="header_user_btn">
                    <img src="../assets/images/home/btn_arrow.png" alt=""/>
                  </div>
                </div>
              </div>
              <el-dropdown-menu slot="dropdown">
                <div class="header_user_menu">
                  <div>
                    <div><img src="../assets/images/home/set_up.png" alt=""/></div>
                    <div class="pl-10">个人设置</div>
                  </div>
                  <div @click="outLogin()">
                    <div><img src="../assets/images/home/sign_out.png" alt=""/></div>
                    <div class="pl-10">退出登录</div>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="header_nav">
            <!--导航-->
            <div class="header_nav_info flex_layout">
              <div
                  v-for="(item, index) in navs"
                  :key="index"
                  :class="{ header_navs: true, active: item.active }"
                  @click="ShowBorder(index, item.path)"
              >
                {{ item.title }}
              </div>
            </div>
            <!--搜索-->
            <!--                  <div class="header_nav_search">-->
            <!--                     <div>全部</div>-->
            <!--                     <div class="search_input"><input type="text" placeholder="输入内容"></div>-->
            <!--                     <div class="serach_img"><img src="../assets/images/home/search.png" alt=""></div>-->
            <!--                  </div>-->
          </div>
        </div>
      </div>
    </div>
    <!--子路由-->
    <div class="main">
      <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn  animate__slow">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {getUserData, outLogin, outOALogin} from "@/api/login";
import config from "@/request/config";

export default {
  name: "HomeIndex",
  data() {
    return {
      fullname: "",
      showmenu: false,
      navs: [
        {
          title: "无纸化会议系统",
          path: "/main/meeting"
        }
      ]
    };
  },
  created() {
    //获取用户信息
    // getUserData().then(res => {
    //    this.fullname = res.data.data.fullname
    // }).catch(err => {
    //    console.log(err);
    // })

    //改变title的字
    document.title = this.$route.meta.title;
    let inPath = this.$route.matched[1].path;
    this.InShowBorder(inPath);
  },
  methods: {
    //用户名点击隐藏、显示
    menu() {
      this.showmenu = !this.showmenu;
    },
    backPortal() {
      // console.log("backPortal-0->", process.env.VUE_APP_PORTAL)
      let url = config.baseMeet + "/org/user/userPswEdit";
      window.open(url);
    },
    ShowBorder(index, url) {
      for (let i = 0; i < this.navs.length; i++) {
        this.navs[i].active = false;
      }
      this.navs[index].active = true;
      if (url) {
        this.gopage(url);
      }
    },
    //路由跳转子路由
    gopage(url) {
      this.$router.push(url);
    },
    //初始化导航栏底部下划线
    InShowBorder(inPath) {
      switch (inPath) {
        case "/main/meeting":
          this.ShowBorder(0);
          break;
      }
    },
    //安全退出
    outLogin() {
      outLogin()
          .then(res => {
            this.$store.commit("admin/OUT_LOGIN");
            this.$router.push("/");
          })
          .catch(err => {
            console.log(err);
          });
      // outOALogin().then(res=>{
      //     console.log(res);
      // }).catch(err => {
      //     console.log(err);
      // });
    }
  },

  beforeRouteUpdate(to, from, next) {
    //路由跳转后，titile也跟着变化
    document.title = to.meta.title;
    let inPath = to.matched[1].path;
    this.InShowBorder(inPath);
    next();
  },
  activated() {
    document.title = this.$route.meta.title;
  }
};
</script>

<style scoped lang="scss">
.header {
  background: url("../assets/images/home/xabglogo.png");
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  padding-left: 40px;
  height: 110px;
  line-height: 110px;
  background-size: 100% 100%;

  //.container {
  //   position: absolute;
  //   top: 50%;
  //   left: 50px;
  //   transform: translate(0, -50%);
  //
  //   img {
  //      width: 400px;
  //      height: auto;
  //   }
  //}
}

.header_logo {
  width: 170px;
}

.header_logo img {
  margin: 0 auto;
}

.header_warp {
  width: calc(100% - 170px);
}

.header_user_info {
  justify-content: flex-end;
  padding-right: 20px;
}

.header_user_info > div {
  padding: 10px;
  color: #5b667c;
  font-size: 14px;
  cursor: pointer;
}

.header_user {
  display: flex;
  align-items: center;
  position: relative;
}

.header_user_name {
  padding-left: 5px;
  padding-right: 5px;
}

.header_user_menu {
  width: 100px;
  padding: 0 5px;
}

.header_user_menu > div {
  font-size: 14px;
  color: #626c85;
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header_user_menu > div:first-child {
  color: #238cf7;
  border-bottom: 1px dashed #626c85;
}

.header_nav {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}

.header_nav_info {
  width: 720px;
  padding-left: 20px;
}

.header_navs {
  padding: 5px 20px;
  position: relative;
  cursor: pointer;
  color: #b0bbcf;
  transition: all 0.2s ease-out 0.2s;
}

.header_navs.active {
  color: #ffffff;
}

.header_navs:after {
  content: "";
  position: absolute;
  width: 16px;
  height: 6px;
  background-color: transparent;
  border-radius: 20px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  transition: all 0.2s ease-out 0.2s;
}

/*.header_navs.active:after {*/
/*   background-color: #2491FC;*/
/*}*/

.header_nav_search {
  position: relative;
  display: flex;
  align-items: center;
  background: #4d556c;
  border-radius: 16px;
  font-size: 13px;
  color: #fff;
  padding: 10px;
  margin-left: 30px;
}

.search_input input {
  border: 0;
  color: #8791a6;
  background: transparent;
  padding-left: 10px;
  padding-right: 19px;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  outline: none;
}

.serach_img {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
}

.main {
  height: 100vh;
  padding-top: 110px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>

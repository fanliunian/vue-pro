<template>
  <div class="loginPage">
    <div class="loginContainer">
      <div class="left_item">
        <h3>Welcome</h3>
        <h4>无纸化会议管理系统</h4>
      </div>
      <div class="right_item">
            <!--<span
                class="icon_btn"
                :class="{ icon_code: !loginCode, icon_pc: loginCode }"
                @click="changeLoginCode"
            ></span>-->
        <div class="container">
          <div class="title">{{ loginTitle }}</div>
          <div class="login_pc" v-show="loginPc">
            <el-form class="login_from" status-icon ref="formData" :model="formData" label-width="80px">
              <el-form-item prop="username" label-width="0px">
                <i class="t_icon"></i>
                <el-input type="phone" placeholder="请输入用户名" v-model="formData.username"></el-input>
              </el-form-item>
              <el-form-item prop="password" label-width="0px">
                <i class="p_icon"></i>
                <el-input type="password" placeholder="请输入密码" v-model="formData.password"></el-input>
              </el-form-item>
              <el-form-item label-width="0px" prop="type">
                <el-checkbox v-model="pwdChecked" label="记住密码" name="type"></el-checkbox>
                <!--<el-checkbox v-model="loginChecked" label="自动登录" name="type"></el-checkbox>-->
              </el-form-item>
              <el-button class="submit" type="primary" @click="loginPwd">登 录</el-button>
            </el-form>
          </div>
          <!--<div class="login_note" v-show="loginNote">
            <el-form class="login_from" ref="form" :rules="rules" :model="formData" label-width="80px">
              <el-form-item prop="phone" label-width="0px">
                <i class="t_icon"></i>
                <el-input type="phone" placeholder="请输入手机号" v-model="formData.phone"></el-input>
              </el-form-item>
              <el-form-item prop="verification" label-width="0px">
                <i class="v_icon"></i>
                <el-input
                    class="line_input"
                    type="verification"
                    placeholder="验证码"
                    v-model="formData.verification"
                ></el-input>
                <img src="@/assets/images/login/yzm.png" alt=""/>
              </el-form-item>
              <el-form-item prop="message" label-width="0px" style="margin-bottom:5px">
                <i class="n_icon"></i>
                <el-input type="message" placeholder="短信验证码" v-model="formData.message"></el-input>
              </el-form-item>
              <el-button class="submit" type="primary">登 录</el-button>
            </el-form>
          </div>
          <div class="login_code" v-show="loginCode">
            <img src="@/assets/images/login/er_img.jpg" alt=""/>
            <p>扫描二维码快速登录</p>
          </div>
          <div class="handle_line" v-show="!loginCode">
            <span class="findPwd">找回密码</span>
            <span @click="changeLoginNote">{{ loginPc ? "短信登录" : "密码登录" }}</span>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validateRlues from "@/assets/js/public/rules";
import {getLogin, getOALogin} from "@/api/login";
import store from "@/store";

export default {
  data() {
    return {
      loginPc: true,
      loginCode: false,
      loginNote: false,
      formData: {
        username: "",
        password: "",
        verification: "",
        message: ""
      },
      rules: {
        phone: [
          {
            validator: validateRlues.phone,
            trigger: "blur"
          }
        ]
      },
      pwdChecked: false,
      loginChecked: false
    };
  },
  created() {
    this.pwdChecked = localStorage.getItem("pwdChecked") ? true : false;
  },
  mounted() {
    this.getCookie();
  },
  computed: {
    loginTitle() {
      if (this.loginPc) return "密码登录";
      /*if (this.loginCode) return "二维码登录";
      if (this.loginNote) return "短信登录";*/
    }
  },
  methods: {
    /* 登录方式切换 */
    changeLoginCode() {
      this.loginCode = !this.loginCode;
      this.loginPc = !this.loginCode;
      this.loginNote = this.loginPc && this.loginCode;
    },
    changeLoginNote() {
      this.loginNote = !this.loginNote;
      this.loginPc = !this.loginNote;
      this.loginCode = this.loginPc && this.loginNote;
    },
    /* 账号密码登录 */
    loginPwd() {
      if (this.pwdChecked == true) {
        localStorage.setItem("pwdChecked", true);
        this.setCookie(this.formData.username, this.formData.password, 7);
      } else {
        localStorage.removeItem("pwdChecked");
        this.clearCookie();
      }
      let Base64 = require('js-base64').Base64;
      let params = {
        account: this.formData.username,
        password: Base64.encode(this.formData.password),
        // password: "a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=",
        grant_type: "password",
        scope: "all",
        client_id: "ffcs",
        client_secret: "ffcs"
      };
      getOALogin(params)
          .then(res => {
            if(res.status===200) {
              if(res.data.success) {
                let access_token = res.data.access_token
                this.$store.commit("admin/LOGIN", {
                  username: this.formData.username,
                  access_token: access_token
                })
                this.$router.push("/main/meeting/form/conferenceDepartment");
              }else{
                this.$message.error(res.data.message);
              }
            }else{
              this.$message.error("账号或密码错误，请重试");
            }
          })
          .catch(e => {
            this.$message.error("登陆超时，请重试")
          })
      let data = {
        account: this.formData.username,
        callback: 66
      };
      //登录oa业务服务平台
      // if (this.formData.password === "4926!ffcs.V") {
      //   getOALogin(data).then(res => {
      //     console.log(res);
      //     if (res.status === 200) {
      //       this.$router.push("/main/meeting");
      //       this.$message.success("登录成功");
      //     }
      //   });
      // } else {
      //   this.$message.error("密码错误，请重新输入！");
      // }
    },
    setCookie(name, pwd, days) {
      let exdate = new Date();
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * days);
      window.document.cookie = "userName" + "=" + name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie = "userPassword" + "=" + pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    getCookie: function () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("=");
          if (arr2[0] == "userName") {
            this.formData.username = arr2[1];
          } else if (arr2[0] == "userPassword") {
            this.formData.password = arr2[1];
          }
        }
      }
    },
    clearCookie: function () {
      this.setCookie("", "", -1);
    }
  }
};
</script>
<style scoped lang="scss">
/* 表单验证样式 */
.loginPage > .el-form-item {
  position: relative;

  .el-input {
    border: 1px solid #fff;
  }

  &.is-error {
    .el-input {
      border: 1px solid #f65d5c;
      box-sizing: border-box;
    }

    // .el-input__suffix i{
    //     width:21px!important;
    //     height:21px;
    //     background:url('../assets/../assets/images/login/error_icon.png') 0 0 no-repeat;
    //     background-size: 100% 100%;
    //     right:10px!important;
    //     left:inherit!important;
    //     margin-top:-10.5px;
    //     &:before,&:after{
    //         content:'';
    //         display:none;
    //     }
    // }
  }
}

.loginPage > .el-form-item__error {
  display: inline;
  width: fit-content;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #f65d5c;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 10px;
  background: #fff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);

  .el-input {
    border: 1px solid #f65d5c;
  }
}
</style>

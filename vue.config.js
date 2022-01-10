'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'vue-pro'


const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
  publicPath: "/yun/", //配置根目录
  outputDir: "yun", //构建输出目录
  assetsDir: "assets", //静态资源目录
  lintOnSave: false, //false不开启，有效值：true || false
  productionSourceMap: false, //关闭生产环境下面的source-map
  devServer: {
    open: true, //是否启动打开浏览器
    host: "0.0.0.0", //主机，0.0.0.0支持局域网地址，可以用真机测试
    port: "8098",
    //配置跨域代理
    proxy: {
      //单点登录代理
      "/loginApi": {
        target: "http://134.130.73.210",
        //target: "http://192.168.21.167",
        changeOrigin: true, //支持跨域
        pathRewrite: {
          "^/loginApi": ""
        }
      },
      //个人事务代理
      "/bpm": {
        target: "http://192.168.21.167:8080/bpm",
        changeOrigin: true, //支持跨域
        pathRewrite: {
          "^/bpm": ""
        }
      },
      //公文管理/会议管理
      "/standardoa": {
        target: "http://134.130.73.210:8089/standardoa",
        //target: "http://192.168.21.167:8080/standardoa",
        changeOrigin: true, //支持跨域
        pathRewrite: {
          "^/standardoa": ""
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  }
}

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
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

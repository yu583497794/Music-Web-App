'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const express = require('express')
var axios = require('axios')
const app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    before(app) {
      app.get('/api/getDiscList', function (req, res) {
        // console.log(req.query)
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        // https://c.y.qq.com/splcloud/fcgi-bin/fcg_musiclist_getmyfav.fcg
        // 通过axios发送http请求
        // axios/axios: Promise based HTTP client for the browser and node.js https://github.com/axios/axios
        axios.get(url, {
          // `headers` are custom headers to be sent
          headers: {
            host: 'c.y.qq.com',
            referer: 'https://y.qq.com/',
            authority: 'u.y.qq.com',
            scheme: 'https',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6756.400 QQBrowser/10.3.2473.400'
            // cookie: 'cookie:pt2gguin=o0583497794; RK=vU7Ut5iEQ/; ptcz=75179b09307dd783ce9a77d5ea20a9a107bb42f4caf336824fc943253918201e; pgv_pvid=2022224225; o_cookie=583497794; pac_uid=1_583497794; cuid=4546319240; pgv_pvi=2505669632; pgv_info=ssid=s1781899638; ts_uid=2915816775; pgv_si=s2605672448; ptisp=edu; player_exist=1; yq_index=0; qqmusic_fromtag=66; yplayer_open=0; _qpsvr_localtk=0.24008647895473967; ts_refer=xui.ptlogin2.qq.com/cgi-bin/xlogin; yqq_stat=0; uin=o0583497794; skey=@v8MYUe9cm; luin=o0583497794; lskey=000100008301872952620fc86d17b19aa3953fbf2006b1517f9a9bb3267124cba32cd69cae2874eda2d96a56; p_uin=o0583497794; pt4_token=7OKauCou-bmzR*w35Cb8h38lDOeRlLNJ4cybGu5V4yg_; p_skey=W*OhkHnl5VR34Iml5X9iBtxBBrALadNgK80n2bWdS0g_; p_luin=o0583497794; p_lskey=00040000ccb7eeb9079656a0b1bb35d1cab59649d8cebcddebbfa3dba1e73accd9a378af44321d87623db5e4; ts_last=y.qq.com/'
          },
          // responseType: 'text/html;charset=gb2312',
          // `params` are the URL parameters to be sent with the reques
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getMusic', function (req, res) {
        //  console.log(req.query)
        // var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
        var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            // referer: 'https://c.y.qq.com/',
            referer: 'https://y.qq.com/portal/player.html',
            // host: 'c.y.qq.com'
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          console.log(response.data)
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getLyric', function (req, res) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/player.html',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          const reg = /\((.*)\)/
          var obj = reg.exec(response.data)[1]
          // console.log(JSON.parse(obj))
          res.json(JSON.parse(obj))
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

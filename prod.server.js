var express= require('express')
var config = require('./config/index')
var axios = require('axios')
const app = express()
var apiRoutes = express.Router()

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
      'accept-language': 'zh-CN,zh;q = 0.9',
      'accept-encoding': 'gzip, deflate, br',
      // 'URIEncoding': 'UTF-8',
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
    var ret = response.data
    const reg = /^\w+\((\{[^()]+\})\)$/
    var matches = reg.exec(response.data)
    if (matches) {
      ret = JSON.parse(matches[1])
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
app.get('/api/getDisc', function (req, res) {
  console.log('getDisc')
  // const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const url = 'http://ustbhuangyi.com/music/api/getCdInfo'
  axios.get(url, {
    // headers: {
    //   // referer: `https://y.qq.com/n/yqq/playlist/${req.query.disstid}.html`,
    //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    //   referer: `https://y.qq.com/n/yqq/playsquare/${req.query.disstid}.html`,
    //   host: 'c.y.qq.com',
    //   'accept-encoding': 'gzip, deflate, br',
    //   'accept-language': 'zh-CN, zh;q = 0.9',
    //   cookie: 'pt2gguin=o0583497794; RK=vU7Ut5iEQ/; ptcz=75179b09307dd783ce9a77d5ea20a9a107bb42f4caf336824fc943253918201e; pgv_pvid=2022224225; o_cookie=583497794; pac_uid=1_583497794; cuid=4546319240; pgv_pvi=2505669632; ts_uid=2915816775; ptisp=cm; pgv_info=ssid=s1901470322; pgv_si=s3043667968; ts_refer=ADTAGnewyqq.taoge; yqq_stat=0; player_exist=1; yq_playschange=0; yq_playdata=; qqmusic_fromtag=66; yq_index=1; yplayer_open=0; ts_last=y.qq.com/n/yqq/playsquare/844538289.html'
    // },
    headers: {
      host: 'ustbhuangyi.com',
      Referer: 'http://ustbhuangyi.com/music/'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  })
})
app.get('/api/getSearch', function (req, res) {
  console.log('getSearch')
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/m/index.html',
      origin: 'https://y.qq.com',
      host: 'c.y.qq.com',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    },
    params: req.query
  }).then((response) => {
    console.log(response.data)
    res.json(response.data)
  })
})

app.use('/api', apiRoutes)
// 静态目录
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
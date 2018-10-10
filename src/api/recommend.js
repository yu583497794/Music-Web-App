import jsonp from 'common/js/jsonp.js'
import {commonParams, options} from './config'
// eslint-disable-next-line
import axios from 'axios'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    unin: 583497794,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
// 在recommend.vue中调用getDiscList(),该函数会请求/api/getDiscList，返回一个Promise
export function getDiscList() {
  // eslint-disable-next-line
  const url = '/api/getDiscList'
  // eslint-disable-next-line
  var data = Object.assign({}, commonParams, {
    callback: 'recom3232867383159397',
    jsonpCallback: 'recom3232867383159397',
    platform: 'yqq',
    loginUin: 583497794,
    hostUin: 0,
    // sin: 0,
    // ein: 29,
    // sortId: 5,
    needNewCode: 0,
    data: {
      comm: {
        ct: 24
      },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: {
          async: 1,
          cmd: 2
        },
        module: 'playlist.HotRecommendServer'
      }
    }
    // categoryId: 10000000,
    // rng: Math.random(),
  })
  // return jsonp(url, data, options)
  // wrong???
  // return axios.get(url, {
  //   params: data
  // }).then((res) => {
  //   // resolve & reject
  //   return Promise.resolve(res.data)
  // })
}
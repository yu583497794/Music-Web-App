import jsonp from 'common/js/jsonp.js'
import {commonParams, options} from './config'
// eslint-disable-next-line
import axios from 'axios'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    notice: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    inCharset: 'utf8',
    outCharset: 'utf-8'
  })

  return axios.get('/api/getDiscList', {
    params: data
  })
}
/*
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
  const url = './api/getDiscList'
  // eslint-disable-next-line
  var data = Object.assign({}, commonParams, {
    // callback: 'recom3232867383159397',
    // jsonpCallback: 'MusicJsonCallback6312171763821812',
    jsonpCallback: 'MusicJsonCallback',
    dirid: 201,
    dirinfo: 1,
    g_tk: 2110691619,
    platform: 'yqq',
    loginUin: 583497794,
    hostUin: 0,
    needNewCode: 0
  })
  // return jsonp(url, data)
  // wrong???
  return axios.get(url, {
    params: data
  }).then((res) => {
    // resolve & reject
    return Promise.resolve(res.data)
  })
}
*/
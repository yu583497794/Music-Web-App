import axios from 'axios'
// import jsonp from 'common/js/jsonp'
// eslint-disable-next-line
import {commonParams, options, ERR_OK} from 'api/config'
// export function getDisc(disstid) {
//   // const url = '/api/getDisc'
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
//   const data = Object.assign({}, commonParams, {
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     disstid,
//     // jsonpcallback: 'playlistinfoCallback',
//     // callback: 'playlistinfoCallback',
//     loginUin: 0,
//     hostUin: 0,
//     notice: 0,
//     platform: 'ypp',
//     needNewCode: 0,
//     g_tk: 47905266
//   })
//   // return jsonp(url, data, options)
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res)
//   }).catch((e) => {
//     console.log(e)
//   })
// }
// export function getDisc(disstid) {
//   // const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
//   const url = 'http://ustbhuangyi.com/music/api/getCdInfo'
//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })
//   return jsonp(url, data, {
//     param: 'callback'
//   })
// }
export function getDisc(disstid) {
  // const url = '/api/getDisc'
  const url = '/api/getDisc'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    // jsonpcallback: 'playlistinfoCallback',
    // callback: 'playlistinfoCallback',
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'ypp',
    needNewCode: 0,
    g_tk: 1928093487
  })
  // return jsonp(url, data, options)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  }).catch((e) => {
    console.log(e)
  })
}
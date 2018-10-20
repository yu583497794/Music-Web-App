import {commonParams} from 'api/config'
import axios from 'axios'
// import { stringify } from 'querystring'
export function getMusic(mid) {
  let url = '/api/getMusic'
  // let extraData = `{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"2022224225","songmid":[${mid}],"songtype":[0],"uin":0,"loginflag":0,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
  let extraData = `%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%222022224225%22%2C%22songmid%22%3A%5B%22${mid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%22583497794%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A583497794%2C%22format%22%3A%22json%22%2C%22ct%22%3A20%2C%22cv%22%3A0%7D%7D`
  // console.log('!!!!!!!!', encodeURIComponent(extraData))
  let data = Object.assign({}, commonParams, {
    jsonpCallback: 'getplaysongvkey06245320205828997',
    callback: 'getplaysongvkey06245320205828997',
    // songmid: mid,
    // filename: `C400${mid}.m4a`,
    // guid: 6442406400,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needCode: 0,
    // g_tk: 1099768724,
    notice: 0,
    // uin: 0,
    // cid: 205361747,
    format: 'jsonp',
    needNewCode: 0,
    data: extraData
  })
  // axios.get(url, {
  //   param: data
  // }).then((res) => {
  //   return Promise.resolve(res.data)
  // }, (e) => {
  //   console.log('axios error:', e)
  // })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  }, (e) => {
    console.log(e)
  })
}
import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParams, {
    callback: 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: mid,
    jsonpCallback: 'MusicJsonCallback_lrc',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 274226255,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'
import axios from 'axios'
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 818085859,
    uin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) {
  const url = '/api/getSearch'
  const data = Object.assign({}, commonParams, {
    g_tk: 389951375,
    uin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    // 是否需要直达
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    var ret = []
    const reg = /^\w+\((\{.+\})\)$/
    const matches = reg.exec(res.data)
    if (matches) {
      ret = matches[1]
    }
    return Promise.resolve(JSON.parse(ret))
  })
}
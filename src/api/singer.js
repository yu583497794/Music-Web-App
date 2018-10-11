import jsonp from 'common/js/jsonp'
// eslint-disable-next-line
import {commonParams, options} from './config'
export function getSingerList() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const obj = {
    comm: {
      ct: 24,
      cv: 10000
    },
    singerList: {
      module: 'Music.SingerListServer',
      method: 'get_singer_list',
      param: {
        area: -100,
        sex: -100,
        genre: -100,
        index: -100,
        sin: 0,
        cur_page: 1
      }
    }
  }
  const data = Object.assign({}, commonParams, {
    callback: '?',
    g_tk: 450503,
    jsonpCallback: '?',
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: encodeURIComponent(JSON.stringify(obj))
  })
  // 已经在data中传入callback,若在传入options,则jsonp会再附加一个jsonpCallback
  return jsonp(url, data)
  // return jsonp(url, data, options)
}

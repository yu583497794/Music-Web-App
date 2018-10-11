import originJSONP from 'jsonp'
// 通过data拼装到纯净的url
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    // webmodules/jsonp: A simple JSONP implementation https://github.com/webmodules/jsonp#jsonpurl-opts-fn
    // jsonp(url, opts, fn)
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 删去第一个&
  return url ? url.substring(1) : ''
}
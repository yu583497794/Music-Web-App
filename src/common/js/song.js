import {getLyric} from 'api/song'
import {getMusic} from 'api/music'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    // 如果带这一行就会报错[vuex]Do not mutate vuex store state outside mutation handlers.
    // this.url = ''
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line
          reject('no lyric')
        }
      })
    })
  }
  getURL() {
    console.log('url')
    if (this.url) {
      return Promise.resolve(this.url)
    }
    // var _this = this
    return new Promise((resolve, reject) => {
      console.log('first')
      getMusic(this.mid).then((res) => {
        let reg = /\((\{.*\})\)/
        let obj = JSON.parse(reg.exec(res.data)[1])
        if (obj.code === ERR_OK) {
          console.log('ERR_OK')
          const {req_0: {data: {midurlinfo: [{purl}]}}} = obj
          this.url = `http://isure.stream.qqmusic.qq.com/${purl}`
          resolve(this.url)
        } else {
          // eslint-disable-next-line
          reject('common/music/SING女团 - 寄明月.mp3')
        }
      })
    })
  }
}

export function createSong(musicData) {
  // const purl = getpurl(musicData.songmid)
  // console.log(purl)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: filterSinger(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: `http://isure.stream.qqmusic.qq.com/${purl}`
    // http://isure.stream.qqmusic.qq.com/C400002Jbzn235xaQZ.m4a?guid=2022224225&vkey=C0FF5A8951141C9493CC822D8905D432C407BF1FC99785C2E27495E63AAC649A4B93374886F638F91E7E1BF3B20BAAC7987267412E6534E7&uin=6210&fromtag=66
    // http://isure.stream.qqmusic.qq.com/C400002Jbzn235xaQZ.m4a?guid=2022224225&vkey=C0FF5A8951141C9493CC822D8905D432C407BF1FC99785C2E27495E63AAC649A4B93374886F638F91E7E1BF3B20BAAC7987267412E6534E7&uin=6210&fromtag=66
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
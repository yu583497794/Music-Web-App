import {getLyric} from 'api/song'
import {getMusic} from 'api/music'
import {ERR_OK} from 'api/config'
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
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
      }
    })
  }
  geturl() {
    var _this = this
    getMusic(this.mid).then(function (res) {
      let reg = /\((\{.*\})\)/
      let obj = JSON.parse(reg.exec(res.data)[1])
      const {req_0: {data: {midurlinfo: [{purl}]}}} = obj
      _this.url = `http://isure.stream.qqmusic.qq.com/${purl}`
    })
    return this
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
  }).geturl()
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
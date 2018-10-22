import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    console.log('getLyric')
    getLyric(this.mid).then((res) => {
      console.log(res)
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
}

export function createSong(musicData, purl) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: filterSinger(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/${purl}`
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
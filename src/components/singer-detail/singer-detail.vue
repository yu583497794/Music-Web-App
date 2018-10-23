<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
// eslint-disable-next-line
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
// import {getMusic} from 'api/music'
export default {
  name: 'singer-detail',
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      // 把 `this.singer` 映射为 `this.$store.getters.singer`
      'singer',
      'sequenceList'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          // this.setSquenceList(this.songs)
          // console.log(this.songs)
        }
      })
    },
    // getPlaySongVkey(res) {
    //   let reg = /\((\{.*\})\)/
    //   let obj = JSON.parse(reg.exec(res.data)[1])
    //   const {req_0: {data: {midurlinfo: [{purl}]}}} = obj
    //   return purl
    // },
    _normalizeSongs (list) {
      let ret = []
      // let _this = this
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albumid) {
          // getMusic(musicData.songmid).then((res) => {
          //   if (res) {
          //     const purl = _this.getPlaySongVkey(res)
          //     const newSong = createSong(musicData, purl)
          //     ret.push(newSong)
          //   }
          // })
          const newSong = createSong(musicData)
          ret.push(newSong)
        }
      })
      return ret
    },
    ...mapMutations({
      setSquenceList: 'SET_SEQUENCE_LIST'
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
  .slide-enter-active,.slide-leave-active
    transition all 0.3s ease
  .slide-enter,.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>

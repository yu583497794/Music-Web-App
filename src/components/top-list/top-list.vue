<template>
  <div class="top-list">
    <transition name="slide">
      <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="true"></music-list>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import {getToplist} from 'api/rank'
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config'
import MusicList from 'components/music-list/music-list'
import {createSong} from 'common/js/song'
export default {
  name: 'top-list',
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created () {
    this._getMusicList(this.topList.id)
  },
  computed: {
    title () {
      console.log(this.topList.topTitle)
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    // 放在computed里，否则会报错
    // title () {
    //   console.log(this.topList.topTitle)
    //   return this.topList.topTitle
    // },
    // bgImage () {
    //   console.log(this.topList.picUrl)
    //   return this.topList.picUrl
    // },
    _getMusicList (id) {
      getToplist(id).then((res) => {
        if (res.code !== ERR_OK) {
          this.$router.push({
            path: `/rank`
          })
        } else {
          this.songs = this._normalize(res.songlist)
        }
      })
    },
    _normalize (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.data.songid && musicData.data.albumid) {
          ret.push(createSong(musicData.data))
        }
      })
      return ret
    }
    // ...mapMutations({
    //   setToplist: 'SET_TOPLIST'
    // })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .top-list
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-background
</style>

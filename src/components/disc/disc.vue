<template>
  <div class="disc">
    <music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {getDisc} from 'api/disc'
import {createSong} from 'common/js/song'
export default {
  name: 'disc',
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created () {
    this._getDisc()
  },
  methods: {
    _getDisc() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getDisc(this.disc.dissid).then((res) => {
        if (res.data.code === ERR_OK) {
          const list = res.data.cdlist[0].songlist
          this._normalizeSongs(list)
        }
      })
    },
    _normalizeSongs (list) {
      const songs = []
      list.forEach(musicData => {
        if (musicData.songid) {
          let song = createSong(musicData)
          songs.push(song)
        }
      })
      this.songs = songs
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .disc
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background $color-background
</style>

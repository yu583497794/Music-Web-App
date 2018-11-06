<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" @switch="switchItem" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn" @click="play">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="likeScroll" v-if="currentIndex===0" :data="likeList" :refreshDelay="refreshDelay" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="likeList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playScroll" v-if="currentIndex===1" :data="recentPlaylist" :refreshDelay="refreshDelay" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="recentPlaylist" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <!-- <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip> -->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {mapGetters, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
// import TopTip from 'base/top-tip/top-tip'
import Song from 'common/js/song'
// import {switchesMixin} from 'common/js/mixin'
export default {
  name: 'user-center',
  mixins: [playlistMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [{
        name: '我喜欢的'
      }, {
        name: '最近听的'
      }],
      refreshDelay: 100
    }
  },
  methods: {
    switchItem (index) {
      this.currentIndex = index
    },
    back () {
      this.$router.go(-1)
    },
    handlePlaylist () {
      const bottom = this.playlist.length > 0 ? '60px' : 0
      this.$refs.listWrapper.style.bottom = bottom
    },
    selectSong (song, index) {
      if (this.currentIndex === 1 && index === 0) {
        return
      }
      this.insertSong(new Song(song))
    },
    play () {
      if (this.currentIndex === 0) {
        const list = this.likeList.slice()
        const likeList = []
        list.forEach(song => {
          likeList.push(new Song(song))
        })
        this.randomPlay({list: likeList})
      } else {
        const list = this.recentPlaylist.slice()
        const recentPlaylist = []
        list.forEach(song => {
          recentPlaylist.push(new Song(song))
        })
        this.randomPlay({list: recentPlaylist})
      }
    },
    // showTip () {
    //   this.$refs.topTip.show()
    // },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  // watch: {
  //   recentPlaylist () {
  //     this.$refs.playScroll.refresh()
  //   },
  //   likeList () {
  //     this.$refs.likeScroll.refresh()
  //   }
  // },
  computed: {
    ...mapGetters([
      'likeList',
      'recentPlaylist'
    ])
  },
  components: {
    Scroll,
    Switches,
    SongList
    // TopTip
  },
  activated () {
    if (this.currentIndex === 0) {
      this.$refs.likeScroll.refresh()
    } else {
      this.$refs.playScroll.refresh()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .user-center
    position fixed
    top 0
    left 0
    bottom 0
    width 100%
    background $color-background
    .back
      position absolute
      left 5px
      top 10px
      padding 5px
      color $color-theme
      z-index 20
    .switches-wrapper
      position relative
      margin-top 10px
    .play-btn
      width 120px
      margin 20px auto
      border 1px solid $color-dialog-background
      border-radius 20px
      padding 10px
      color $color-dialog-background
      text-align center
      font-size 0
      .icon-play
        vertical-align middle
        margin-right 5px
        font-size $font-size-medium
      .text
        vertical-align middle
        font-size $font-size-small
    .list-wrapper
      position absolute
      top 100px
      bottom 0px
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          margin 20px
    // .tip-title
    //   width 100px
    //   margin 0 auto
    //   padding 30px
    //   text-align center
    //   .icon-ok
    //     color $color-theme
    //     margin-right 5px
    //     font-size $font-size-medium
    //   .text
    //     color $color-text
    //     font-size $font-size-medium
</style>

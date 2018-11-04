<template>
  <transition name="fade">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <span class="icon" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut"  v-show="!query">
        <!-- <div class="tab-wrapper">
          <div class="tab-list">
            <div class="tab-item" :class="{'active': currentShow === 'recentPlay'}" @click.stop="changeTo('recentPlay')">最近播放</div>
            <div class="tab-item" :class="{'active': currentShow === 'historySearch'}" @click.stop="changeTo('historySearch')">历史搜索</div>
          </div>
        </div> -->
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <!-- <scroll class="content" :data="contentItems" ref="scroll">
          <div>
            <div class="recentPlay" v-show="currentShow === 'recentPlay'">
              <song-list :songs="recentPlaylist" @select="selectItem"></song-list>
            </div>
            <div class="history" v-show="currentShow==='historySearch'">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </div>
        </scroll> -->
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex === 0" :data="recentPlaylist" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="recentPlaylist" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" v-if="currentIndex===1" :data="searchHistory" class="list-scroll" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- <transition name="alert-fade">
        <div class="alert" v-show="alertFlag">
          <span class="icon">
            <i class="icon-ok"></i>
          </span>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </transition> -->
      <div class="search-result" v-show="query">
        <suggest :query="query" @select="selectSuggest" @listScroll="blurInput" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip" :delay="tipDelay">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import {searchListMixin} from 'common/js/mixin'
import SongList from 'base/song-list/song-list'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Suggest from 'base/suggest/suggest'
import Switches from 'base/switches/switches'
import TopTip from 'base/top-tip/top-tip'
export default {
  name: 'add-song',
  mixins: [searchListMixin],
  data () {
    return {
      showFlag: false,
      currentShow: 'recentPlay',
      alertFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{
        name: '最近播放'
      }, {
        name: '搜索历史'
      }],
      tipDelay: 1000
    }
  },
  computed: {
    contentItems () {
      return this.recentPlay
    },
    ...mapGetters([
      'recentPlaylist'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    changeTo (currentShow) {
      this.currentShow = currentShow
    },
    // selectItem (song) {
    //   // 只是对象，而不是类，要先构造成类才行
    //   song = new Song(song)
    //   this.insertSong(song)
    //   this.alert()
    // },
    // PlayHistory(localStorage)中的song是对象，并不是Song的实例
    selectSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        // this.alert()
        this.showTip()
      }
    },
    selectSuggest (item) {
      this.saveSearchHistory(this.query)
      // this.alert()
      this.showTip()
    },
    // alert () {
    //   this.alertFlag = true
    //   setTimeout(() => {
    //     this.alertFlag = false
    //   }, 1000)
    // },
    showTip () {
      this.$refs.topTip.show()
      // 在show中实现
      // setTimeout(() => {
      //   this.$refs.topTip.hide()
      // }, 1000)
    },
    switchItem (index) {
      this.currentIndex = index
    },
    // handlePlaylist () {
    //   const bottom = this.playlist.length > 0 ? '60px' : 0
    //   this.$refs.scroll.$el.style.bottom = bottom
    //   this.$refs.scroll.refresh()
    // },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    SearchList,
    SongList,
    Scroll,
    Suggest,
    Switches,
    TopTip
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .add-song
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-background
    &.fade-enter-active,&.fade-leave-active
      transition all 0.1s
    &.fade-enter,&.fade-leave-to
      transform translate3d(100%, 0, 0)
    .header
      position relative
      padding 10px 20px
      font-size $font-size-large
      .title
        text-align center
        color $color-text
      .icon
        position absolute
        right 20px
        top 10px
        color $color-theme
    .search-box-wrapper
      margin 20px
    // .tab-list
    //   width 60%
    //   margin 0 auto
    //   display flex
    //   justify-content center
    //   align-items center
    //   border 1px solid $color-dialog-background
    //   border-radius 5px
    //   .tab-item
    //     flex auto
    //     font-size $font-size-medium
    //     text-align center
    //     padding 6px 0
    //     color $color-text-d
    //     &:first-child
    //       border-right 1px solid $color-dialog-background
    //     &.active
    //       background $color-dialog-background
    //       color $color-text
    // .content
    //   position fixed
    //   top 160px
    //   bottom 0
    //   right 0
    //   left 0
    //   margin 20px 20px
    //   overflow hidden
    .shortcut
      .list-wrapper
        position absolute
        top 165px
        bottom 0
        width 100%
        .list-scroll
          height 100%
          overflow hidden
          .list-inner
            padding 20px 30px
    // .alert
    //   position fixed
    //   top 0
    //   right 0
    //   left 0
    //   padding 30px 0
    //   text-align center
    //   vertical-align middle
    //   font-size $font-size-medium
    //   background $color-dialog-background
    //   &.alert-fade-enter-active,&.alert-fade-leave-active
    //     transition all 0.3s ease
    //   &.alert-fade-enter,&.alert-fade-leave-to
    //     transform translate3d(0, -100%, 0)
    //   .icon
    //     color $color-theme
    //     margin-right 10px
    //   .text
    //     color $color-text
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      padding 18px 0
      text-align center
      font-size 0
      .icon-ok
        font-size: $font-size-medium
        color $color-theme
        margin-right 10px
      .text
        font-size: $font-size-medium
        color $color-text
</style>

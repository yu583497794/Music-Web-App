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
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <div class="content-wrapper"  v-show="!query.length">
        <div class="tab-wrapper">
          <div class="tab-list">
            <div class="tab-item" :class="{'active': currentShow === 'recentPlay'}" @click.stop="changeTo('recentPlay')">最近播放</div>
            <div class="tab-item" :class="{'active': currentShow === 'historySearch'}" @click.stop="changeTo('historySearch')">历史搜索</div>
          </div>
        </div>
        <scroll class="content" :data="contentItems" ref="scroll">
          <div>
            <div class="recentPlay" v-show="currentShow === 'recentPlay'">
              <song-list :songs="recentPlaylist" @select="selectItem"></song-list>
            </div>
            <div class="history" v-show="currentShow==='historySearch'">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <transition name="alert-fade">
        <div class="alert" v-show="alertFlag">
          <span class="icon">
            <i class="icon-ok"></i>
          </span>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </transition>
      <suggest :query="query" v-show="query.length" @select="alert"></suggest>
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
export default {
  name: 'add-song',
  mixins: [searchListMixin],
  data () {
    return {
      showFlag: false,
      currentShow: 'recentPlay',
      alertFlag: false
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
    },
    hide () {
      this.showFlag = false
    },
    changeTo (currentShow) {
      this.currentShow = currentShow
    },
    selectItem (song) {
      // 只是对象，而不是类，要先构造成类才行
      song = new Song(song)
      this.insertSong(song)
      this.alert()
    },
    alert () {
      this.alertFlag = true
      setTimeout(() => {
        this.alertFlag = false
      }, 2000)
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
    Suggest
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
      margin 30px 20px 20px 20px
    .tab-list
      width 60%
      margin 0 auto
      display flex
      justify-content center
      align-items center
      border 1px solid $color-dialog-background
      border-radius 5px
      .tab-item
        flex auto
        font-size $font-size-medium
        text-align center
        padding 6px 0
        color $color-text-d
        &:first-child
          border-right 1px solid $color-dialog-background
        &.active
          background $color-dialog-background
          color $color-text
    .content
      position fixed
      top 160px
      bottom 0
      right 0
      left 0
      margin 20px 20px
      overflow hidden
    .alert
      position fixed
      top 0
      right 0
      left 0
      padding 30px 0
      text-align center
      vertical-align middle
      font-size $font-size-medium
      background $color-dialog-background
      &.alert-fade-enter-active,&.alert-fade-leave-active
        transition all 0.3s ease
      &.alert-fade-enter,&.alert-fade-leave-to
        transform translate3d(0, -100%, 0)
      .icon
        color $color-theme
        margin-right 10px
      .text
        color $color-text
</style>

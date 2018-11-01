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
        <search-box ref="searchBox"></search-box>
      </div>
      <div class="tab-wrapper">
        <div class="tab-list">
          <div class="tab-item" :class="{'active': currentShow === 'currentPlay'}" @click.stop="changeTo('currentPlay')">最近播放</div>
          <div class="tab-item" :class="{'active': currentShow === 'historySearch'}" @click.stop="changeTo('historySearch')">历史搜索</div>
        </div>
      </div>
      <div class="content">
        <div class="currentPlay" v-show="currentShow === 'currentPlay'">
          <song-list :songs="recentPlaylist"></song-list>
        </div>
        <div class="history" v-show="currentShow==='historySearch'">
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import {searchListMixin} from 'common/js/mixin'
import SongList from 'base/song-list/song-list'
import {mapGetters} from 'vuex'
export default {
  name: 'add-song',
  mixins: [searchListMixin],
  data () {
    return {
      showFlag: false,
      currentShow: 'currentPlay'
    }
  },
  computed: {
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
    }
  },
  components: {
    SearchBox,
    SearchList,
    SongList
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
</style>

<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <!-- 只有点击外层才会hide stop冒泡 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click.stop="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleLike(item)">
                <i :class="favoriteCls(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operator">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text" @click="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" comfirmBtn="清空" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import {playerMixin, favoriteMixin} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'
export default {
  name: 'playlist',
  mixins: [playerMixin, favoriteMixin],
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '单曲播放'
    }
    // ...mapGetters([
    // //   'sequenceList',
    // //   'playlist',
    // //   'currentSong',
    // //   'mode'
    //   'likeList'
    // ])
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.clearSong()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    // ...mapMutations({
    //   setCurrentIndex: 'SET_CURRENT_INDEX',
    //   setPlayingState: 'SET_PLAYING_STATE'
    // }),
    ...mapActions([
      'deleteSong',
      'clearSong'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .playlist
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 200
    background $color-background-d
    &.list-fade-enter-active,&.list-fade-leave-active
      transition opacity 0.3s
    &.list-fade-enter,&.list-fade-leave-to
      opacity 0
      .list-wrapper
        transform translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position absolute
      left 0
      bottom 0
      width 100%
      background $color-highlight-background
      .list-header
        position relative
        padding 20px 30px 10px 20px
        .title
          display flex
          align-items center
          .icon
            margin-right 10px
            font-size 30px
            color $color-theme-d
          .text
            flex 1
            font-size $font-size-medium
            color $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
      .list-content
        max-height 240px
        overflow hidden
        .item
          display flex
          align-items center
          justify-content space-between
          height 40px
          padding 0 30px 0 20px
          overflow hidden
          &.list-enter-active,&.list-leave-active
            transition all 0.1s
          &.list-enter,&.list-leave-to
            height 0
          .current
            flex 0 0 20px
            width 20px
            font-size $font-size-small
            color $color-theme-d
          .text
            flex 1
            no-wrap()
            font-size $font-size-medium
            color $color-text-d
          .like
            // flex 默认为 0 1 auto flex-basis默认值为auto，即项目本来的大小
            extend-click()
            margin-right 15px
            font-size $font-size-small
            color $color-theme
            .icon-favorite
              color $color-sub-theme
          .delete
            extend-click()
            font-size $font-size-samll
            color $color-theme
      .list-operator
        width 140px
        margin 20px auto 30px auto
        .add
          display flex
          align-items center
          padding 8px 16px
          border 1px solid $color-text-l
          border-radius 100px
          color $color-text-l
          .icon-add
            margin-right 5px
            font-size $font-size-small-s
          .text
            font-size $font-size-small
      .list-close
        text-align center
        line-height 50px
        background $color-background
        font-size $font-size-medium-x
        color $color-text-l
</style>

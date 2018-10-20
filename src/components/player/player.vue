<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <!-- 左侧 -->
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll class="middle-r">
            <div class="lyric-wrapper">
              <div>
                <p class="text"></p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-l">{{_format(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <div class="time time-r">{{_format(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev" ></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <!-- 固定值不需要加: -->
          <progress-circle :radius="radius" :percent="percent">
            <!-- .stop阻止冒泡 -->
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready"  @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
const transform = prefixStyle('transform')
export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32
    }
  },
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // done -> afterEnter
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      // 把style.animation都置为空
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale () {
      const targetWidth = 40
      // 小圆圆心到左边框距离:20(radium)+20(padding-left)
      const paddingLeft = 40
      // 小圆圆心到下边框的距离:20(radium)+(60-40)/2
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      // 分别求俩圆心的水平距离和垂直距离，即为个方向移动距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
    },
    next () {
      // 防止快速点击 歌曲ready时点击才有效
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        console.log(this.playlist.length)
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    // n补的字符串的长度
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 处理时间
    _format (interval) {
      // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      // return second < 10 ? `${minute}:0${second}` : `${minute}:${second}`
      return `${minute}:${second}`
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .player
    .normal-player
      position fixed
      top 0
      right 0
      bottom 0
      left 0
      z-index 150
      background $color-background
      &.normal-enter-active,&.normal-leave-active
        transition all 0.4s
        .top,.bottom
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter,&.normal-leave-to
        opacity 0
        .top
          transform translate3d(0,-100px, 0)
        .bottom
          transform translate3d(0, 100px, 0)
      .background
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        z-index -1
        filter blur(10px)
      .top
        position relative
        margin-bottom 25px
        .back
          position absolute
          top 0
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size $font-size-large-x
            color $color-theme
            transform rotate(-90deg)
        .title
          width 70%
          margin 0 auto
          line-height 40px
          text-align center
          no-wrap()
          font-size $font-size-large
          color $color-text
        .subtitle
          line-height 20px
          text-align center
          font-size $font-size-medium
          color $color-text
      .middle
        position fixed
        top 80px
        bottom 170px
        width 100%
        white-space no-wrap
        font-size 0
        .middle-l
          display inline-block
          vertical-align top
          position relative
          width 100%
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            left 10%
            top 0
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              box-sizing border-box
              border 10px solid rgba(255, 255, 255, 0.1)
              border-radius 50%
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
              .image
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                border-radius 50%
          .playing-lyric-wrapper
            width 90%
            margin 30px auto 0 auto
            overflow hidden
            text-align center
            .playing-lyric
              height 20px
              line-height 20px
              font-size $font-size-medium
              color $color-text-l
        .middle-r
          display inline-block
          vertical-align top
          width 100%
          height 100%
          overflow hidden
          .lyric-wrapper
            width 80%
            margin 0 auto
            overflow hidden
            text-align center
            .text
              line-height 32px
              font-size $font-size-medium
              color $color-text-l
              &.current
                color $color-text
      .bottom
        position absolute
        bottom 50px
        left 0
        width 100%
        .dot-wrapper
          font-size 0
          text-align center
          .dot
            display inline-block
            height 8px
            weight 8px
            vertical-align middle
            margin 0 4px
            border-radius 50&
            background $color-text-l
            &.active
              width 20px
              border-radius 5px
              color $color-text-ll
        .progress-wrapper
          display flex
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0
          .time
            color $color-text
            font-size $font-size-small
            flex 0 0 30px
            line-height 30px
            width 30px
            &.time-l
              text-align left
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color $color-theme
            &.disable
              color $color-theme-d
            i
              font-size 30px
          .i-left
            text-align right
          .i-right
            text-align left
          .i-center
            text-align center
            i
              font-size 40px
          .icon-favorite
            color $color-sub-theme
    .mini-player
      position fixed
      bottom 0
      left 0
      z-index 180
      display flex
      height 60px
      width 100%
      background $color-highlight-background
      &.mini-enter-active,&.mini-leave-active
        transition all 0.4
      &.mini-enter,&.mini-leave-to
        opacity 0
      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px
        display flex
        align-items center
        img
          border-radius 50%
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .name
          margin-bottom 2px
          no-wrap()
          font-size $font-size-medium
          color $color-text
        .desc
          no-wrap()
          font-size $font-size-small
          color $color-text-d
      .control
        flex 0 0 30px
        width 30px
        padding 0 10px
        display flex
        align-items center
        .icon-play-mini,.icon-pause-mini,.icon-playlist
          font-size 32px
          color $color-theme-d
          &.icon-mini
            position absolute
            font-size 32px
            left 0
            top 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>

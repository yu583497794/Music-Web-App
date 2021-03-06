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
        <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
         >
          <!-- 左侧 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" :class="{'current': currentLineNum === index}" ref="lyricLine" v-for="(line, index) in currentLyric['lines']" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-l">{{_format(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <div class="time time-r">{{_format(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
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
              <i class="icon" :class="favoriteCls(currentSong)" @click.stop="toggleLike(currentSong)"></i>
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
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <!-- end歌曲播放完 -->
    <!-- @canplay 改为 play -->
    <!-- canplay当文件就绪可以开始播放时运行的脚本 -->
    <!-- play当媒介已就绪可以播放时运行的脚本 -->
    <audio ref="audio" :src="currentSong.url" @play="ready"  @error="error" @timeupdate="updateTime" @ended="end"></audio>
    <top-tip ref="topTip" :tipDelay="tipDelay">
      <div class="tip-title">
        <i class="icon-delete"></i>
        <span class="text">抱歉,暂时没有版权,将为您播放下一首歌</span>
      </div>
    </top-tip>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
// playerMixin 不可省略在此component中仍有用到
import {playMode} from 'common/js/config'
import Lyric from 'lyric-parser'
import Playlist from 'components/playlist/playlist'
import {playerMixin, favoriteMixin} from 'common/js/mixin'
import TopTip from 'base/top-tip/top-tip'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  name: 'player',
  mixins: [playerMixin, favoriteMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playLyric: null,
      tipDelay: 2000
    }
  },
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle,
    Playlist,
    TopTip
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    // playerMixin
    // iconMode () {
    //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    // },
    ...mapGetters([
      'fullScreen',
      // 'playlist',
      // 'currentSong',
      'playing',
      'currentIndex'
      // 'mode',
      // 'sequenceList'
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
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    next () {
      // 防止快速点击 歌曲ready时点击才有效
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        // eslint-disable-next-line
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        this.songReady = false
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        // eslint-disable-next-line
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      }
    },
    ready () {
      this.songReady = true
      this.saveRecentPlaylist(this.currentSong)
    },
    error () {
      this.currentLyric.stop()
      this.$refs.topTip.show()
      setTimeout(() => {
        this.deleteSong(this.currentSong)
      }, this.tipDelay)
      this.songReady = true
      // eslint-disable-next-line
      return
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
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
        setTimeout(() => {
          this.$refs.audio.play()
        }, 2000)
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        // 【重要】判断当前歌的歌词 防止切换歌曲后歌词乱掉
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLineNum = 0
        this.currentLyric = new Lyric(lyric, this.handleLyrics)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 清理操作
        this.currentLyric = null
        this.playLyric = null
        this.currentLineNum = 0
      })
    },
    handleLyrics ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 认为是纵向滚动
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // right的左边相对于屏幕右侧的偏移位置 [-innerWidth, x, 0]
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
          this.touch.percent = 1
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
          this.touch.percent = 0
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = `${opacity}`
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    showTip () {
      this.$refs.topTip.show()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
      // setPlayingState: 'SET_PLAYING_STATE',
      // setCurrentIndex: 'SET_CURRENT_INDEX',
      // setPlayMode: 'SET_PLAY_MODE',
      // setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteSong'
    ])
  },
  created () {
    this.touch = {}
  },
  watch: {
    currentSong (newSong, oldSong) {
      // 判断是如何切换歌曲的 播放结束 还是用户切换
      const endFlag = this.$refs.audio.ended
      // 空
      if (!newSong.id) {
        return
      }
      // 同一首歌
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // this.$nextTick(() => {
      //   this.currentSong.getURL().then((url) => {
      //     var promise = new Promise((resolve, reject) => {
      //       // console.log(this.$refs.audio.currentSrc)
      //       // console.log(this.$refs.audio.readyState)
      //       // setTimeout(() => {
      //       //   resolve()
      //       // }, 200)
      //       if (this.$refs.audio.readyState === 4) {
      //         resolve()
      //       }
      //     })
      //     promise.then(() => {
      //       console.log('play')
      //       this.$refs.audio.play()
      //     })
      //     this.getLyric()
      //   })
      // })
      this.currentSong.getURL().then((url) => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (!endFlag) {
            this.$refs.audio.play()
          }
          this.getLyric()
        }, 1000)
      }).catch(() => {
        console.log('error')
        // this.showTip()
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
        white-space nowrap
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
            width 8px
            vertical-align middle
            margin 0 4px
            border-radius 50%
            background $color-text-l
            &.active
              width 20px
              border-radius 5px
              color $color-text
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
    .tip-title
      padding 30px 0
      text-align center
      font-size 0
      .icon-delete
        font-size: $font-size-medium
        color $color-theme
        margin-right 10px
      .text
        font-size: $font-size-medium
        color $color-text
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>

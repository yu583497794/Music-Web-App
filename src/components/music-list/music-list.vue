<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 模糊层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 传入data可以及时的更新scroll，watch data -->
    <scroll
    :data="songs"
    class="list"
    ref="list"
    :probe-type="probeType"
    :listen-scroll="listenScroll"
    @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div class="load-wrapper" v-show="!songs.length">
        <loading class="loading"></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
const RESERVED_HIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  name: 'music-list',
  data () {
    return {
      scrollY: 0
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.push('/singer')
    }
  },
  watch: {
    scrollY (newY) {
      // eslint-disable-next-line
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      // console.log(transform)
      // console.log(backdrop)
      // this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px, 0)`
      // this.$refs.layer.style['webkit-transform'] = `translate3d(0,${translateY}px, 0)`
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      // console.log(this.$refs.layer.style['transform'])
      // console.log(this.$refs.layer.style['webkit-transform'])
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      // this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      // this.$refs.filter.style['webkit-backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 控制图片z-index，置于歌单之上
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // this.$refs.bgImage.style['transform'] = `scale(${scale})`
      // this.$refs.bgImage.style['webkit-transform'] = `scale(${scale})`
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      // console.log(this.$refs.bgImage.style['transform'])
      // console.log(this.$refs.bgImage.style['webkit-transform'])
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text
    .bg-image
      // padding-top 70% width 100% 控制宽高比为10：7
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        // margin-left 50%
        // left -50%
        // border 1px solid $color-theme
        // border-radius 10px
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          border-radius 100px
          font-size 0
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
    .bg-layer
      position relative
      height 100%
      width 100%
      background $color-background
    .list
      position fixed
      width 100%
      bottom  0
      left 0
      // overflow hidden
      .song-list-wrapper
        position absolute
        width 100%
      .load-wrapper
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        background $color-background
        .loading
          position relative
          top 50%
          transform translate3d(0, -50%, 0)
</style>

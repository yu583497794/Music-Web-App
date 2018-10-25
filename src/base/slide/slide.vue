<template>
  <div class="slide" ref = "slide">
    <div class="slide-group" ref = "slideGroup">
      <!-- 插槽 -->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  // DOM 已渲染 与recommends获取是异步的
  mounted () {
    // console.log('mounted')
    // refs的坑 - 简书 https://www.jianshu.com/p/bd39302f2492
    // 浏览器的刷新通常是17毫秒一次，所以这里用了20毫秒
    let length = this.$refs.slideGroup.children.length
    var fecthChild = () => {
      // setTimeout确保DOM已渲染
      setTimeout(() => {
        // this.$refs.slideGroup是一个DOM对象
        length = this.$refs.slideGroup.children.length
        if (length <= 0) {
          fecthChild()
        }
        // 横向不能自动被撑宽
        this._setSlideWidth()
        this._initDots()
        this._initSlide()
        if (this.autoPlay) {
          this._play()
        }
      }, 3)
    }
    fecthChild()
    window.addEventListener('resize', () => {
      if (!this.slide) {
        return
      }
      this._setSlideWidth(true)
      this.slide.refresh()
      if (this.autoPlay) {
        this._play()
      }
    })
  },
  methods: {
    _setSlideWidth (isResize) {
      this.children = this.$refs.slideGroup.children
      // console.log(this.children)
      let width = 0
      let slideWidth = this.$refs.slide.clientWidth
      // console.log(this.children.length)
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        // 添加样式
        addClass(child, 'slide-item')
        child.style.width = slideWidth + 'px'
        width += slideWidth
      }
      // 左右各克隆一个DOM 确保循环切换
      if (this.loop && !isResize) {
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _initSlide () {
      this.slide = new BScroll(this.$refs.slide, {
        // 横向滚动
        scrollX: true,
        // 不允许纵向滚动
        scrollY: false,
        // 惯性
        momentum: false,
        // 实现slide的属性
        snap: {
          // 循环滚动
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        // 循环滚动
        click: true
      })
      this.slide.on('scrollEnd', () => {
        // console.log('-----scrollEnd-----')
        let pageIndex = this.slide.getCurrentPage().pageX
        // console.log('pageIndex = CurrentPage', pageIndex)
        // if (this.loop) {
        //   console.log('loop pageIndex', pageIndex - 1)
        //   pageIndex--
        // }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          this._play()
        }
      })
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
      this.slide.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      // this.currentPageIndex = this.slide.getCurrentPage().pageX
      // console.log('-----play-----')
      clearTimeout(this.timer)
      // console.log('pageIndex = currentPageIndex+1', this.currentPageIndex + 1)
      // let pageIndex = this.currentPageIndex + 1
      // if (this.loop) {
      //   console.log('loop pageIndex', pageIndex + 1)
      //   pageIndex += 1
      // }
      // this.timer = setTimeout(() => {
      //   console.log('goToPage', pageIndex)
      //   this.slide.goToPage(pageIndex, 0, 400)
      // }, this.interval)
      this.timer = setTimeout(() => {
        this.slide.next()
      }, this.interval)
    }
  },
  activated () {
    if (this.autoPlay) {
      this._play()
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>
<!-- 参考作者GitHub
  better-scroll/slide.vue at master · ustbhuangyi/better-scroll
  https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/slide/slide.vue
-->
<!-- <script type="text/ecmascript-6">
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'
const COMPONENT_NAME = 'slide'
export default {
  name: COMPONENT_NAME,
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 1000
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    console.log(this.autoPlay)
    this.update()
    window.addEventListener('resize', () => {
      if (!this.slide || !this.slide.enabled) {
        return
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  activated() {
    if (!this.slide) {
      return
    }
    this.slide.enable()
    let pageIndex = this.slide.getCurrentPage().pageX
    this.slide.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    this.slide.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    this.slide.disable()
    clearTimeout(this.timer)
  },
  methods: {
    update() {
      if (this.slide) {
        this.slide.destroy()
      }
      this.$nextTick(() => {
        this.init()
      })
    },
    refresh() {
      this._setSlideWidth(true)
      this.slide.refresh()
    },
    prev() {
      this.slide.prev()
    },
    next() {
      this.slide.next()
    },
    init() {
      clearTimeout(this.timer)
      let length = this.$refs.slideGroup.children.length
      var fecthChild = () => {
        // setTimeout确保DOM已渲染
        setTimeout(() => {
          // this.$refs.slideGroup是一个DOM对象
          length = this.$refs.slideGroup.children.length
          if (length <= 0) {
            fecthChild()
          }
          // 横向不能自动被撑宽
          this._setSlideWidth()
          this._initDots()
          this._initSlide()
          if (this.autoPlay) {
            this._play()
          }
        }, 3)
      }
      fecthChild()
      // let length = this.$refs.slideGroup.children.length
      // const fecthChild = () => {
      //   length = this.$refs.slideGroup.children.length
      //   if (length <= 0) {
      //     console.log('???')
      //     fecthChild()
      //   }
      //   this.currentPageIndex = 0
      //   this._setSlideWidth()
      //   if (this.showDot) {
      //     this._initDots()
      //   }
      //   this._initSlide()
      //   if (this.autoPlay) {
      //     this._play()
      //   }
      // }
      // fecthChild()
      // ---------------------------
      // this.currentPageIndex = 0
      // this._setSlideWidth()
      // if (this.showDot) {
      //   this._initDots()
      // }
      // this._initSlide()
      // if (this.autoPlay) {
      //   this._play()
      // }
    },
    _setSlideWidth(isResize) {
      this.children = this.$refs.slideGroup.children
      let width = 0
      let slideWidth = this.$refs.slide.clientWidth
      console.log(this.children.length)
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slide-item')
        child.style.width = slideWidth + 'px'
        width += slideWidth
      }
      if (this.loop && !isResize) {
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _initSlide() {
      console.log(this.threshold)
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true,
        click: this.click
      })
      this.slide.on('scrollEnd', this._onScrollEnd)
      // 鼠标/手指离开
      this.slide.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _onScrollEnd() {
      let pageIndex = this.slide.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('play next()')
        this.slide.next()
      }, this.interval)
    }
  },
  watch: {
    loop() {
      this.update()
    },
    autoPlay() {
      this.update()
    },
    speed() {
      this.update()
    },
    threshold() {
      this.update()
    }
  }
}
</script> -->

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~common/stylus/variable.styl'
  .slide
    min-height 1px
    position relative
    .slide-group
      position relative
      overflow hidden
      white-space nowrap
      .slide-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
          img
            display block
            width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>

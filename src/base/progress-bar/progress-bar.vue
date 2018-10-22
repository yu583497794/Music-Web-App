<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner" @click="progressClick">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  name: 'progress-bar',
  data () {
    return {

    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick (e) {
      // console.log('click')
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 当点击processBtn的时候 e.offsetX获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      // 基础组件不执行 只派发
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0 , 0)`
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0 , 0)`
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      left 0
      height 4px
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        width 30px
        height 30px
        top -13px
        left -8px
        .progress-btn
          position relative
          top 7px
          left 7px
          width 16px
          height 16px
          box-sizing border-box
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
  // .progress-bar
  //   height 30px
  //   .bar-inner
  //     position relative
  //     height 6px
  //     width 100%
  //     top 50%
  //     transform translate3d(0, -50%, 0)
  //     font-size 0
  //     background $color-background
  //     .progress
  //       position relative
  //       display inline-block
  //       vertical-align top
  //       height 6px
  //       top 50%
  //       transform translate3d(0, -50%, 0)
  //       background $color-theme
  //     .progress-btn-wrapper
  //       position relative
  //       display inline-block
  //       width 16px
  //       height 16px
  //       background $color-text
  //       border-radius 50%
  //       text-align center
  //       top 50%
  //       transform translate3d(0, -50%, 0)
  //       .progress-btn
  //         position relative
  //         display inline-block
  //         width 8px
  //         height 8px
  //         background $color-theme
  //         border-radius 50%
  //         top 50%
  //         transform translate3d(0, -50%, 0)
</style>

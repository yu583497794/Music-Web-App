<template>
  <div ref='wrapper' class="scroll" >
    <slot class="wheelscroll"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {EventUtil} from 'common/js/util'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 上拉刷新
    pullup: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
      const elem = document.getElementsByClassName('wheelscroll')
      // console.log(elem)
      EventUtil.addHandler(document, 'mousewheel', this.mouseWheelHandler)
      EventUtil.addHandler(elem, 'mousewheel', this.mouseWheelHandler)
    })
    // setTimeout(() => {
    //   this._initScroll()
    // }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      // this.$nextTick(() => {
      // console.log('%%%')
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        let me = this
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 只派发事件，不做逻辑
            me.$emit('scrollToEnd')
          }
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      // console.log('scrollToElement')
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    mouseWheelHandler (event) {
      if (!this.scroll) {
        return
      }
      const velocity = 20
      event = EventUtil.getEvent()
      EventUtil.getStop(event)
      EventUtil.getPrevent(event)
      const delta = event.wheelDelta > 0 ? velocity : -velocity
      this.scroll.scrollBy(0, delta, 100)
    }
  },
  watch: {
    data () {
      // const temp = () => {
      //   if (!this.data) {
      //     console.log(this.data.length)
      //     temp()
      //   }
      //   setTimeout(() => {
      //     console.log(this.data.length)
      //     this.refresh()
      //   }, 20)
      // }
      // temp()
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  activated () {
    EventUtil.addHandler(document, 'mousewheel', this.mouseWheelHandler)
  },
  deactivated () {
    EventUtil.removeHandler(document, 'mousewheel', this.mouseWheelHandler)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

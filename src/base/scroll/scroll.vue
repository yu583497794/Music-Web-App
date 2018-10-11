<template>
  <div ref='wrapper' class="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
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
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

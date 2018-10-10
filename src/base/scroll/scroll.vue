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
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
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

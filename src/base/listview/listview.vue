<template>
  <scroll
  :data="data"
  class="listview"
  ref="listview"
  :listenScroll="listenScroll"
  :probeType="probeType"
  @scroll="scroll"
  >
    <ul class="list-wrapper" ref="listWrapper">
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <!-- 点击将item传入 -->
          <li @click="selectItem(item)" v-for="(item, index) in group.items" :key="index" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
        v-for="(item, index) in shortcutList"
        :key="index"
        class="item"
        :class="{'current': currentIndex === index}"
        :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div v-show="scrollY < 0" class="list-fixed" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData, prefixStyle} from 'common/js/dom'
import {EventUtil} from 'common/js/util'
const transform = prefixStyle('transform')
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'listvue',
  // 在created中定义touch并不需要监听其变化
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
    EventUtil.addHandler(document, 'mousewheel', this.onMousewheel)
  },
  // props computed与数据做绑定，以监听
  props: {
    data: {
      type: Array,
      default: null,
      fixedTop: 0
    }
  },
  data () {
    return {
      scrollY: -1,
      diff: 0,
      currentIndex: 0,
      maxScrollY: 0
    }
  },
  computed: {
    // 与this.data绑定
    shortcutList () {
      // map迭代方法，返回每次函数调用的结果组成的数组
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (!this.data[this.currentIndex]) {
        return
      }
      let title = this.data[this.currentIndex].title
      return title
    }
  },
  methods: {
    // 需要在两个函数间共享
    onShortcutTouchStart (elem) {
      let anchorIndex = getData(elem.target, 'index')
      let firstTouch = elem.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = parseInt(anchorIndex)
      this._scrollTo(this.touch.anchorIndex)
      // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      // this.currentIndex = parseInt(anchorIndex)
    },
    onShortcutTouchMove(elem) {
      let firstTouch = elem.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // console.log(anchorIndex)
      this._scrollTo(anchorIndex)
      // this.currentIndex = anchorIndex
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index > this.listHeight - 2) {
        index = this.listHeight - 2
      }
      this.scrollY = -(this.listHeight[index])
      // console.log('scrollTo', this.listHeight[index])
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // scroll事件触发
    scroll(pos) {
      this.scrollY = pos.y
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      this.maxScrollY = this.listHeight[list.length - 1] - this.$refs.listview.$el.clientHeight
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    onMousewheel (event) {
      const velocity = 20
      event = EventUtil.getEvent(event)
      EventUtil.getPrevent(event)
      const deltaY = event.wheelDelta > 0 ? velocity : -velocity
      // console.log(Math.max(this.scrollY + deltaY, -this.maxScrollY))
      this.scrollY = Math.min(0, Math.max(this.scrollY + deltaY, -this.maxScrollY))
      this.$refs.listWrapper.style[transform] = `translate3d(0, ${this.scrollY}px, 0)`
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      // console.log('???')
      const listHeight = this.listHeight
      // 当滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部, 且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      // 两个标题栏的总高度是 TITLE_HEIGHT
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? TITLE_HEIGHT - newVal : 0
      // 减少DOM操作
      if (this.fixedTop === fixedTop) {
        // console.log('nothing')
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, -${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll
  },
  deactivated () {
    EventUtil.removeHandler(document, 'mousewheel', this.onMousewheel)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    // .list-wrapper
    //   position absolute
    //   top 0
    //   left 0
    //   width 100%
    //   height 100%
    //   overflow hidden
    .list-group
      padding-bottom 30px
      .list-group-title
        padding-left 20px
        background $color-highlight-background
        line-height 30px
        font-size $font-size-small
        color $color-text-l
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          display inline-block
          width 50px
          height 50px
          // vertical-align middle
          margin-right 20px
          // box-sizing border-box
          border-radius 50%
        .name
          display inline-block
          vertical-align middle
          // line-height 50px
          font-size $font-size-medium
          color $color-text-l
    .list-shortcut
      position absolute
      right 0
      top 0
      z-index 30
      height 100%
      width 20px
      background $color-background
      ul
        display flex
        height 100%
        flex-direction column
        justify-content center
        align-items flex-start
        align-content center
        .item
          // display inline-block
          flex 0 0 auto
          width 20px
          padding 3px 0
          text-align center
          line-height 1
          font-size $font-size-small
          color $color-text-l
          &.current
            color $color-text
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      // z-index 50
      .fixed-title
        padding-left 20px
        background $color-highlight-background
        line-height 30px
        font-size $font-size-small
        color $color-text-l
</style>

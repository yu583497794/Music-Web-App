<template>
  <scroll class="search-list" v-show="searches.length">
    <ul>
      <li v-for="(item, index) in searches" :key="index" class="item">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
export default {
  name: 'search-list',
  data () {
    return {

    }
  },
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .search-list
    overflow hidden
    .item
      display flex
      height 40px
      align-items flex-start
      justify-content space-between
      color $color-text-l
      .text
        font-size $font-size-medium
      .icon
        font-size $font-size-medium
        color $color-text-l
</style>

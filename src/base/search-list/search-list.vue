<template>
  <div class="search-list" v-show="searches.length" :data="searches">
    <ul>
      <li @click="selectItem(item)" v-for="(item, index) in searches" :key="index" class="item">
        <span class="text">{{item}}</span>
        <!-- 防止冒泡 -->
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
// import Scroll from 'base/scroll/scroll'
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
  methods: {
    selectItem (item) {
      console.log('select')
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
  // components: {
  //   Scroll
  // }
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

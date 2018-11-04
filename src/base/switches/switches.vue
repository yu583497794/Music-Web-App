<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index" :class="{'active':index===currentIndex}"
    @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'switches',
  props: {
    switches: {
      type: Array,
      default: null
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem (item) {
      this.$emit('switch', item)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .switches
    display flex
    align-items center
    width 240px
    margin 0 auto
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding 8px
      border-right 1px solid $color-highlight-background
      text-align center
      font-size $font-size-medium
      color $color-text-d
      .switch-item:last-child
        border-right none
      &.active
        background: $color-highlight-background
        color: $color-text
</style>

<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Fairy Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'm-header'
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin.styl"
  .m-header
    position relative
    height 44px
    text-align center
    font-size 0
    color $color-theme
    .icon
      display inline-block
      vertical-align top
      margin-top 6px
      width 30px
      height 32px
      margin-right 9px
      bg-image('logo')
      background-size 30px 32px
    .text
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
    .mine
      position absolute
      top 0
      right 0
      .icon-mine
        display block
        color $color-theme
        padding 12px
        font-size 20px
</style>

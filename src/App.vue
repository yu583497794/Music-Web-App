<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive标签，将DOM缓存到内存中，不会重复发送请求，页面不会闪 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "common/stylus/variable"
</style>

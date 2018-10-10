<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive标签，将DOM缓存到内存中，不会重复发送请求，页面不会闪 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "common/stylus/variable"
</style>

<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'base/suggest/suggest'
export default {
  name: 'search',
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    }
  },
  created () {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .search
    position fixed
    top 88px
    bottom 0px
    width 100%
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        margin 0 20px
        .hot-key
          .title
            font-size $font-size-medium
            color $color-text-l
            margin-bottom 20px
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            background $color-highlight-background
            border-radius 6px
            font-size $font-size-medium
            color $color-text-d
    .search-result
      position fixed
      top 178px
      bottom 0
      width 100%
</style>

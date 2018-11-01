<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length" ref="history">
            <h1 class="title" ref="historyTitle">
              <span class="text">搜索历史</span>
              <!-- <span class="clear" @click.stop="deleteAll"> -->
              <span class="clear" @click.stop="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="search-list-wrapper" ref="historyList" v-show="searchHistory">
              <!-- <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list> -->
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'base/suggest/suggest'
import {mapActions} from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playlistMixin, searchListMixin} from 'common/js/mixin'
export default {
  name: 'search',
  mixins: [playlistMixin, searchListMixin],
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // addQuery (query) {
    //   this.$refs.searchBox.setQuery(query)
    // },
    onQueryChange (query) {
      this.query = query
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
      // console.log(this.searchHistory)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    // deleteOne (item) {
    //   this.deleteSearchHistory(item)
    // },
    // deleteAll () {
    //   this.clearSearchHistory()
    // },
    // _setHistoryTop () {
    //   // const top = this.$refs.history.clientTop + this.$refs['history-title'].offsetHeight
    //   const rect = this.$refs.historyTitle.getBoundingClientRect()
    //   console.log(rect)
    //   console.log(rect.bottom)
    //   this.$refs.historyList.style.top = `${rect.bottom}px`
    // },
    ...mapActions([
      'saveSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.saveSearchHistory)
    }
    // ...mapGetters([
    //   'searchHistory'
    // ])
  },
  created () {
    this._getHotKey()
    console.log(this.$refs)
    // this._setHistoryTop()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
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
        height 100%
        overflow hidden
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
        .search-history
          .title
            display flex
            justify-content space-between
            font-size $font-size-medium
            color $color-text-l
            margin 20px 0
          // .search-list-wrapper
          //   position fixed
          //   left 0
          //   right 0
          //   bottom 0
    .search-result
      position fixed
      top 178px
      bottom 0
      width 100%
</style>

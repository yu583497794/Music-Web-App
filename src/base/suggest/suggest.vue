<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDiscName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
// 不应该暴露类方法
// import {filterSinger} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import {createSong} from 'common/js/song'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  name: 'suggest',
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search () {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        // console.log(res.data)
        if (res.code === ERR_OK) {
          // console.log(res)
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      // console.log(data.song)
      if (data.song) {
        ret = ret.concat(this._normalize(data.song.list))
      }
      return ret
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      } else {
        this.hasMore = true
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDiscName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _normalize (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        this.result = this.result.concat(this._genResult(res.data))
        // console.log(this.result)
        this._checkMore(res.data)
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // 派发事件，不处理逻辑
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
  .suggest
    margin 0 20px
    background $color-background
    height 100%
    overflow hidden
    .suggest-list
      color $color-text-l
      .suggest-item
        display flex
        align-items center
        padding-bottom 10px
        .icon
          flex none
          margin-right 10px
        .name
          flex 1
          font-size $font-size-medium
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
</style>

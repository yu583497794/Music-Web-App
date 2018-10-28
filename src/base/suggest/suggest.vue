<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDiscName(item)"></p>
        </div>
      </li>
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
const TYPE_SINGER = 'singer'
export default {
  name: 'suggest',
  data () {
    return {
      result: []
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
      search(this.query, this.page, this.showSinger).then((res) => {
        console.log(res.data)
        if (res.code === ERR_OK) {
          console.log(res)
          this.result = this._genResult(res.data)
        }
      })
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      console.log(data.song)
      if (data.song) {
        ret = ret.concat(this._normalize(data.song.list))
      }
      return ret
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
    }
  },
  watch: {
    query () {
      this.search()
    }
  },
  components: {
    Scroll
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

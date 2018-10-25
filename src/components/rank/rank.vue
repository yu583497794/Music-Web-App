<template>
  <div class="rank">
    <scroll class="toplist" :data="toplist" v-show="toplist">
      <ul>
        <li class="item" v-for="(item, index) in toplist" :key="index">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <loading v-show="!toplist"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
import {getRank} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
export default {
  name: 'rank',
  data () {
    return {
      toplist: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  created () {
    this._getRank()
  },
  methods: {
    _getRank () {
      getRank().then((res) => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .rank
    position fixed
    top: 90px
    left: 0
    bottom: 0
    overflow hidden
    .toplist
      width: 100%
      height: 100%
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        flex: 0
        .icon
          flex 0 0 100px
          vertical-align top
        .songlist
          flex 1 1 auto
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            nowrap()
            line-height 26px
</style>

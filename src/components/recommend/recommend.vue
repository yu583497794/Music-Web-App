<template>
  <div class="recommend" ref="recommend">
    <!-- 必须确定scroll容器的高度！ -->
    <!-- scroll标签与scroll component的容器标签div共享class -->
    <!-- 因此必须指定scroll的高度，否则scroll不起作用 -->
    <scroll ref="scroll" :data="songList" class="recommend-content">
      <div>
        <div class="slide-wrapper">
          <slide :autoPlay=true>
            <div v-if="recommends.length" v-for="(item, index) in recommends" :key ="index">
              <a :href="item.linkUrl">
                <!-- better-scroll 与 fastclick冲突 添加needsclick fastclick会识别 -->
                <img class="needsclick" @load="loadImg" :src="item.picUrl">
              </a>
            </div>
          </slide>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">
            热门歌单推荐
          </h1>
          <ul class="song-list" v-for="(item, index) in songList" :key=index>
            <li class="song-item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picUrl" alt="pic">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListDesc}}</h2>
                <p class="desc">{{item.songListAuthor}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 添加外部容器用于定位loading到中部 -->
      <div class="loading-wrapper" v-show="!songList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
// eslint-disable-next-line
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config'
import Slide from 'base/slide/slide'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
export default {
  name: 'recommend',
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      songList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          this.songList = res.data.songList
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        // "msg":"please login" 尚不能请求到针对特定用户的推荐页
        console.log('getDiscListcl')
        console.log(res)
        if (res.code === ERR_OK) {
          console.log(res)
        }
      })
    },
    // 哪怕slider后渲染出来 也会正确滚动
    loadImg () {
      // 标志位确保只一次
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  components: {
    Slide,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~common/stylus/variable'
  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    // flex-direction column
    .recommend-content
      height 100%
      overflow hidden
      .recommend-list
        .list-title
          line-height 44px
          font-size $font-size-medium
          color $color-theme
          text-align center
        .song-list
          .song-item
            display flex
            // padding 10px 0px
            // margin 0px 20px
            padding 0 20px 20px 20px
            box-sizing border-box
            // flex属性 在交叉轴上如何对齐
            align-items center
            // overflow hidden
            font-size 0
            .icon
              flex 0 0 60px
              width 60px
              padding-right 20px
              vertical-align top
              // img
              //   height 60px
              //   width 60px
            .text
              flex 1
              display flex
              flex-direction column
              justify-content center
              overflow hidden
              line-height 20px
              font-size $font-size-medium
              // margin-left 20px
              // vertical-align top
              .name
                white-space nowrap
                text-overflow ellipsis
                overflow hidden
                margin-bottom 20px
                color $color-text
              .desc
                color $color-text-d
      .loading-wrapper
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>

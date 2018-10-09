<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <slider :autoPlay=true>
          <div v-if="recommends.length" v-for="(item, index) in recommends" :key ="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">
          热门歌单推荐
        </h1>
        <ul>
        </ul>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend} from 'api/recommend.js'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
export default {
  name: 'recommend',
  data () {
    return {
      recommends: []
    }
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    }
  },
  components: {
    Slider
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~common/stylus/variable'
  .recommend
    display flex
    width 100%
    overflow hidden
    flex-direction column
    .recommend-list
      .list-title
        line-height 44px
        font-size $font-size-medium
        color $color-theme
        text-align center
</style>

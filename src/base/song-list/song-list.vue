<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" :key="index" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: null
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .song-list
    position flex
    bottom 0
    width 100%
    .item
      padding 20px 20px 0 20px
      font-size: $font-size-medium
      .content
        line-height 20px
      .name
        color $color-text
      .desc
        color $color-text-d
</style>

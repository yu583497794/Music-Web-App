<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers"></list-view>
    <router-view ></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
// class Singer
import Singer from 'common/js/singer'
import Pinyin from 'common/js/ChinesePY'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'singer',
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created () {
    this._getSingerList()
    // 设置定时器这样确保this.singer已存在
    // setTimeout(() => {
    //   this._normalizeSinger(this.singers)
    // }, 200)
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.singerList.data.singerlist)
        }
      })
    },
    // 此时的list是根据歌手的热度排序的，不符合名字首字母排序
    _normalizeSinger (list) {
      // console.log(list)
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.singer_name,
            id: item.singer_mid
          }))
        }
        // JS实现获取汉字首字母拼音、全拼音及混拼音的方法_javascript技巧_脚本之家 https://www.jb51.net/article/128190.htm
        item.Findex = Pinyin.GetJP(item.singer_name.substr(0, 1))
        // console.log('Findex', item.Findex)
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.singer_mid,
          name: item.singer_name
        }))
      })
      // console.log(map)
      // 为了得到有序列表，需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        // 升序排列
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 一维数组
      return hot.concat(ret)
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 当一个组件需要获取多个状态时候，使用mapState辅助函数，其返回一个对象
    // 使用对象展开运算符...将此对象混入到外部对象中
    // // 将 `this.setSinger()` 映射为 `this.$store.commit('setSinger')`
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>

import * as types from './mutation-types'
// 修改方法
const mutations = {
  // 使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_RECENT_PLAYLIST](state, recentPlaylist) {
    state.recentPlaylist = recentPlaylist
  },
  [types.SET_LIKE_LIST](state, likeList) {
    state.likeList = likeList
  }
  // [types.SET_TOPLIST_ID](state, id) {
  //   state.toplistId = id
  // }
}
export default mutations
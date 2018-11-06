// “getter”（可以认为是 store 的计算属性）。
// 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，
// 且只有当它的依赖值发生了改变才会被重新计算。
// (state) => { return state.singer}
export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
  // console.log(state.playlist[state.currentIndex])
  return state.playlist[state.currentIndex] || {}
}
export const disc = (state) => state.disc
export const topList = (state) => state.topList
export const searchHistory = (state) => state.searchHistory
export const recentPlaylist = (state) => state.recentPlaylist
export const likeList = (state) => state.likeList
import * as types from './mutation-types'
// 修改方法
const mutations = {
  // 使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}
export default mutations
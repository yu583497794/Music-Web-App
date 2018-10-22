// 与模块相关的数据
import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  // 当前播放列表
  playlist: [],
  // 歌手页默认列表
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
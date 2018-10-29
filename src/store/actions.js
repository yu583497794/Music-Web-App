import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch} from 'common/js/cache'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_SEQUENCE_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  // slice创建副本
  let playlist = state.playlist.slite()
  let sequenceList = state.sequenceList.slite()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲，并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  playlist.splite(currentIndex, 0, song)
  if (fpIndex > -1) {
    // 当前插入的序号大于已存在的序号
    if (currentIndex > fpIndex) {
      playlist.splite(fpIndex, 1)
      currentIndex--
    } else { // 当前插入的序号小于已存在的序号 先findIndex后插入 所以获得的fpIndex受到影响 后移一位 应该+1
      playlist.splite(fpIndex + 1, 1)
    }
  }
  // 找到在sequencelist中插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splite(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splite(fsIndex, 1)
    } else {
      sequenceList.splite(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  console.log('saveSearch')
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
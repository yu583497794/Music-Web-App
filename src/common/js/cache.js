// 缓存逻辑
import storage from 'good-storage'
// __XX__内部值
const SEARCH_KEY = '__search__'
const RECENT_KEY = '__recent__'
const LIKE_KEY = '__like__'
const SEARCH_MAX_LENGTH = 15
const RECENT_MAX_LENGTH = 15
const LIKE_MAX_LENGTH = 100
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  // 把query插入到已有的列表中
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  return storage.set(SEARCH_KEY, searches)
}
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function saveRecent (song) {
  let recents = storage.get(RECENT_KEY, [])
  insertArray(recents, song, (item) => {
    return item.id === song.id
  }, RECENT_MAX_LENGTH)
  return storage.set(RECENT_KEY, recents)
}

export function loadRecent() {
  return storage.get(RECENT_KEY, [])
}

export function loadLike() {
  console.log('loadLike')
  return storage.get(LIKE_KEY, [])
}

export function saveLike (like) {
  let likeList = storage.get(LIKE_KEY, [])
  insertArray(likeList, like.id, (id) => {
    return id === like.id
  }, LIKE_MAX_LENGTH)
  return storage.set(LIKE_KEY, likeList)
}
export function deleteLike(like) {
  let likeList = storage.get(LIKE_KEY, [])
  deleteFromArray(likeList, (id) => {
    return like.id === id
  })
  return storage.set(LIKE_KEY, likeList)
}
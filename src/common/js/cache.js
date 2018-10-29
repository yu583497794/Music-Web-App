// 缓存逻辑
import storage from 'good-storage'
// __XX__内部值
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splite(index, 1)
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
  storage.set(SEARCH_KEY, searches)
}
export function loadSearch () {
  console.log('loadSearch')
  return storage.get(SEARCH_KEY, [])
}
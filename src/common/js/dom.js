export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  // split成数组 添加 连接成字符串
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  // 开头或空白字符 结尾或空白字符
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
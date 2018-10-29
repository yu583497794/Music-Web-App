function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export const EventUtil = {
  addHandler: (el, type, handler) => {
    if (el.addEventListener) {
      el.addEventListener(type, handler, false)
    } else {
      if (el.attachEvent) {
        el.attachEvent('on' + type, handler)
      } else {
        el['on' + type] = handler
      }
    }
  },
  removeHandler: (el, type, handler) => {
    if (el.addEventListener) {
      el.removeEventListener(type, handler, false)
    } else {
      if (el.attachEvent) {
        el.detachEvent('on' + type, handler)
      } else {
        el['on' + type] = null
      }
    }
  },
  getEvent: (event) => {
    // eslint-disable-next-line
    return event ? event : window.event
  },
  getTarget: (event) => {
    if (event.target) {
      return event.target
    } else {
      return event.srcElement
    }
  },
  getPrevent: (event) => {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  getStop: (event) => {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  }
}
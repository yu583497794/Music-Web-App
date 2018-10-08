import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  // Vue挂在到#app element
  el: '#app',
  // render方法 (createElement: () => VNode) => VNode
  // Vue 选项中的 render 函数若存在，
  // 则 Vue 构造函数不会从 template 选项或通过 el 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。
  render: h => h(App),
  router
})

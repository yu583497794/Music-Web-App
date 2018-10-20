# vue-music

> 音乐播放器
---
>参考
- [qq music api ](https://blog.csdn.net/weixin_41735943/article/details/82469069)
- [qq music api 2018 ](https://blog.csdn.net/xiayiye5/article/details/79487560)
- [song api](https://gitee.com/yangleilangyan/codes/lfpev3h0ngcasm54zoubi53)
>[Vuex](https://vuex.vuejs.org/zh/)
- 一种设计思想
- 状态修改可预测(闭环，只有通过commit mutation修改数据)
- 适用Vuex：
  1. 应用复杂，数据关联度低，数据被组件共享；
  2. 路由间的复杂数据传递
- State
  1. Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）,通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到。
  2. mapState 辅助函数:当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，可以使用 mapState 辅助函数帮助生成计算属性。
  3. 对象展开符...
- Getter
  1. Vuex 允许在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
  2. Getter 接受 state 作为其第一个参数,也可以接受其他 getter 作为第二个参数 dfunName: (state, getters) => {}
  3. 通过属性访问 store.getter.doneTodos, getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的
  4. 通过方法访问，通过让 getter 返回一个函数，来实现给 getter 传参，注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果

>[transition](https://cn.vuejs.org/v2/guide/transitions.html)
1. `v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除
2. `v-enter-active`:定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数
3. `v-enter-to`:定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
4. `v-leave`:定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`:定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`:定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。
>[animation](https://github.com/HenrikJoreteg/create-keyframe-animation)
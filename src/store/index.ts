import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'

// 为 store state 声明类型
export interface State {
  count: number
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

// 创建一个新的 store 实例
export const store = createStore<State>({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
// 定义自己的 'useStore' 组合式函数，减少传key值的操作
export function useStore () {
  return baseUseStore(key)
}

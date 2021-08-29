import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import { IUserInfo, IMenu } from '@/api/types/common'
// import { setItem, getItem } from '@/utils/storage'
// import { USER } from '@/utils/constants'
import createPersistedState from 'vuex-persistedstate'

const state = {
  isCollapse: false,
  user: null as ({ token: string } & IUserInfo) | null,
  // user: getItem<{ token: string } & IUserInfo>(USER),
  menus: [] as IMenu[]
}

export type State = typeof state

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('store')

// 创建一个新的 store 实例
export const store = createStore<State>({
  plugins: [createPersistedState()],
  state,
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
    },

    setUser (state, payload) {
      state.user = payload
      // setItem(USER, state.user)
    },

    setMenus (state, payload) {
      state.menus = payload
    }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}

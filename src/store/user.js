import { reactive, readonly } from 'vue'

/**
 * 极简的登录态存储：项目里还没有引入 pinia/vuex，登录态又只需要被少数几个
 * 组件读取（LoginBanner、AppSearchBar 头像、登录页），所以没有必要为此引入新依赖，
 * 用一个模块级的 reactive 单例即可 —— 这就是本项目的"store"。
 */

const STORAGE_KEY = 'auth'

const state = reactive({
  token: '',
  userInfo: null, // { id, nickname, avatar, phone }
})

function restore() {
  const saved = uni.getStorageSync(STORAGE_KEY)
  if (saved && saved.token) {
    state.token = saved.token
    state.userInfo = saved.userInfo || null
  }
}
restore()

function setSession({ token, userInfo }) {
  state.token = token
  state.userInfo = userInfo
  uni.setStorageSync(STORAGE_KEY, { token, userInfo })
}

function logout() {
  state.token = ''
  state.userInfo = null
  uni.removeStorageSync(STORAGE_KEY)
}

function isLoggedIn() {
  return !!state.token
}

export const userStore = {
  state: readonly(state),
  setSession,
  logout,
  isLoggedIn,
}

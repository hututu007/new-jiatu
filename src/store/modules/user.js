/**
 * 用户信息存store,cookie
 */
import { login, logout, getInfo } from '@/api/login'
import { setCookie } from '@/utils/auth'

const user = {
  /* 定义一个用户信息存取的对象 */
  state: {
    id: '',
    name: '',
    avatar: '',
    resIds: [],
    realName: '',
    userName: '',
    session: false,
    barList: []
  },
  /* 更改vuex中缓存用户信息 */
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_IDS: (state, resIds) => {
      state.resIds = resIds
    },
    SET_SESSION: (state, session) => {
      state.session = session
    },
    SET_POINT: (state, point) => {
      state.point = point
    },
    SET_ORGID: (state, orgId) => {
      state.orgId = orgId
    },
    BAR_LIST: (state, barList) => {
      state.barList = barList
    }
  },

  actions: {
    /**
     * 登录
     * @param commit 触发mutations中的SET_ID、SET_RESIDS
     * @param userInfo 用户登录信息（账号、密码）
     */
    Login({ commit }, userInfo) {
      const userName = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        login(userName, userInfo.userPwd).then(response => {
          /* 登录信息存cookie */
          for (var key in response.data) {
            setCookie('jiatu_' + key, response.data[key], {
              expires: new Date().getTime() + 1e3 * 60 * 60 * 24,
              path: '/'
            })
          }
          commit('SET_ID', response.data.userId)
          commit('SET_IDS', response.data.resIds)
          commit('SET_SESSION', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取用户信息
     * @param commit 触发mutations中的SET_NAME、SET_AVATAR
     * @param state vuex中保存的数据
     */
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.id).then(response => {
          const data = response.data
          commit('SET_NAME', data.groupName)
          commit('SET_AVATAR', data.logoUrl)
          commit('SET_SESSION', true)
          commit('SET_POINT', { lng: data.longitude, lat: data.latitude })
          commit('SET_ORGID', data.id) // 机构ID
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 用户退出
     * @param commit 触发mutations中的SET_ID、SET_RESIDS
     * @param state vuex中保存的数据
     */
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.id).then(() => {
          commit('SET_ID', '')
          commit('SET_IDS', [])
          commit('SET_SESSION', false)

          // removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 前端 退出
     * @param commit 触发mutations中的SET_ID
     */
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ID', '')
        commit('SET_SESSION', false)
        // removeToken()
        resolve()
      })
    }
  }
}

export default user

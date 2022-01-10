import Vue from 'vue'
import Vuex from 'vuex'
import { login } from '@/api/user'

Vue.use(Vuex)

const state = {
  name: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

const store = new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions
})

export default store

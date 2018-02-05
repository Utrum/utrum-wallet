import modules from './index'


const state = {
  loggedIn: false,
  passphrase: ''
}

const getters = {
  isLogged: (state) => {
    return state.loggedIn
  },
  passphrase: (state) => {
    return state.passphrase
  }
}

const mutations = {
  USER_LOGIN (state) {
    state.loggedIn = true
  },
  USER_LOGOUT (state) {
    state.loggedIn = false
  },
  SET_PASSPHRASE (state, passphrase) {
    state.passphrase = passphrase
  }
}

const actions = {
  login ({ commit }, passphrase) {
    console.log('LOGIN ACTION')
    console.log(passphrase.value)
    commit('SET_PASSPHRASE', passphrase.value)
    commit('USER_LOGIN')
  },
  logout({commit, dispatch}) {
    dispatch('destroyWallets', {}, {root: true})
    commit('SET_PASSPHRASE', '')
    commit('USER_LOGOUT')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
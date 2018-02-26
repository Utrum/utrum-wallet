import modules from './index'


const state = {
  loggedIn: false,
  testMode: true,
  passphrase: ''
}

const getters = {
  isLogged: (state) => {
    return state.loggedIn
  },
  passphrase: (state) => {
    return state.passphrase
  },
  isTestMode: (state) => {
    return state.testMode
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
  },
  SET_TESTMODE (state, testMode) {
    state.testMode = testMode
  }
}

const actions = {
  login ({ commit, dispatch }, {passphrase, testMode}) {
    commit('SET_PASSPHRASE', passphrase)
    commit('USER_LOGIN')
    dispatch('setTestMode', testMode)
  },
  setTestMode({ commit }, testMode) {
    commit('SET_TESTMODE', testMode)
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
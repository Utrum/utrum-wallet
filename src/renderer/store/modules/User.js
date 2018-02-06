const state = {
  loggedIn: false
}

const mutations = {
  USER_LOGIN (state) {
    state.loggedIn = true
  },
  USER_LOGOUT (state) {
    state.loggedIn = false
  }
}

const actions = {
  toggleLoggedIn (context) {
    if (state.loggedIn) {
      this.commit('USER_LOGOUT')
    } else {
      this.commit('USER_LOGIN')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
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

export default {
  state,
  mutations,
  // actions
}
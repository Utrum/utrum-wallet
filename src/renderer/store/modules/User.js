const state = {
  loggedIn: false,
  testMode: true,
  passphrase: 'default',
  privKey: '',
};

const getters = {
  isLogged: (state) => {
    return state.loggedIn;
  },
  passphrase: (state) => {
    return state.passphrase;
  },
  isTestMode: (state) => {
    return state.testMode;
  },
  privKey: (state) => {
    return state.privKey;
  },
};

const mutations = {
  USER_LOGIN(state) {
    state.loggedIn = true;
  },
  USER_LOGOUT(state) {
    state.loggedIn = false;
  },
  SET_PASSPHRASE(state, passphrase) {
    state.passphrase = passphrase;
  },
  SET_TESTMODE(state, testMode) {
    state.testMode = testMode;
  },
  SET_PRIVKEY(state, privKey) {
    state.privKey = privKey;
  },
};

const actions = {
  setPrivKey({ commit }, privKey) {
    commit('SET_PRIVKEY', privKey);
  },
  login({ commit, dispatch }, passphrase) {
    dispatch('startUpdates');
    dispatch('updateConfig', {}, { root: true });
    commit('SET_PASSPHRASE', passphrase);
    commit('USER_LOGIN');
  },
  setTestMode({ commit }, testMode) {
    commit('SET_TESTMODE', testMode);
  },
  logout({ commit, dispatch }) {
    dispatch('setIsUpdate', false);
    dispatch('destroyWallets', {}, { root: true });
    commit('SET_PASSPHRASE', '');
    commit('USER_LOGOUT');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

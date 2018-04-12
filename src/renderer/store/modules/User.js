import { coins } from 'libwallet-mnz';

const state = {
  loggedIn: false,
  testMode: true,
  passphrase: 'default',
  privKey: '',
  enabledCoins: ['BTC', 'KMD', 'MNZ'],
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
  enabledCoins: (state) => {
    return state.enabledCoins.map(ticker => coins.get(state.testMode ? `TEST${ticker}` : ticker));
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

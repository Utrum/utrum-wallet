import axios from 'axios';

const state = {
  minConfirmations: 1,
  config: {},
  pubKeysBuy: {
    btc: 'tpubDAh8QLsBrBjfnHpLmz9gJKt4nhop1hTpQtM9Tr1N6ZAUGV22PFxtExzcWvi9nH9HytSNnJZQ7xmLQB7BxGjRQB7N5sp7fJz1Uka8PY58xc6',
    kmd: 'xpub6BRkm5Z8kjoCUceL1HWCVbtAFy7mth5sR7gPFr6zhPAboqFr45AyY5nwHMMS3RkNEiFCMucK8zhGUJxfYLqEE2cgWEubmHJGK9AFe2dJnFn',
  },
};

const getters = {
  getMinConfirmations: (state) => {
    return state.minConfirmations;
  },
  getConfig: (state) => {
    return state.config;
  },
  getPubKeysBuy: (state) => {
    return state.pubKeysBuy;
  },
};

const mutations = {
  SET_CONFIG(state, config) {
    state.config = config;
    state.config.maxBuy -= state.config.minBuy;
  },
};

const actions = {
  startUpdateConfig({ commit, dispatch, rootGetters }) {
    return pullConfiguration()
      .then((config) => {
        commit('SET_CONFIG', config);
        setTimeout(() => {
          dispatch('startUpdateConfig');
        }, getRefreshRate(rootGetters.icoWillBegin));
      })
    ;
  },
};

const getRefreshRate = (icoWillBegin) => {
  const min = icoWillBegin ? 20 : 30;
  const max = icoWillBegin ? 50 : 30;
  return Math.floor(Math.random() * (((max - min) + 1) + min)) * 1000;
};

const pullConfiguration = () => {
  return axios
    .get('http://51.15.203.171/icoClientConfiguration.json')
    .then(response => {
      return response.data;
    })
  ;
};

export default {
  state,
  getters,
  mutations,
  actions,
};

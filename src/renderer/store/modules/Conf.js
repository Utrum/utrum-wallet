import axios from 'axios';

const state = {
  config: {},
  pubKeysBuy: {
    btc: 'tpubDDhuDCoxWD9ah9iTi6s1YAwqS2wQ6PLig3eWFp3sU1ruB6ULvhC4Un65jgcQ18SF1EcCAMWHp1GdGzPS5XxAE1dxYnF6bcRYqnAGvx7st8s',
    kmd: 'xpub6CRoKaY7ZtdHyU9nr2HtcvakyEWA9SEwaGky2hJu5DtgNrS5UsGLCJHjYQu6wpq64gnrMn4C7wykc3Gjy2JQdEpXuo7kwznv8unkTNk6rS4',
  },
};

const getters = {
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

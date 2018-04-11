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
  },
};

const actions = {
  updateConfig({ commit }) {
    const endPointConfig
    = 'http://51.15.203.171/icoClientConfiguration.json';
    axios.get(endPointConfig, {
    }).then(response => {
      console.log(response);
      commit('SET_CONFIG', response.data);
    });
  },
};


export default {
  state,
  getters,
  mutations,
  actions,
};

import axios from 'axios';

const state = {
  config: {},
};

const getters = {
  getConfig: (state) => {
    return state.config;
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
    = 'https://gist.githubusercontent.com/Kiruel/216ee8a27116a3bcf2e343dad07dc85b/raw/1a491271f840c8fe713365be83ecf525b4243485/conf.json';
    axios.get(endPointConfig, {
    }).then(response => {
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

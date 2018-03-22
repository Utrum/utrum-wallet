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
    = 'https://gist.githubusercontent.com/Kiruel/216ee8a27116a3bcf2e343dad07dc85b/raw/27b4ac35e6cf2d85d0468d81dbc8cb23e8b60d94/conf.json';
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

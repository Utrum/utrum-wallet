import axios from 'axios'

const state = {
  config: {}
}

const getters = {
  getConfig: (state) => {
    return state.config
  },
}

const mutations = {
  SET_CONFIG (state, config) {
    state.config = config
  },
}

const actions = {
  updateConfig ({ commit, dispatch }) {
    axios.get('https://gist.githubusercontent.com/Kiruel/216ee8a27116a3bcf2e343dad07dc85b/raw/99d0201884169af2a032d1242f8297b6c2e6f520/conf.json', {
      }).then(response => {
        commit('SET_CONFIG', response.data);
    });
  },
}


export default {
  state,
  getters,
  mutations,
  actions
}
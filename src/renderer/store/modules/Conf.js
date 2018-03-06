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
    axios.get('https://gist.githubusercontent.com/askz/90a7cd878374de4b088c002df05e526d/raw/35c9d6dd3fa5d7fe92f42aaef251a43c50d94fbc/conf.json', {
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
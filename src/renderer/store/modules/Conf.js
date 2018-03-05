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
    axios.get('https://gist.githubusercontent.com/askz/90a7cd878374de4b088c002df05e526d/raw/1c613bb09829e682d30da4c30f5582a203892bc9/conf.json', {
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
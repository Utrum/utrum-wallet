/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

const state = {
  loggedIn: false,
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

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

import * as _ from 'lodash';
import axios from 'axios';

const config = require('../../config/config');

const state = {
  config: {},
};

const getters = {
  getMinConfirmations: () => {
    return config.func.minConfirmations;
  },
  getConfig: (state) => {
    return state.config;
  },
  getPubKeysBuy: () => (ticker) => {
    let pubKeysForTicker = [];
    _.mapKeys(config.func.wallets, (value, key) => {
      if (ticker.toLowerCase().indexOf(key) >= 0) {
        pubKeysForTicker = value;
      }
    });
    return pubKeysForTicker;
  },
};

const mutations = {
  SET_CONFIG(state, config) {
    state.config = config;
    if (config != null) {
      state.config.maxBuy -= state.config.minBuy;
    }
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
    .get(`http://mnz.monaize.com/${config.env}.clientConfiguration.json`)
    .then(response => {
      return response.data;
    })
    .catch((error) => {
      console.log(`Can't reach configuration for current env {${config.env}}`, error); // eslint-disable-line
    })
  ;
};

export default {
  state,
  getters,
  mutations,
  actions,
};

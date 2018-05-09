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

import axios from 'axios';

const state = {
  minConfirmations: 1,
  config: {},
  pubKeysBuy: {
    btc: [
      'tpubDD7KruZCG9VjhEudjUSsLbrNpUbXTHkvhEWfcntkzEDQoYNSFUSfS7N2StNvkNjMmPXRQtD5KykV8AS9WYR4bSHJafXLdqZJJT2PRE74DpW',
      'tpubDCAwLShhpovb3NUGHZ6phv8J9V81fkCrFKeEtqLbpAKVuRo5HstyWaUxDnvFLJrWJT9mJ63EVPB927i5ffBxqW3F6jv3rd7QsGPcNxPKxHg',
      'tpubDDsv5nbDxTA1oeTH5GBaTD5cSgW6tnsmCt6m6CUeFwLiQw2QvNMR42XpbRDU2Bb3HzNbH19gJduTdpvG3wMA4AZYnHsffcnBgk3fyvpvJks',
    ],
    kmd: [
      'xpub6DN59DVPgRzka2D4xQfcD6XFQbeQ3dCuBSYQiGEXkACJULPWk6Zp6Tywj69zyvTN7JisyTPMzXWrsYfXYUiDQNHDig68CiF62G6twfj6jPf',
      'xpub6BxcxfX7jNeeKFM2NEWRuuPThowH6Lc31a1cncjccbLu46PJchHCCUZKvWPES26hjoFN8NAKUdL5EpYhucsfnKQhotQBpfHnpfMoA9MdtpY',
      'xpub6CLXAxR2HLZiWqryttxAjiCEXFMXeEYxW4hEigee5uNFJjmfUEbdwFv3puYeUJ8qLWe2QL1Ho7Hh8zH4SLnJXK4ZPaWrvJQEMz1Ua5NfdyT',
    ],
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

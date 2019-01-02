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

import { Wallet, coins, fees } from 'libwallet-utrum';
import { BigNumber } from 'bignumber.js';

import * as _ from 'lodash';
import Vue from 'vue';
import store from '../../store';
import axios from 'axios';
import getCmcData from '../../lib/coinmarketcap';
import createPrivKey from '../../lib/createPrivKey';

const config = require('../../config/config');
const coinSelect = require('coinselect');

const satoshiNb = 100000000;

const state = {
  wallets: [{
    balance: 0,
    balance_unconfirmed: 0,
    balance_usd: 0,
    ticker: null,
    rate_in_usd: 0
  }],
  coins: [],
  calculating: false,
  isUpdate: true,
};

const getters = {

  isUpdate: (state) => {
    return state.isUpdate;
  },

  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker];
  },

  getWallets: (state) => {
    return state.wallets;
  },

  getTotalBalance: (state) => {
    const walletKeys = Object.keys(state.wallets);
    let totalBalanceUsd = BigNumber(0);

    walletKeys.forEach((key) => {
      totalBalanceUsd = totalBalanceUsd.plus(state.wallets[key].balance_usd);
    });

    return totalBalanceUsd;
  },

  getBalanceByTicker: (state) => (ticker) => {
    return state.wallets[ticker].balance;
  },

  enabledCoins: () => {
    return config.func.enabledCoins.map(ticker => coins.get(ticker));
  },

  getTickerForExpectedCoin: () => (expectedCoinTicker) => {
    let theTicker;
    config.func.enabledCoins.forEach(ticker => {
      if (ticker.indexOf(expectedCoinTicker) >= 0) {
        theTicker = ticker;
      }
    });
    return theTicker;
  },
};


const mutations = {

  ADD_WALLET(state, wallet) {
    state.wallets[wallet.ticker] = Vue.set(state.wallets, wallet.ticker, wallet);
  },

  DESTROY_WALLETS(state) {
    state.wallets = {};
  },

  UPDATE_BALANCE(state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet);
  },

  UPDATE_IS_UPDATE(state, isUpdate) {
    state.isUpate = isUpdate;
  },
};


const actions = {

  setIsUpdate({ commit }, isUpdate) {
    commit('UPDATE_IS_UPDATE', isUpdate);
  },

  initWallets({ commit, dispatch, rootGetters }) {
    if (Object.keys(state.wallets).length > 0) {
      dispatch('destroyWallets');
    }

    dispatch('setPrivKey', createPrivKey(rootGetters.passphrase));

    const privateKey = rootGetters.privKey;
    const enabledCoins = rootGetters.enabledCoins;

    const promises = enabledCoins.map((coin) => {
      const ticker = coin.ticker;
      const isTestMode = ticker.indexOf('TEST') >= 0;
      const wallet = new Wallet(privateKey, coin, isTestMode);
      wallet.ticker = ticker;
      wallet.balance = 0;
      wallet.balance_usd = 0;
      wallet.privKey = privateKey;
      commit('ADD_WALLET', wallet);
    });
    return Promise.all(promises)
      .catch(() => { })
      ;
  },

  createTransaction({ commit, rootGetters }, { wallet, amount, address, speed = 'slow', data = null }) {
    let utxos;

    return listUnspent(wallet)
      .then((_utxos) => {
        utxos = _utxos;
        return getEstimatedFees(wallet, speed);
      })
      .then((feeRate) => {

        const targets = [
          {
            address,
            value: amount,
          },
        ];
        // satoshis per byte
        const feeRateInSatoshis = Math.round(BigNumber(feeRate).multipliedBy(satoshiNb).toNumber());

        const { fee } = coinSelect(utxos, targets, feeRateInSatoshis);

        let tx = wallet.prepareTx(utxos, address, amount, feeRateInSatoshis, data);
        if (tx == null) {
          tx = {
            feeRate: fee,
          };
        }
        return tx;
      })
      ;
  },

  broadcastTransaction({ commit }, { wallet, inputs, outputs, fee, dataScript = null }) {
    // create raw transaction
    var builtTx = wallet.buildTx(inputs, outputs, fee, dataScript);
    var txId = builtTx.getId();
    var rawTx = builtTx.toHex()
    // prepare url
    let baseUrl = getExplorerBaseUrl(wallet)
    let sendUrl = ( baseUrl + "/tx/send" )
    // make call to api to get utxos
    return axios
      .post( sendUrl, {rawtx: rawTx} )
      .then((response) => {
        if (txId === response.data.txid) {
          return response.data.txid
        } else {
          return Promise.reject(
            new Error(
              `Broadcast tx ${broadcastedTx} not the same as built tx ${txId}`
            )
          );
        }
      })
      .catch((error) => {
        console.log('Error broadcasting transaction:', error);
        return Promise.reject(error);
      })
  },

  destroyWallets({ commit }) {
    commit('DESTROY_WALLETS');
  },

  updateBalance({ commit, getters, rootGetters }, wallet) {
    commit('UPDATE_BALANCE', wallet);
    return getBalance(wallet)
      .catch((error) => {
        return Promise.reject(
          new Error(`Failed to retrieve ${wallet.ticker} balance\n${error}`)
        );
      })
      .then(response => {
        console.log(response) // TESTING
        wallet.balance = BigNumber(response.balance).dividedBy(satoshiNb);
        wallet.balance_unconfirmed = new BigNumber(response.unconfirmedBalance).dividedBy(satoshiNb);
        getCmcData(wallet.coin.name)
          .then(response => {
            response.data.forEach((cmcCoin) => {
              wallet.rate_in_usd = cmcCoin.price_usd;
              wallet.balance_usd = wallet.balance.multipliedBy(cmcCoin.price_usd);
            });
          })
          ;
      })
      ;
  },

  startUpdates({ dispatch }) {
    dispatch('setIsUpdate', true);
    dispatch('startUpdateBalances');
  },

  startUpdateBalances({ dispatch, getters }) {
    const min = 20;
    const max = 50;
    const rand = Math.floor(Math.random() * (((max - min) + 1) + min));
    setTimeout(() => {
      Object.keys(getters.getWallets).forEach((ticker) => {
        dispatch('updateBalance', getters.getWallets[ticker]);
      });
      if (getters.isUpdate) {
        dispatch('startUpdateBalances');
      }
    }, rand * 1000);
  },

};


const getEstimatedFees = (wallet, speed) => {
  if (wallet.ticker.indexOf('KMD') >= 0) {
    return 0.0001;
  }
  return fees.getCurrentEstimate().then(estimation => {
    const result = BigNumber(estimation[speed]).dividedBy(100000000);
    return result;
  });
};

const listUnspent = async (wallet) => {
  // prepare url
  let baseUrl = getExplorerBaseUrl(wallet)
  let utxoUrl = ( baseUrl + "/addrs/" + wallet.address + "/utxo" )
  // make call to api to get utxos
  let response = await axios.get(utxoUrl)
  // translate utxos to bitcoinjs format
  let utxos = response.data
  let output = []
  for ( let u in utxos ) {
    let utxo = utxos[u]
    let newUtxo = {
      value: utxo.satoshis,
      height: utxo.height,
      tx_hash: utxo.txid,
      tx_pos: utxo.vout
    }
    output.push(newUtxo)
  }
  return output
};

const getExplorerBaseUrl = (wallet) => {
  let coinExplorer = wallet.coin.explorer
  if ( coinExplorer.slice(-1) !== '/') {
    coinExplorer += '/'
  }
  let ticker = wallet.ticker
  let apiPath = ticker === 'BTC' ? 'api' : 'insight-api-komodo'
  let baseUrl = coinExplorer + apiPath
  return baseUrl
};

const getBalance = async (wallet) => {
  // prepare url
  let baseUrl = getExplorerBaseUrl(wallet)
  let balanceUrl = ( baseUrl + "/addr/" + wallet.address + "/balance" )
  let unconfirmedBalanceUrl = (
    baseUrl + "/addr/" + wallet.address + "/unconfirmedBalance"
  )
  let balance = await axios.get(balanceUrl)
  let unconfirmedBalance = await axios.get(unconfirmedBalanceUrl)
  let output = {
    balance: Number(balance.data),
    unconfirmedBalance: Number(unconfirmedBalance.data)
  }
  return output
};

export default {
  state,
  getters,
  mutations,
  actions,
};

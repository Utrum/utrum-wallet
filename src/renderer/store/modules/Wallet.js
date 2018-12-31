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
import ElectrumService from '../../lib/electrum';
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
    txs: {},
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

  ADD_TX(state, { ticker, newTx }) {
    _.remove(state.wallets[ticker].txs, (tx) => {
      return tx.tx_hash === newTx.tx_hash;
    });
    state.wallets[ticker].txs.unshift(newTx);
  },

  ADD_TXS(state, { ticker, txs }) {
    state.wallets[ticker].txs = txs;
  },

  DELETE_TX(state, { ticker, tx }) {
    state.wallets[ticker].txs.slice(state.wallets[ticker].txs.indexOf(tx), 1);
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
      wallet.electrum = new ElectrumService(store, ticker, { client: 'Utrum Wallet', version: '1.2' });
      wallet.ticker = ticker;
      wallet.balance = 0;
      wallet.balance_usd = 0;
      wallet.txs = [];
      wallet.privKey = privateKey;
      commit('ADD_WALLET', wallet);

      return wallet.electrum
        .init()
        ;
    });
    return Promise.all(promises)
      .catch(() => { })
      ;
  },

  createTransaction({ commit, rootGetters }, { wallet, amount, address, speed = 'slow', data = null }) {
    let utxos;

    return wallet.electrum.listUnspent(wallet.address)
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
    const builtTx = wallet.buildTx(inputs, outputs, fee, dataScript);
    const txId = builtTx.getId();

    return wallet.electrum
      .broadcast(builtTx.toHex())
      .then((broadcastedTx) => {
        if (txId === broadcastedTx) {
          return broadcastedTx;
        }
        return Promise.reject(new Error(`Broadcasted tx ${broadcastedTx} is not the same as built tx ${txId}`));
      })
      .catch((error) => {
        console.log('BROADCASTED TX ERROR:', error); // eslint-disable-line
        return Promise.reject(error);
      })
      ;
  },

  destroyWallets({ commit }) {
    commit('DESTROY_WALLETS');
  },

  updateBalance({ commit, getters, rootGetters }, wallet) {
    commit('UPDATE_BALANCE', wallet);
    return wallet.electrum
      .getBalance(wallet.address)
      .catch((error) => {
        return Promise.reject(new Error(`Failed to retrieve ${wallet.ticker} balance\n${error}`));
      })
      .then(response => {
        wallet.balance = BigNumber(response.confirmed).dividedBy(satoshiNb);
        wallet.balance_unconfirmed = new BigNumber(response.unconfirmed).dividedBy(satoshiNb);
        if (wallet.coin.name === 'monaize') {
          getCmcData('bitcoin')
            .then(response => {
              wallet.balance_usd = wallet.balance.multipliedBy(BigNumber(response.data[0].price_usd).dividedBy(15000));
            })
            ;
        } else {
          getCmcData(wallet.coin.name)
            .then(response => {
              response.data.forEach((cmcCoin) => {
                wallet.rate_in_usd = cmcCoin.price_usd;
                wallet.balance_usd = wallet.balance.multipliedBy(cmcCoin.price_usd);
              });
            })
            ;
        }
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


export default {
  state,
  getters,
  mutations,
  actions,
};

import { Wallet, coins }  from 'libwallet-mnz';
import sb from 'satoshi-bitcoin';
import bitcoinjs from 'bitcoinjs-lib';
import axios from 'axios';
import Vue from 'vue';

import getBalance from '../../lib/electrum';
import getCmcData from '../../lib/coinmarketcap';
import getTxFromRawTx from '../../lib/txtools';
import createPrivKey from '../../lib/createPrivKey';

const state = {
  wallets: {
    balance: 0,
    balance_unconfirmed: 0,
    balance_usd: 0,
    ticker: null,
    txs: {},
  },
  coins: [],
  calculating: false,
  isUpdate: false,
};

const getters = {
  isUpdate: (state) => {
    return state.isUpdate;
  },
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker];
  },
  getWalletTxs: (state, getters) => (ticker) => {
    return getters.getWalletByTicker(ticker).txs;
  },
  getWallets: (state) => {
    return state.wallets;
  },
  getTotalBalance: (state) => {
    const walletKeys = Object.keys(state.wallets);
    let totalBalanceUsd = 0;

    walletKeys.forEach((key) => {
      totalBalanceUsd += state.wallets[key].balance_usd;
    });

    return totalBalanceUsd;
  },
  getBalanceByTicker: (state) => (ticker) => {
    return state.wallets[ticker].balance;
  },
};

const mutations = {
  INIT_WALLET(state, { payload, privkey, testMode }) {
    const wallet = new Wallet(privkey, payload.coin, testMode);
    wallet.ticker = payload.coin.ticker;
    wallet.balance = 0;
    wallet.balance_usd = 0;
    wallet.txs = [];
    wallet.privkey = privkey;
    state.wallets[payload.coin.ticker] = Vue.set(state.wallets, payload.coin.ticker, wallet);
  },
  DESTROY_WALLETS(state) {
    state.wallets = {};
  },
  ADD_TX(state, { wallet, rawtx, transaction, tx_hash, height, testMode }) {
    const tx = getTxFromRawTx(wallet, rawtx, transaction, tx_hash, height, testMode);
    if (tx != null) {
      const txExists = state.wallets[wallet.ticker].txs.map(t => { return t.tx_hash; }).indexOf(tx.tx_hash);

      if (txExists < 0) {
        state.wallets[wallet.ticker].txs.unshift(tx);
      }
    }
  },
  UPDATE_BALANCE(state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet);
  },
  UPDATE_IS_UPDATE(state, isUpdate) {
    state.isUpdate = isUpdate;
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
    coins.all.forEach(coin => {
      const payload = {
        coin: Object.assign({}, coin),
        passphrase: rootGetters.passphrase,
      };
      commit('INIT_WALLET', { payload: payload, privkey: rootGetters.privKey, testMode: rootGetters.isTestMode });
    });
    dispatch('updateAllBalances');
  },
  destroyWallets({ commit }) {
    commit('DESTROY_WALLETS');
  },
  updateAllBalances({ dispatch, getters }) {
    Object.keys(getters.getWallets).forEach((ticker) => {
      dispatch('updateBalance', getters.getWallets[ticker]);
    });
  },
  updateBalance({ commit, getters, rootGetters }, wallet) {
    getBalance(wallet, rootGetters.isTestMode).then(response => {
      wallet.balance = sb.toBitcoin(response.data.confirmed);
      wallet.balance_unconfirmed = sb.toBitcoin(response.data.unconfirmed);
      if (wallet.coin.name !== 'monaize') {
        getCmcData(wallet.coin.name).then(response => {
          response.data.forEach((cmcCoin) => {
            wallet.balance_usd = wallet.balance * cmcCoin.price_usd;
          });
        });
      } else {
        getCmcData('bitcoin').then(response => {
          wallet.balance_usd = wallet.balance * (response.data[0].price_usd / 15000);
        });
      }
    });
    commit('UPDATE_BALANCE', wallet);
  },
  startUpdates({ dispatch }) {
    dispatch('setIsUpdate', true);
    dispatch('startUpdateBalances');
    dispatch('startUpdateConfig');
    dispatch('startUpdateHistory');
  },
  startUpdateBalances({ dispatch, getters, rootGetters }) {
    const min = 20;
    const max = 50;
    const rand = Math.floor(Math.random() * (((max - min) + 1) + min));
    const interval = setInterval(() => {
      if (rootGetters.passphrase !== '') {
        dispatch('updateAllBalances');
      }
      if (getters.isUpdate) {
        dispatch('startUpdateBalances');
      }
      clearTimeout(interval);
    }, rand * 1000);
  },
  startUpdateConfig({ dispatch }) {
    const min = 1800;
    const max = 3600;
    const rand = Math.floor(Math.random() * (((max - min) + 1) + min));
    const interval = setInterval(() => {
      dispatch('updateConfig');
      if (getters.isUpdate) {
        dispatch('startUpdateConfig');
      }
      clearTimeout(interval);
    }, rand * 1000);
  },
  startUpdateHistory({ dispatch, getters }) {
    const min = 60;
    const max = 120;
    const rand = Math.floor(Math.random() * (((max - min) + 1) + min));
    const interval = setInterval(() => {
      Object.keys(getters.getWallets).forEach((ticker) => {
        dispatch('buildTxHistory', getters.getWallets[ticker]);
      });
      if (getters.isUpdate) {
        dispatch('startUpdateHistory');
      }
      clearTimeout(interval);
    }, rand * 1000);
  },
  getRawTx({ commit, rootGetters }, { ticker, tx }) {
    const payload = {
      ticker: ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.transaction.get',
      params: [tx.tx_hash, true],
    };
    return axios.post('http://localhost:8000', payload);
  },
  addTx({ commit, dispatch, getters }, { wallet, tx }) {
    const txExists = getters.getWallets[wallet.ticker].txs.map(t => { return t.tx_hash; }).indexOf(tx.tx_hash);

    if (txExists < 0) {
      dispatch('getRawTx', { ticker: wallet.ticker, tx: tx }).then(response => {
        const decodedTx = bitcoinjs.Transaction.fromHex(response.data.hex);
        commit('ADD_TX', { wallet: wallet, rawtx: decodedTx, transaction: response.data, tx_hash: tx.tx_hash, height: tx.height });
      });
    }
  },
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    axios.post('http://localhost:8000', {
      ticker: wallet.ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.address.get_history',
      params: [wallet.address],
    }).then(response => {
      if (response.data.length > 0) {
        const txs = response.data;

        txs.forEach(tx => {
          dispatch('addTx', { wallet: wallet, tx: tx });
        });
      }
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

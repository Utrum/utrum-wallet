import { Wallet, coins }  from 'libwallet-mnz';
import sb from 'satoshi-bitcoin';
import Vue from 'vue';

import getBalance from '../../lib/electrum';
import getCmcData from '../../lib/coinmarketcap';
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
  getHistoryBuy: (state, getters) => (ticker) => {
    return getters
    .getWalletTxs('MNZ')
    .filter(el => el.origin.ticker === ticker);
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
    state.isUpdate = isUpdate;
  },
  ADD_TX(state, { ticker, tx }) {
    state.wallets[ticker].txs.unshift(tx);
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

    coins.all.forEach(coin => {
      const wallet = new Wallet(rootGetters.privKey, coin, rootGetters.isTestMode);
      wallet.ticker = coin.ticker;
      wallet.balance = 0;
      wallet.balance_usd = 0;
      wallet.txs = [];
      wallet.privKey = rootGetters.privKey;
      commit('ADD_WALLET', wallet);
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
        dispatch('buildTxHistory', getters.getWallets[ticker], { root: true });
      });
      if (getters.isUpdate) {
        dispatch('startUpdateHistory');
      }
      clearTimeout(interval);
    }, rand * 1000);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

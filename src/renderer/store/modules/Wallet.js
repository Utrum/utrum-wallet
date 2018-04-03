import { Wallet, coins }  from 'libwallet-mnz';
import sb from 'satoshi-bitcoin';
import Vue from 'vue';
import store from '../../store';
import ElectrumService from '../../lib/electrum';
import getCmcData from '../../lib/coinmarketcap';
import createPrivKey from '../../lib/createPrivKey';

const state = {
  wallets: [{
    balance: 0,
    balance_unconfirmed: 0,
    balance_usd: 0,
    ticker: null,
    txs: {},
  }],
  coins: [],
  calculating: false,
  isUpdate: false,
};

const getters = {
  isUpdate: (state) => {
    return state.isUpdate;
  },
  getHistoryBuy: (state, getters) => {
    const history = getters.getWalletTxs('MNZ');
    Object.keys(coins).forEach((coin) => {
      const filteredHistory = history.filter(el => el.origin.ticker === coin);
      history.concat(filteredHistory);
    });
    return history;
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
  // ADD_TX(state, { ticker, tx }) {
  //   state.wallets[ticker].txs.unshift(tx);
  // },
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
  async initWallets({ commit, dispatch, rootGetters }) {
    if (Object.keys(state.wallets).length > 0) {
      dispatch('destroyWallets');
    }

    dispatch('setPrivKey', createPrivKey(rootGetters.passphrase));

    const privateKey = rootGetters.privKey;
    const isTestMode = rootGetters.isTestMode;

    coins.all.forEach(async (coin) => {
      const ticker = coin.ticker;
      const wallet = new Wallet(privateKey, coin, isTestMode);
      wallet.electrum = new ElectrumService(store, ticker, isTestMode);
      await wallet.electrum.serverVersion('Monaize ICO Wallet 0.1', '1.2');
      wallet.ticker = ticker;
      wallet.balance = 0;
      wallet.balance_usd = 0;
      wallet.txs = [];
      wallet.privKey = privateKey;
      commit('ADD_WALLET', wallet);
      dispatch('buildTxHistory', wallet, { root: true });
      dispatch('updateBalance', wallet);
    });
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
    wallet.electrum.getBalance(wallet.address).then(response => {
      if (response.error) {
        throw new Error(`Failed to retrieve ${wallet.ticker} balance\n${response.error}`);
      }
      wallet.balance = sb.toBitcoin(response.confirmed);
      wallet.balance_unconfirmed = sb.toBitcoin(response.unconfirmed);
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

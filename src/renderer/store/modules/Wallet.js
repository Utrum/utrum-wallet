import { Wallet, coins }  from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import Vue from 'vue'


const state = {
  wallets: {},
  coins: [],
  calculating: false
}

const getters = {
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker]
  },
  getWallets: (state) => {
    return state.wallets
  },
  getTotalBalance: (state) => {
    let walletKeys = Object.keys(state.wallets);
    let totalBalanceUsd = 0;

    walletKeys.forEach(function(key) {
        totalBalanceUsd += state.wallets[key].balance_usd;
    });

    return totalBalanceUsd;
  }
}

const mutations = {
  INIT_WALLET (state, payload) {
    let coin = Vue.util.extend({}, coins.get(payload.coin))
    let wallet = new Wallet(payload.passphrase, payload.coin, 0)
    wallet.ticker = payload.coin.ticker
    wallet.balance = 0
    wallet.balance_usd = 0
    state.wallets[payload.coin.ticker] = Vue.set(state.wallets, payload.coin.ticker, wallet)
  },
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  },
  DESTROY_WALLETS (state) {
    state.wallets = {}
  },
  UPDATE_BALANCE (state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet)
  }
}

import {getBalance} from '../../lib/electrum'
import {getCmcData} from '../../lib/coinmarketcap'


const actions = {
  initWallets ({commit, dispatch}, passphrase) {
    if(Object.keys(state.wallets).length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      let payload = {
        coin: Object.assign({}, coin),
        passphrase: passphrase
      }
      commit('INIT_WALLET', payload)
      dispatch('updateBalance', state.wallets[payload.coin.ticker])
    })
    commit('SET_CALCULATING', false)
  },
  destroyWallets ({commit}) {
    commit('DESTROY_WALLETS')
  },
  updateBalance({commit, getters}, wallet) {
    getBalance(wallet).then(response => {
      // wallet.balance = sb.toBitcoin(response.data.confirmed);
      wallet.balance = sb.toBitcoin(response.data.confirmed);
      if (wallet.coin.name !== "monaize") {
        getCmcData(wallet.coin.name).then(response => {
          response.data.forEach(function(cmcCoin) {
            wallet.balance_usd = wallet.balance * cmcCoin.price_usd;
          })
        })
      } else {
        let price_btc = 0.00006666;
        wallet.balance_usd = wallet.balance * Number(getters.getWalletByTicker('BTC').balance_usd); 
      }
    })
    commit('UPDATE_BALANCE', wallet)
  } 
}

export default {
  state,
  getters,
  mutations,
  actions
}
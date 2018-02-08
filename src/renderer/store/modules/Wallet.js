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
    return state.wallets.find(wallet => wallet.ticker === ticker)
  },
  getWallets: (state) => {
    return state.wallets
  }
}

const mutations = {
  INIT_WALLET (state, payload) {
    let coin = Vue.util.extend({}, coins.get(payload.coin))
    let wallet = new Wallet(payload.passphrase, payload.coin, 0)
    wallet.ticker = payload.coin.ticker
    wallet.balance = 0
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
  updateBalance({commit}, wallet) {
    getBalance(wallet).then(response => {
      wallet.balance = sb.toBitcoin(response.data.confirmed);
      commit('UPDATE_BALANCE', wallet)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
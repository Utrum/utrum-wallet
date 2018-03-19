import { Wallet, coins }  from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import bitcoinjs from 'bitcoinjs-lib'
import axios from 'axios'
import Vue from 'vue'

import {getBalance} from '../../lib/electrum'
import {getCmcData} from '../../lib/coinmarketcap'
import {getTxFromRawTx} from '../../lib/txtools'

const state = {
  wallets: {
    balance: 0,
    balance_unconfirmed: 0,
    balance_usd: 0,
    ticker: null,
    txs: {}
  },
  coins: [],
  calculating: false
}

const getters = {
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker]
  },
  getWalletTxs: (state,getters) => (ticker) => {
    return getters.getWalletByTicker(ticker).txs
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
  },
  getBalanceByTicker: (state) => (ticker) => {
    return state.wallets[ticker].balance
  }
}

const mutations = {
  INIT_WALLET (state, {payload, privkey, testMode}) {
    let coin = Vue.util.extend({}, coins.get(payload.coin))
    let wallet = new Wallet(privkey, payload.coin, testMode)
    wallet.ticker = payload.coin.ticker
    wallet.balance = 0
    wallet.balance_usd = 0
    wallet.txs = []
    wallet.privkey = privkey
    state.wallets[payload.coin.ticker] = Vue.set(state.wallets, payload.coin.ticker, wallet)
  },
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  },
  DESTROY_WALLETS (state) {
    state.wallets = {}
  },
  ADD_TX (state, {wallet, rawtx, transaction, tx_hash, height, testMode}) {
    let tx = getTxFromRawTx(wallet, rawtx, transaction, tx_hash, height, testMode);
      if (tx != null) {
        let txExists = state.wallets[wallet.ticker].txs.map(t => { return t.tx_hash }).indexOf(tx.tx_hash)
        
        if( txExists >= 0) {
          console.log('tx already exists')
        } else {
          state.wallets[wallet.ticker].txs.unshift(tx)
        }
    }
  },
  UPDATE_BALANCE (state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet)
  }
}

const actions = {
  initWallets ({commit, dispatch, rootGetters}) {
    if(Object.keys(state.wallets).length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)

    return new Promise((resolve, reject) => {
      axios.post('http://localhost:8000', {
        method: 'generateaddress',
        params: [ rootGetters.passphrase ]
        }).then(response => {
          dispatch('setPrivKey', response.data.privkey);
          coins.all.forEach(coin => {
            let payload = {
              coin: Object.assign({}, coin),
              passphrase: rootGetters.passphrase
            }
            commit('INIT_WALLET', {payload:payload, privkey:rootGetters.privKey, testMode: rootGetters.isTestMode})
          })
          dispatch('updateAllBalances');
      });
    })
    commit('SET_CALCULATING', false)
  },
  destroyWallets ({commit}) {
    commit('DESTROY_WALLETS')
  },
  updateAllBalances({commit, dispatch, getters, rootGetters}) {
    Object.keys(getters.getWallets).forEach((ticker) => {
        dispatch('updateBalance', getters.getWallets[ticker])
    });
  },
  updateBalance({commit, getters, rootGetters}, wallet) {
    getBalance(wallet, rootGetters.isTestMode).then(response => {
      wallet.balance = sb.toBitcoin(response.data.confirmed);
      wallet.balance_unconfirmed = sb.toBitcoin(response.data.unconfirmed);
      if (wallet.coin.name !== "monaize") {
        getCmcData(wallet.coin.name).then(response => {
          response.data.forEach(function(cmcCoin) {
            wallet.balance_usd = wallet.balance * cmcCoin.price_usd;
          })
        })
      } else {
        getCmcData('bitcoin').then(response => {
          wallet.balance_usd = wallet.balance * (response.data[0].price_usd / 15000)
        })
      }
    })
    commit('UPDATE_BALANCE', wallet)
  },
  startUpdates ({dispatch}) {
    dispatch("startUpdateBalances")
    dispatch("startUpdateConfig")
    dispatch('startUpdateHistory')
  },
  startUpdateBalances ({ dispatch, rootGetters }) {
    let min = 20,
    max = 50;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    let interval = setInterval(() => {
      if (rootGetters.passphrase !== '') {
        dispatch('updateAllBalances');
      }
      dispatch('startUpdateBalances');
      clearTimeout(interval);
    }, rand * 1000)
  },
  startUpdateConfig ({ dispatch, rootGetters }) {
    let min = 1800,
    max = 3600;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    let interval = setInterval(() => {
      dispatch('updateConfig');
      dispatch('startUpdateConfig');
      clearTimeout(interval);
    }, rand * 1000)
  },
  startUpdateHistory ({ dispatch, getters, rootGetters }) {
    let min = 60,
    max = 120;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    let interval = setInterval(() => {
      Object.keys(getters.getWallets).forEach((ticker) => {
        dispatch('buildTxHistory', getters.getWallets[ticker])
      });
      dispatch('startUpdateHistory');
      clearTimeout(interval);
    }, rand * 1000)
  },
  getRawTx({commit, rootGetters}, {ticker, tx}) {
    let payload = {
      ticker: ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.transaction.get',
      params: [tx.tx_hash, true]
    }
    return axios.post('http://localhost:8000', payload)
  },  
  addTx({commit, dispatch, getters}, {wallet, tx}) {
    let txExists = getters.getWallets[wallet.ticker].txs.map(t => { return t.tx_hash }).indexOf(tx.tx_hash)

    if( txExists >= 0) {
      console.log('tx already exists')
    } else {
      dispatch('getRawTx', {ticker:wallet.ticker, tx:tx}).then(response => {
        let decodedTx = bitcoinjs.Transaction.fromHex(response.data.hex)
        commit('ADD_TX', {wallet:wallet, rawtx:decodedTx, transaction:response.data, tx_hash:tx.tx_hash, height:tx.height}) 
      })
    }
  },
  buildTxHistory({commit, dispatch, getters, rootGetters}, wallet) {
    axios.post('http://localhost:8000', {
      ticker: wallet.ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.address.get_history',
      params: [ wallet.address ]
    }).then(response => {
      if (response.data.length > 0) {
        let txs = response.data

        txs.forEach(tx => {
          dispatch('addTx', {wallet:wallet, tx:tx})
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
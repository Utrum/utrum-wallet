import { Wallet, coins }  from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import bitcoinjs from 'bitcoinjs-lib'
import axios from 'axios'
import Vue from 'vue'


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
  getWalletTxs: (state) => (ticker) => {
    return state.wallets[ticker].txs
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
  ADD_TX (state, {wallet, rawtx, tx_hash, height}) {
    const address = bitcoinjs.TransactionBuilder.fromTransaction(rawtx, coins.get(wallet.ticker).network) 
    let pubkey = bitcoinjs.ECPair.fromPublicKeyBuffer(address.inputs[0].pubKeys[0],wallet.coin.network)
    let amount = rawtx.outs[0].value;
    if (pubkey.getAddress() === wallet.address) {
      amount = -amount;
    }
    let tx =  {
      height: height,
      tx_hash: tx_hash,
      amount: amount
    }
    let txExists = state.wallets[wallet.ticker].txs.map(t => { return t.tx_hash }).indexOf(tx.tx_hash)

    if( txExists >= 0) {
      console.log('tx already exists')
    } else {
      state.wallets[wallet.ticker].txs.unshift(tx)
    }
  },
  UPDATE_BALANCE (state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet)
  }
}

import {getBalance} from '../../lib/electrum'
import {getCmcData} from '../../lib/coinmarketcap'


const actions = {
  initWallets ({commit, dispatch, rootGetters}, passphrase) {
    if(Object.keys(state.wallets).length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)

    return new Promise((resolve, reject) => {
      axios.post('http://localhost:8000', {
        method: 'generateaddress',
        params: [ passphrase ]
        }).then(response => {
          coins.all.forEach(coin => {
            let payload = {
              coin: Object.assign({}, coin),
              passphrase: passphrase
            }
            commit('INIT_WALLET', {payload:payload, privkey:response.data.privkey, testMode: rootGetters.isTestMode})
            dispatch('updateBalance', state.wallets[payload.coin.ticker])
          })
      });
    })
    commit('SET_CALCULATING', false)
  },
  destroyWallets ({commit}) {
    commit('DESTROY_WALLETS')
  },
  updateBalance({commit, getters, rootGetters}, wallet) {
    getBalance(wallet, rootGetters.isTestMode).then(response => {
      console.log(response)
      // wallet.balance = sb.toBitcoin(response.data.confirmed);
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
  getRawTx({commit, rootGetters}, {ticker, tx}) {
    let payload = {
      ticker: ticker,
      test: rootGetters.isTestMode,
      method: 'blockchain.transaction.get',
      params: [ tx.tx_hash ]
    }
    return axios.post('http://localhost:8000', payload)
  },  
  addTx({commit, dispatch, getters}, {wallet, tx}) {
    dispatch('getRawTx', {ticker:wallet.ticker, tx:tx}).then(response => {
      let decodedTx = bitcoinjs.Transaction.fromHex(response.data)
      commit('ADD_TX', {wallet:wallet, rawtx:decodedTx, tx_hash:tx.tx_hash, height:tx.height}) 
    })
    // .catch(error => {
    //   throw new Error(error)
    // })
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

        console.log(txs)
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
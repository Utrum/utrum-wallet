import { Wallet, coins ***REMOVED***  from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import bitcoinjs from 'bitcoinjs-lib'
import axios from 'axios'
import Vue from 'vue'


***REMOVED***
  wallets: {
    balance: 0,
    balance_usd: 0,
    ticker: null,
    txs: {***REMOVED***
  ***REMOVED***,
  coins: [],
  calculating: false
***REMOVED***

***REMOVED***
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker]
  ***REMOVED***,
  getWalletTxs: (state) => (ticker) => {
    return state.wallets[ticker].txs
  ***REMOVED***,
  getWallets: (state) => {
    return state.wallets
  ***REMOVED***,
  getTotalBalance: (state) => {
    let walletKeys = Object.keys(state.wallets);
    let totalBalanceUsd = 0;

    walletKeys.forEach(function(key) {
        totalBalanceUsd += state.wallets[key].balance_usd;
    ***REMOVED***);

    return totalBalanceUsd;
  ***REMOVED***
***REMOVED***

***REMOVED***
  INIT_WALLET (state, payload) {
    let coin = Vue.util.extend({***REMOVED***, coins.get(payload.coin))
    let wallet = new Wallet(payload.passphrase, payload.coin, 0)
    wallet.ticker = payload.coin.ticker
    wallet.balance = 0
    wallet.balance_usd = 0
    wallet.txs = []
    state.wallets[payload.coin.ticker] = Vue.set(state.wallets, payload.coin.ticker, wallet)
  ***REMOVED***,
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  ***REMOVED***,
  DESTROY_WALLETS (state) {
    state.wallets = {***REMOVED***
  ***REMOVED***,
  ADD_TX (state, {wallet, rawtx, tx_hash***REMOVED***) {
    state.wallets[wallet.ticker].txs.push({
      tx_hash: tx_hash,
      amount: rawtx.outs[0].value
    ***REMOVED***)
  ***REMOVED***,
  UPDATE_BALANCE (state, wallet) {
    Vue.set(state.wallets, wallet.ticker, wallet)
  ***REMOVED***
***REMOVED***

import {getBalance***REMOVED*** from '../../lib/electrum'
import {getCmcData***REMOVED*** from '../../lib/coinmarketcap'


***REMOVED***
  initWallets ({commit, dispatch***REMOVED***, passphrase) {
    if(Object.keys(state.wallets).length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      let payload = {
        coin: Object.assign({***REMOVED***, coin),
        passphrase: passphrase
      ***REMOVED***
      commit('INIT_WALLET', payload)
      dispatch('updateBalance', state.wallets[payload.coin.ticker])
    ***REMOVED***)
    commit('SET_CALCULATING', false)
  ***REMOVED***,
  destroyWallets ({commit***REMOVED***) {
    commit('DESTROY_WALLETS')
  ***REMOVED***,
  updateBalance({commit, getters***REMOVED***, wallet) {
    getBalance(wallet).then(response => {
      // wallet.balance = sb.toBitcoin(response.data.confirmed);
      wallet.balance = sb.toBitcoin(response.data.confirmed);
      if (wallet.coin.name !== "monaize") {
        getCmcData(wallet.coin.name).then(response => {
          response.data.forEach(function(cmcCoin) {
            wallet.balance_usd = wallet.balance * cmcCoin.price_usd;
          ***REMOVED***)
        ***REMOVED***)
      ***REMOVED*** else {
        let price_btc = 0.00006666;
        wallet.balance_usd = wallet.balance * Number(getters.getWalletByTicker('BTC').balance_usd); 
      ***REMOVED***
    ***REMOVED***)
    commit('UPDATE_BALANCE', wallet)
  ***REMOVED***,
  getRawTx({commit***REMOVED***, {ticker, tx***REMOVED***) {
    let payload = {
      ticker: ticker,
      method: 'blockchain.transaction.get',
      params: [ tx.tx_hash ]
    ***REMOVED***
    console.log(payload)
    return axios.post('http://localhost:8000', payload)
  ***REMOVED***,  
  addTx({commit, dispatch, getters***REMOVED***, {wallet, tx***REMOVED***) {
    console.log(wallet,tx)
    dispatch('getRawTx', {ticker:wallet.ticker, tx:tx***REMOVED***).then(response => {
      console.log(response)
      let decodedTx = bitcoinjs.Transaction.fromHex(response.data)
      console.log(decodedTx)

      commit('ADD_TX', {wallet:wallet, rawtx:decodedTx, tx_hash:tx.tx_hash***REMOVED***) 
    ***REMOVED***).catch(error => {
      throw new Error(error)
    ***REMOVED***)
  ***REMOVED***,
  buildTxHistory({commit, dispatch, getters***REMOVED***, wallet) {
    axios.post('http://localhost:8000', {
      ticker: wallet.ticker,
      method: 'blockchain.address.get_history',
      params: [ wallet.address ]
    ***REMOVED***).then(response => {
      if (response.data.length > 0) {
        let txs = response.data
        console.log(txs)

        txs.forEach(tx => {
          console.log(`Adding ${tx.tx_hash***REMOVED***`)
          dispatch('addTx', {wallet:wallet, tx:tx***REMOVED***)
        ***REMOVED***)
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
import { Wallet, coins ***REMOVED***  from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import Vue from 'vue'


***REMOVED***
  wallets: {***REMOVED***,
  coins: [],
  calculating: false
***REMOVED***

***REMOVED***
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets[ticker]
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
    state.wallets[payload.coin.ticker] = Vue.set(state.wallets, payload.coin.ticker, wallet)
  ***REMOVED***,
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  ***REMOVED***,
  DESTROY_WALLETS (state) {
    state.wallets = {***REMOVED***
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
  ***REMOVED*** 
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
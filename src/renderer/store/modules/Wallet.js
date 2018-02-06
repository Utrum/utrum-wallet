import { Wallet, coins ***REMOVED***  from 'libwallet'

***REMOVED***
  wallets: [],
  coins: [],
  calculating: false
***REMOVED***

***REMOVED***
  getWalletByTicker: (state) => (ticker) => {
    return state.wallets.find(wallet => wallet.ticker === ticker)
  ***REMOVED***,
  getWallets: (state) => {
    return state.wallets
  ***REMOVED***
***REMOVED***

***REMOVED***
  INIT_WALLET (state, ticker, passphrase) {
    let coin = coins.get(ticker)
    let wallet = new Wallet(passphrase, coin, 0)
    wallet.ticker = ticker
    state.wallets.push(wallet)
  ***REMOVED***,
  SET_CALCULATING (statte, calculating) {
    state.calculating = calculating
  ***REMOVED***
***REMOVED***

***REMOVED***
  initWallets ({commit***REMOVED***, passphrase) {
    console.log(coins.all)
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      commit('INIT_WALLET', coin.ticker, passphrase)
    ***REMOVED***)
    commit('SET_CALCULATING', false)
  ***REMOVED***
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
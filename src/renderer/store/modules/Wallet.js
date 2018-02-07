import { Wallet, coins ***REMOVED***  from 'libwallet-mnz'

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
  INIT_WALLET (state, payload) {
    let coin = coins.get(payload.coin)
    let wallet = new Wallet(payload.passphrase, payload.coin, 0)
    wallet.ticker = payload.coin.ticker
    state.wallets.push(Object.assign({***REMOVED***, wallet))
  ***REMOVED***,
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  ***REMOVED***,
  DESTROY_WALLETS (state) {
    state.wallets = []
  ***REMOVED***
***REMOVED***

***REMOVED***
  initWallets ({commit, dispatch***REMOVED***, passphrase) {
    if(state.wallets.length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      let payload = {
        coin: Object.assign({***REMOVED***, coin),
        passphrase: passphrase
      ***REMOVED***
      commit('INIT_WALLET', payload)
    ***REMOVED***)
    commit('SET_CALCULATING', false)
  ***REMOVED***,
  destroyWallets ({commit***REMOVED***) {
    commit('DESTROY_WALLETS')
  ***REMOVED***
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
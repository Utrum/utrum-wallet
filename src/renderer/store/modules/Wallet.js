import { Wallet, coins }  from 'libwallet'

const state = {
  wallets: [],
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
  INIT_WALLET (state, ticker, passphrase) {
    let coin = coins.get(ticker)
    let wallet = new Wallet(passphrase, coin, 0)
    wallet.ticker = ticker
    state.wallets.push(wallet)
  },
  SET_CALCULATING (statte, calculating) {
    state.calculating = calculating
  }
}

const actions = {
  initWallets ({commit}, passphrase) {
    console.log(coins.all)
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      commit('INIT_WALLET', coin.ticker, passphrase)
    })
    commit('SET_CALCULATING', false)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
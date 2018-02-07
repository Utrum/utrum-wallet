import { Wallet, coins }  from 'libwallet-mnz'

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
  INIT_WALLET (state, payload) {
    let coin = coins.get(payload.coin)
    let wallet = new Wallet(payload.passphrase, payload.coin, 0)
    wallet.ticker = payload.coin.ticker
    state.wallets.push(Object.assign({}, wallet))
  },
  SET_CALCULATING (state, calculating) {
    state.calculating = calculating
  },
  DESTROY_WALLETS (state) {
    state.wallets = []
  }
}

const actions = {
  initWallets ({commit, dispatch}, passphrase) {
    if(state.wallets.length > 0) 
      dispatch('destroyWallets')
    commit('SET_CALCULATING', true)
    coins.all.forEach(coin => {
      let payload = {
        coin: Object.assign({}, coin),
        passphrase: passphrase
      }
      commit('INIT_WALLET', payload)
    })
    commit('SET_CALCULATING', false)
  },
  destroyWallets ({commit}) {
    commit('DESTROY_WALLETS')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
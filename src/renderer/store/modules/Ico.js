import * as _ from 'lodash';
import bitcoinjs from 'bitcoinjs-lib';
import { BigNumber } from 'bignumber.js';

const state = {
  associatedTxs: [],
  pendingSwaps: [],
};

const mutations = {
  UPDATE_ASSOCIATED_TXS(state, associations) {
    state.associatedTxs = associations;
  },
  ADD_PENDING_TX(state, newPendingTx) {
    state.pendingSwaps.unshift(newPendingTx);
  },
  DELETE_PENDING_TX(state, pendingTxHash) {
    state.pendingSwaps = _.filter(state.pendingSwaps, (pendingSwap) => {
      return pendingSwap.cryptoTx.tx_hash !== pendingTxHash;
    });
  },
};

const actions = {
  createSwapTransaction({ commit, rootGetters, dispatch }, { wallet, amount, blocks = 6, data = null }) {
    const address = getNewBuyAddress(wallet, rootGetters.getPubKeysBuy);
    return dispatch('createTransaction', { wallet, amount, address, blocks, data });
  },
  swap({ commit, rootGetters, dispatch }, { wallet, inputs, outputs, amount, amountMnz, fee, dataScript }) {
    return dispatch('broadcastTransaction', { wallet, inputs, outputs, fee, dataScript })
      .then((sentTxId) => {
        const localCryptoTx = generateLocalTx(wallet.address, amount, sentTxId);
        const localMnzTx = generateLocalMnz(amountMnz);
        commit('ADD_PENDING_TX', { mnzTx: localMnzTx, cryptoTx: localCryptoTx, ticker: wallet.ticker });
        return sentTxId;
      })
    ;
  },
  buildSwapList({ commit, rootGetters }, transactionToDelete) {
    let cryptoTxs = [];
    let icoCoinTxs = [];
    _.map(rootGetters.enabledCoins, (coin) => {
      if (coin.ticker.indexOf('MNZ') < 0) {
        cryptoTxs = cryptoTxs.concat(rootGetters.getWalletByTicker(coin.ticker).txs);
      } else {
        icoCoinTxs = cryptoTxs.concat(rootGetters.getWalletByTicker(coin.ticker).txs);
      }
    });

    const associations = associateTxsFromWallet(commit, cryptoTxs, icoCoinTxs, transactionToDelete);
    commit('UPDATE_ASSOCIATED_TXS', associations, { root: true });
  },
};

const getters = {
  icoWillBegin: (state, getters, rootState) => {
    const now = new Date().getTime() / 1000;
    if (now < rootState.Conf.config.icoStartDate) {
      return true;
    }
    return false;
  },
  icoIsRunning: (state, getters, rootState) => {

    // getTime() returns timestamp in the current local timezone.
    // So that the shift with GMT is already taken into account.
    const now = new Date().getTime() / 1000;
    return now < rootState.Conf.config.icoEndDate &&
           now > rootState.Conf.config.icoStartDate &&
           rootState.Conf.config.progress < 1;
  },
  icoStartDate: (state, getters, rootState) => {
    return rootState.Conf.config.icoStartDate;
  },
  getSwapList2: (state) => {
    return state.pendingSwaps.concat(state.associatedTxs).map(swap => {
      return {
        time: swap.cryptoTx.time,
        ticker: swap.ticker,
        mnzAmount: swap.mnzTx.amount,
        cryptoAmount: swap.cryptoTx.amount,
        mnzTxHash: swap.mnzTx.tx_hash,
      };
    });
  },
  getCurrentBonus: (state, getters, rootState) => (ticker) => {
    let currentBonus = 0;
    const date = new Date().getTime() / 1000;
    const config = rootState.Conf.config;

    const bonuses = config.bonuses;
    let findDuration = true;

    Object.keys(bonuses).forEach(k => {
      if (ticker.toLowerCase().indexOf(k)) {
        Object.keys(bonuses[k]).forEach(j => {
          if (findDuration) {
            const duration = bonuses[k][j].duration * 3600;
            const value = bonuses[k][j].value;
            const icoStart = config.icoStartDate;

            if (icoStart < date && date < icoStart + duration) {
              currentBonus = value / 100;
              findDuration = false;
            } else {
              currentBonus = 0;
            }
          }
        });
      }
    });
    return currentBonus;
  },
  getTotalPrice: (state, getters, rootState) => (ticker) => {
    const config = rootState.Conf.config;

    let price = 0;
    const priceMNZ = config.coinPrices.mnz;
    const priceKMD = config.coinPrices.kmd;

    if (ticker.indexOf('BTC') >= 0) {
      price = BigNumber(priceMNZ).dividedBy(100000000);
    } else if (ticker.indexOf('KMD') >= 0) {
      price = BigNumber(priceMNZ).dividedBy(priceKMD);
    }
    return price;
  },
};

// New recipient ICO address
const getNewBuyAddress = (wallet, pubKeysBuy) => {
  let pubKeyAddress;
  _.mapKeys(pubKeysBuy, (value, key) => {
    if (wallet.ticker.toLowerCase().indexOf(key) >= 0)  {
      pubKeyAddress = value;
    }
  });

  const xpub = bitcoinjs.HDNode.fromBase58(pubKeyAddress, wallet.coin.network);
  const index = Math.floor(Math.random() * 10000);
  const address = xpub.derivePath(`0/${index}`).keyPair.getAddress();
  return address;
};

// Swap association
const associateTxsFromWallet = (commit, cryptoTxs, mnzTxs, transactionToDelete) => {
  const associateArray = [];

  if (cryptoTxs != null && mnzTxs != null) {
    _.forEach(mnzTxs, (mnzTx) => {
      if (mnzTx.origin != null) {
        const cryptoTxsForMnz = _.filter(cryptoTxs, (cryptoTx) => {
          if (cryptoTx.tx_hash.substring(0, 9) === mnzTx.origin.txHash) {
            return true;
          }
          return false;
        });
        const minConfirmation = 1;

        if (cryptoTxsForMnz[0] && mnzTx.confirmations
          && cryptoTxsForMnz[0].confirmations >= minConfirmation
          && mnzTx.confirmations >= minConfirmation) {
          if (transactionToDelete && cryptoTxsForMnz[0].tx_hash === transactionToDelete.tx_hash) {
            commit('DELETE_PENDING_TX', transactionToDelete.tx_hash);
          }
          associateArray.push({ mnzTx: mnzTx, cryptoTx: cryptoTxsForMnz[0], ticker: mnzTx.origin.ticker });
        }
      }
    });
  }
  return associateArray;
};

// Local management
const generateLocalTx = (address, amount, txHash) => {
  const nowDate = new Date();
  const now = nowDate.getTime() / 1000;

  return {
    address: address,
    amount: amount,
    time: now,
    tx_hash: txHash,
  };
};

const generateLocalMnz = (amount) => {
  return {
    amount: amount,
  };
};

export default {
  state,
  mutations,
  actions,
  getters,
};

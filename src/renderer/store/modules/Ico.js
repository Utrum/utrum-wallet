import * as _ from 'lodash';
import bitcoinjs from 'bitcoinjs-lib';
import { Wallet }  from 'libwallet-mnz';

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
  buyAsset({ commit, rootGetters, dispatch }, { wallet, amount, fee, coupon, amountMnz }) {
    return new Promise((resolve, reject) => {
      wallet.electrum.listUnspent(wallet.address).then(response => {
        let pubKeyAddress = '';

        _.mapKeys(rootGetters.getPubKeysBuy, (value, key) => {
          if (key === wallet.ticker.toLowerCase()) {
            pubKeyAddress = value;
          }
        });
        const xpub = bitcoinjs.HDNode.fromBase58(pubKeyAddress, wallet.coin.network);
        const index = Math.floor(Math.random() * 10);
        const address = xpub.derivePath(`0/${index}`).keyPair.getAddress();

        const tx = wallet.prepareTx(response, address, amount, fee, coupon);

        wallet.electrum.broadcast(tx).then((response) => {
          const localCryptoTx = generateLocalTx(wallet.address, amount, response.data);
          const localMnzTx = generateLocalMnz(amountMnz);
          commit('ADD_PENDING_TX', { mnzTx: localMnzTx, cryptoTx: localCryptoTx, ticker: wallet.ticker });
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    });
  },
};

// key: 'cryptoTx.time',
// key: 'ticker',
// key: 'mnzTx',
// key: 'price41',
// key: 'price4all',
// key: 'status',

const getters = {
  isCanBuy: (state, rootGetters) => {
    const config = rootGetters.getConfig;
    const date = Date();
    if (!(config.progress <= 1 && config.icoStartDate < date && date < config.icoEndDate)) {
      return true;
    }
    return false;
  },
  getSwapList: (state) => {
    return state.pendingSwaps.concat(state.associatedTxs);
  },
  getSwapList2: (state, getters) => {
    return getters.getSwapList.map(swap => {
      return {
        time: swap.cryptoTx.time,
        ticker: swap.ticker,
        mnzAmount: swap.mnzTx.amount,
        cryptoAmount: swap.cryptoTx.amount,
        mnzTxHash: swap.mnzTx.tx_hash,
      };
    });
  },
};

const generateLocalTx = (address, amount, txHash) => {
  const nowDate = new Date();
  const now = (nowDate.getTime() / 1000) + (nowDate.getTimezoneOffset() * 60);

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

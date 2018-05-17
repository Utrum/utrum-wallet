/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

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
    const pubKeys = rootGetters.getPubKeysBuy(wallet.ticker);
    if (pubKeys == null || pubKeys.length !== 3) {
      return Promise.reject(new Error('Pubkeys from configuration are not correct'));
    }
    const address = getNewBuyAddress(wallet, pubKeys);
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
  buildSwapList({ commit, rootGetters }) {
    let cryptoTxs = [];
    let icoCoinTxs = [];
    _.map(rootGetters.enabledCoins, (coin) => {
      const confirmedTxsForCoin = _.filter(rootGetters.getWalletByTicker(coin.ticker).txs, (tx) => {
        if (tx.confirmations != null &&
            tx.confirmations >= rootGetters.getMinConfirmations) {
          return true;
        }
        return false;
      });
      if (coin.ticker.indexOf('MNZ') < 0) {
        cryptoTxs = cryptoTxs.concat(confirmedTxsForCoin);
      } else {
        icoCoinTxs = icoCoinTxs.concat(confirmedTxsForCoin);
      }
    });

    if (cryptoTxs != null && cryptoTxs.length > 0) {
      const associations = associateTxsFromWallet(cryptoTxs, icoCoinTxs);
      commit('UPDATE_ASSOCIATED_TXS', associations, { root: true });

      _.forEach(getLocalTxsToDelete(cryptoTxs, icoCoinTxs, rootGetters.getMinConfirmations), (cryptoTxToDelete) => {
        commit('DELETE_PENDING_TX', cryptoTxToDelete.tx_hash);
      });
    }
  },
};

const getters = {
  icoWillBegin: (state, getters, rootState) => {
    if (rootState.Conf.config == null) {
      return false;
    }

    const now = new Date().getTime() / 1000;
    if (now < rootState.Conf.config.icoStartDate) {
      return true;
    }
    return false;
  },
  icoIsRunning: (state, getters, rootState) => {
    if (getters.hasPlannedIco === false) {
      return false;
    }
    // getTime() returns timestamp in the current local timezone.
    // So that the shift with GMT is already taken into account.
    const now = new Date().getTime() / 1000;
    return now < rootState.Conf.config.icoEndDate &&
           now > rootState.Conf.config.icoStartDate &&
           rootState.Conf.config.progress < 1;
  },
  hasPlannedIco: (state, getters, rootState) => {
    if (rootState.Conf.config == null ||
        rootState.Conf.config.icoEndDate == null ||
        rootState.Conf.config.icoStartDate == null) {
      return false;
    }
    return true;
  },
  icoStartDate: (state, getters, rootState) => {
    return rootState.Conf.config ? rootState.Conf.config.icoStartDate : null;
  },
  getSwapList: (state) => {
    return state.pendingSwaps.concat(state.associatedTxs).map(swap => {
      return {
        time: swap.cryptoTx.time,
        ticker: swap.ticker,
        mnzAmount: swap.mnzTx.amount,
        cryptoAmount: swap.cryptoTx.amount,
        mnzTxHash: swap.mnzTx.tx_hash,
        cryptoHash: swap.cryptoTx.tx_hash,
      };
    });
  },
  getCurrentBonus: (state, getters, rootState) => (ticker) => {
    let currentBonus = 0;
    const date = new Date().getTime() / 1000;
    const config = rootState.Conf.config;

    const bonuses = config == null ? [] : config.bonuses;
    let findDuration = true;
    let durationBonus = 0;

    Object.keys(bonuses).forEach(k => {
      if (ticker.toLowerCase().indexOf(k)) {
        Object.keys(bonuses[k]).forEach(j => {
          if (findDuration) {
            durationBonus += bonuses[k][j].duration * 3600;
            const value = bonuses[k][j].value;
            const icoStart = config.icoStartDate;

            if (icoStart < date && date < icoStart + durationBonus) {
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
    if (config == null) {
      return 0;
    }
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
const getNewBuyAddress = (wallet, pubKeys) => {

  const index = Math.floor(Math.random() * 10);
  const nodes = [];
  pubKeys.forEach(pubkey => {
    nodes.push(bitcoinjs.HDNode.fromBase58(pubkey, wallet.coin.network).derivePath(`0/${index}`).getPublicKeyBuffer());
  });

  const redeemScript = bitcoinjs.script.multisig.output.encode(2, nodes); // 2 of pubKeys.length
  const scriptPubKey = bitcoinjs.script.scriptHash.output.encode(bitcoinjs.crypto.hash160(redeemScript));
  const address = bitcoinjs.address.fromOutputScript(scriptPubKey, wallet.coin.network);

  return address;
};

// Swap association
const associateTxsFromWallet = (cryptoTxs, mnzTxs) => {
  const associateArray = [];
  iterateOverSwapsForTxs(cryptoTxs, mnzTxs, (cryptoTx, icoTx) => {
    associateArray.push({ mnzTx: icoTx, cryptoTx: cryptoTx, ticker: icoTx.origin.ticker });
  });
  return associateArray;
};

const getTxFromArrayForShortTxHash = (txs, sTxHash) => {
  const txsForShash = _.filter(txs, (tx) => {
    if (tx.tx_hash.substring(0, 9) === sTxHash) {
      return true;
    }
    return false;
  });
  if (txsForShash != null && txsForShash.length > 0) {
    return txsForShash[0];
  }
  return null;
};

const iterateOverSwapsForTxs = (cryptoTxs, icoTxs, callback) => {
  if (cryptoTxs != null && icoTxs != null) {
    _.forEach(icoTxs, (icoTx) => {
      if (icoTx.origin != null) {
        const cryptoTxForIco = getTxFromArrayForShortTxHash(cryptoTxs, icoTx.origin.txHash);
        if (cryptoTxForIco != null && callback != null) {
          callback(cryptoTxForIco, icoTx);
        }
      }
    });
  }
};

// Local management
const getLocalTxsToDelete = (cryptoTxs, icoTxs, configMinConfirmations) => {
  const arrayOfLocalTxsToDelete = [];
  iterateOverSwapsForTxs(cryptoTxs, icoTxs, (cryptoTx, icoTx) => {
    if (cryptoTx.confirmations >= configMinConfirmations && icoTx.confirmations >= configMinConfirmations) {
      arrayOfLocalTxsToDelete.push(cryptoTx);
    }
  });
  return arrayOfLocalTxsToDelete;
};

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

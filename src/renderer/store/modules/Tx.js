import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import getTxFromRawTx from '../../lib/txtools';

const actions = {
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    return wallet.electrum
      .getTransactionHistory(wallet.address)
      .then((transactionList) => filterExistingTransactions(wallet.txs, transactionList))
      .then(transactionList => {
        return bluebird.mapSeries(transactionList, transaction => {
          // commit('DELETE_PENDING_TX', transaction.tx_hash, { root: true });
          return decodeTx(wallet, transaction, rootGetters.isTestMode)
            .then((transactionDetail) => {
              // console.log("post decode: " + transactionDetail.tx_hash);
              commit('ADD_TX', { ticker: wallet.ticker, newTx: transactionDetail }, { root: true });
              dispatch('buildSwapList', { root: true });
            })
            .catch((error) => {
              console.log("Error bh: ", error);
              return Promise.reject(new Error(error));
            })
          ;
        });
      })
    ;
  },
};

const filterExistingTransactions = (walletTxs, txs) => {
  if (walletTxs.length === 0) {
    return txs;
  }
  return _
    .filter(txs, (tx) => {
      let found = false;
      _.forEach(walletTxs, (walletTx) => {
        if (walletTx.tx_hash === tx.tx_hash) {
          found = true;
          return false;
        }
      });
      return !found;
    })
  ;
};

const decodeTx = (wallet, tx, isTestMode) => {
  return wallet.electrum
    .getTransaction(tx.tx_hash, true)
    .then(response => getTxFromRawTx(wallet, response, tx.height, isTestMode))
    .then((transaction) => {
      if (transaction == null) {
        return Promise.reject(new Error(`Bad transaction, can't get details on ${JSON.stringify(tx)} with ${JSON.stringify(transaction)}`));
      }
      return transaction;
    })
    .catch(() => { })
  ;
};


export default {
  actions,
};


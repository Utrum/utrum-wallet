import * as _ from 'lodash';
import getTxFromRawTx from '../../lib/txtools';
import * as bluebird from 'bluebird';

const actions = {
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    console.log("BUILD HISTORY");
    return wallet.electrum
      .getTransactionHistory(wallet.address)
      .then((transactionList) => filterExistingTransactions(wallet.txs, transactionList))
      .then(transactionList => {
        console.log("Tx number: " + transactionList.length + ", " + wallet.ticker + ", " + wallet.txs);
        return bluebird.mapSeries(transactionList, transaction => {
          commit('DELETE_PENDING_TX', transaction.tx_hash, { root: true });
          return decodeTx(wallet, transaction, rootGetters.isTestMode)
            .then((transactionDetail) => {
              // console.log("post decode: " + transactionDetail.tx_hash);
              commit('ADD_TX', { ticker: wallet.ticker, tx: transactionDetail }, { root: true });
              dispatch('buildSwapList', { root: true });
            })
            .catch((error) => { console.log("error:" + error); })
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
        console.log("WalletTx: " + walletTx + ", tx: " + tx);
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
  ;
};


export default {
  actions,
};


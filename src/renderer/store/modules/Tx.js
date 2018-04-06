import * as _ from 'lodash';
import getTxFromRawTx from '../../lib/txtools';
import * as bluebird from 'bluebird';

const actions = {
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    return wallet.electrum
      .getTransactionHistory(wallet.address)
      .then((transactionList) => filterExistingTransactions(wallet, transactionList))
      .then(transactionList => {
        return bluebird.mapSeries(transactionList, transaction => {
          commit('DELETE_PENDING_TX', transaction.tx_hash, { root: true });
          return decodeTx(wallet, transaction, rootGetters.isTestMode)
            .then((transactionDetail) => {
              commit('ADD_TX', { ticker: wallet.ticker, tx: transactionDetail }, { root: true });
              dispatch('buildSwapList', { root: true });
            })
          ;
        });
      })
    ;
  },
};

const filterExistingTransactions = (wallet, txs) => {
  return _ 
    .filter(txs, (tx) => {
      let found = false;
      _.forEach(wallet.txs, (walletTx) => {
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
  ;
};


export default {
  actions,
};


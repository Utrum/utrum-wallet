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

import * as bluebird from 'bluebird';
import getTxFromRawTx from '../../lib/txtools';

const actions = {
  buildTxHistory({ commit, dispatch, getters, rootGetters }, wallet) {
    return wallet.electrum
      .getTransactionHistory(wallet.address)
      // .then((transactionList) => filterExistingTransactions(wallet.txs, transactionList))
      .then(transactionList => {
        return bluebird.mapSeries(transactionList, transaction => {
          return decodeTx(wallet, transaction, rootGetters.isTestMode)
            .then((transactionDetail) => {
              // console.log(`Tx: ${transactionDetail.tx_hash}, confirmations: ${transactionDetail.confirmations}`);
              commit('ADD_TX', { ticker: wallet.ticker, newTx: transactionDetail }, { root: true });
              dispatch('buildSwapList', { root: true });
            })
            .catch(() => { })
          ;
        });
      })
    ;
  },
};

// const filterExistingTransactions = (walletTxs, txs) => {
//   const transactions = _.filter(txs, (tx) => { return tx.height > 0; });
//   return _
//     .filter(transactions, (tx) => {
//       let found = false;
//       _.forEach(walletTxs, (walletTx) => {
//         if (walletTx.tx_hash === tx.tx_hash) {
//           found = true;
//           return false;
//         }
//       });
//       return !found;
//     })
//   ;
// };

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


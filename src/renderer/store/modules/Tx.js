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
      .then(transactionList => {
        let existingTxs = rootGetters.getWalletTxs(wallet.ticker)
        console.log({existingTxs, transactionList});
        if(rootGetters.getWalletByTicker(wallet.ticker).isLoadingTransactions){
          console.log(`%c load trannsaction for ${wallet.ticker} already in progress.`, "color: yellow; font-size: 20px;")
          return Promise.resolve()
        }
        commit('SET_TRANSACTIONS_LOADING', wallet);

        console.log(`%c buildTxHistory ${wallet.ticker} total: ${transactionList.length} ${rootGetters.getWalletByTicker(wallet.ticker).isLoadingTransactions}`,"color: orange; font-size: 20px;")
        return bluebird.mapSeries(transactionList, transaction => {
          return decodeTx(wallet, transaction)
            .then((transactionDetail) => {
              commit('ADD_TX', { ticker: wallet.ticker, newTx: transactionDetail }, { root: true });
              dispatch('buildSwapList', { root: true });
            })
            .catch(() => { })
          ;
        })
        .then((data)=>{
          commit('SET_TRANSACTIONS_LOADED', wallet);
          console.log(console.log(`%c buildTxHistory ${wallet.ticker} ${rootGetters.getWalletByTicker(wallet.ticker).isLoadingTransactions} done: ${transactionList.length}`,"color: green; font-size: 20px;"))
        })
        .catch(err=>{
          commit('SET_TRANSACTIONS_LOADED', wallet);
          console.log(`%c buildTxHistory ${wallet.ticker} ${rootGetters.getWalletByTicker(wallet.ticker).isLoadingTransactions} Error: ${transactionList.length}`,"color: red; font-size: 20px;")
        });
      })
    ;
  },
};

const decodeTx = (wallet, tx) => {
  return wallet.electrum
    .getTransaction(tx.tx_hash, true)
    .then(response => getTxFromRawTx(wallet, response, tx.height))
    .then((transaction) => {
      if (transaction == null) {
        return Promise.reject(new Error(`Bad transaction, can't get details on ${JSON.stringify(tx)} with ${JSON.stringify(transaction)}`));
      }
      return transaction;
    })
    .then((transaction) => {
      const promise = new Promise((resolve) => {
        // setTimeout(() => {
          resolve(transaction);
        // }, 100);
      });
      return promise;
    })
  ;
};


export default {
  actions,
};


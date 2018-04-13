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

const { ipcRenderer } = require('electron');

export default class ElectrumService {
  constructor(store, ticker, test, electrumConfig) {
    this.tag = 0;
    this.store = store;
    this.ticker = ticker;
    this.test = test;
    this.electrumConfig = electrumConfig;
    this.payload = {
      ticker,
      test,
    };
  }

  call(method, params) {
    this.payload.method = method;
    this.payload.params = params;
    this.payload.tag = this.tag;
    ipcRenderer.send('electrum.call', this.payload);

    return new Promise((resolve, reject) => {
      const callback = (event, arg) => {

        if (arg.error != null) {
          reject(arg.error);
        } else {
          resolve(arg);
        }
      };
      ipcRenderer.once(`electrum.call.${method}.${this.ticker}.${this.payload.tag}`, callback);
      this.tag += 1;
    });
  }

  init() {
    const initConfiguration = {
      electrumConfig: this.electrumConfig,
      ticker: this.ticker,
      tag: this.tag,
    };
    ipcRenderer.send('electrum.init', initConfiguration);
    return new Promise((resolve, reject) => {
      const callback = (event, arg) => {
        if (arg.error != null) {
          reject(arg.error);
        } else {
          resolve(arg);
        }
      };
      ipcRenderer.once(`electrum.init.${this.ticker}.${this.tag}`, callback);
      this.tag += 1;
    });
  }

  serverVersion(client, version) {
    return this.call('server.version', [client, version]);
  }

  getBalance(address) {
    return this.call('blockchain.address.get_balance', [address]);
  }

  getEstimateFee(blocks) {
    return this.call('blockchain.estimatefee', [blocks]);
  }

  listUnspent(address) {
    return this.call('blockchain.address.listunspent', [address]);
  }

  broadcast(tx) {
    return this.call('blockchain.transaction.broadcast', [tx]);
  }

  getTransaction(txHash, verbose = false) {
    return this.call('blockchain.transaction.get', [txHash, verbose]);
  }

  getTransactionHistory(address) {
    return this.call('blockchain.address.get_history', [address]);
  }
}

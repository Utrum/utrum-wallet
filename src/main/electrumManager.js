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

const coins = require('libwallet-mnz').coins;
const ElectrumClient = require('electrum-client');
const config = require('../renderer/config/config');

export default class ElectrumManager {
  constructor() {
    this.clients = {};
    coins.all.forEach(coin => {
      if (coin.electrum && coin.electrum.length > 0) {
        const electrumServer = coin.electrum[0];
        this.clients[coin.ticker] = new ElectrumClient(parseInt(electrumServer.port, 10), electrumServer.host);
      } else {
        throw new Error(`Coin ticker ${coin.ticker} has an empty electrum list.`);
      }
    });
  }

  initClient(ticker, electrumConfig) {
    return this.clients[ticker]
      .initElectrum(electrumConfig, { maxTry: config.tech.electrum.persistenceMaxRetry, callback: (() => this._fireUpNewClient(ticker)) })
    ;
  }

  requestClient(ticker, method, params) {
    console.log(`Call ${method} with ${JSON.stringify(params)}`); // eslint-disable-line
    return this.clients[ticker]
      .request(method, params)
      .catch((error) => {
        console.log("Electrum_client catch:", error); // eslint-disable-line
        return Promise.reject(error);
      })
    ;
  }

  _fireUpNewClient(ticker) {
    console.log("Kick off new client for ticker: ", ticker); // eslint-disable-line
    let lastConfig;
    coins.all.forEach(coin => {
      if (coin.ticker === ticker && coin.electrum && coin.electrum.length > 0) {
        const electrumServer = coin.electrum[Math.floor(Math.random() * coin.electrum.length)];
        lastConfig = this.clients[ticker].electrumConfig;
        this.clients[ticker] = null;
        this.clients[ticker] = new ElectrumClient(parseInt(electrumServer.port, 10), electrumServer.host);
      }
    });
    this.initClient(ticker, lastConfig);
  }
}

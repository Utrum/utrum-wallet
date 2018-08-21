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

export default class ElectrumManager {
  constructor() {
    this.clients = {};
    coins.all.forEach(coin => {
      coin.electrum.forEach(electrumServer => {
        // let ticker = coin.ticker;
        // if (electrumServer.test === true) { ticker = `TEST${ticker}`; }
        this.clients[coin.ticker] = new ElectrumClient(parseInt(electrumServer.port, 10), electrumServer.host);
      });
    });
  }

  initClient(ticker, config) {
    return this.clients[ticker]
      .initElectrum(config)
    ;
  }

  requestClient(ticker, method, params) {
    return this.clients[ticker]
      .request(method, params)
    ;
  }
}

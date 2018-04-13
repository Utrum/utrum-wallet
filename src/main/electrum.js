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
const Client = require('jsonrpc-node').TCP.Client;

Client.timeout = 10000;

const clients = {};

coins.all.forEach(coin => {
  coin.electrum.forEach(electrumServer => {
    let ticker = coin.ticker;
    if (electrumServer.test === true) { ticker = `TEST${ticker}`; }
    clients[ticker] = new Client(parseInt(electrumServer.port, 10), electrumServer.host);
  });
});

export default (ticker, test, method, params) => {
  return new Promise((resolve, reject) => {
    const callback = (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    };
    clients[ticker].call(method, params, callback);
  });
};

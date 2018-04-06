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
  if (!ticker || !method || !params) {
    return Promise.reject(new Error('ERROR: Missing arguments'));
  }

  if (test) { ticker = `TEST${ticker}`; }

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

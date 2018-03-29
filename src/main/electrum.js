const coins = require('libwallet-mnz').coins;
const Client = require('jsonrpc-node').TCP.Client;

Client.timeout = 10000;

const clients = {};

Object.keys(coins.all).forEach(coin => {
  const electrumServers = coins.all[coin].electrum;
  electrumServers.forEach(electrumServer => {
    let ticker = coins.all[coin].ticker;
    if (electrumServer.test) {
      ticker = `TEST${ticker}`;
    }

    const client = new Client(parseInt(electrumServer.port, 10), electrumServer.host);
    client.on('error', err => {
      throw new Error(`ERROR: ELECTRUM SOCKET: ${err}`);
    });
    client.call('server.version', ['monaize', '1.2'], (error, response) => {
      if (error) {
        throw new Error(`Electrum Error: \n${error}\n${response}`);
      } else {
        clients[ticker] = client;
      }
    });
  });
});

// Object.keys(clients).forEach((ticker) => {
//   c
// });

export default (ticker, test, method, params, done) => {
  if (!ticker || !method || !params) throw new Error('ERROR: Missing arguments');
  if (test) {
    ticker = `TEST${ticker}`;
  }
  clients[ticker].call(method, params, done);
};

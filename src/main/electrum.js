const coins = require('libwallet-mnz').coins;
const Client = require('jsonrpc-node').TCP.Client;

const clients = {};
Object.keys(coins.all).forEach(coin => {
  const electrumServers = coins.all[coin].electrum;
  electrumServers.forEach(electrumServer => {
    let ticker = coins.all[coin].ticker;
    if (electrumServer.test) {
      ticker = `TEST${ticker}`;
    }
    clients[ticker] = new Client(parseInt(electrumServer.port, 10), electrumServer.host);
  });
});


Object.keys(clients).forEach((ticker) => {
  clients[ticker].call('server.version', ['monaize', '1.2']);
});

export default (ticker, test, method, params, done) => {
  if (!ticker || !method || !params) throw new Error('ERROR: Missing arguments');
  let tickerClient;
  if (test) {
    tickerClient = `TEST${ticker}`;
  }

  clients[tickerClient].call(method, params, done);
};

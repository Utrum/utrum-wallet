const coins = require('libwallet-mnz').coins;
const ElectrumClient = require('electrum-client');

export default class ElectrumManager {
  constructor() {
    this.clients = {};
    coins.all.forEach(coin => {
      coin.electrum.forEach(electrumServer => {
        let ticker = coin.ticker;
        if (electrumServer.test === true) { ticker = `TEST${ticker}`; }
        this.clients[ticker] = new ElectrumClient(parseInt(electrumServer.port, 10), electrumServer.host);
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

const { ipcRenderer } = require('electron');

export default class ElectrumService {
  constructor(store, ticker, test) {
    this.store = store;
    this.ticker = ticker;
    this.test = test;
    this.payload = {
      ticker,
      test,
    };
  }

  async call(method, params) {
    this.payload.method = method;
    this.payload.params = params;
    return new Promise((resolve) => {
      const response = ipcRenderer.sendSync('electrum.call', this.payload);
      resolve(response);
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

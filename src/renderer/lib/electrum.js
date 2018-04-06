const { ipcRenderer } = require('electron');

export default class ElectrumService {
  constructor(store, ticker, test) {
    this.tag = 0;
    this.store = store;
    this.ticker = ticker;
    this.test = test;
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
    // console.log("Call: ", method);

    return new Promise((resolve) => {
      const callback = (event, arg) => {
        
        resolve(arg);
      };
      // console.log("LISTEN ON: ", `electrum.call.${method}.${this.ticker}.${this.payload.tag}`);
      ipcRenderer.once(`electrum.call.${method}.${this.ticker}.${this.payload.tag}`, callback);
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

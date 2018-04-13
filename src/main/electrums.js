const coins = require('libwallet-mnz').coins;
const Client = require('jsonrpc-node').TCP.Client;

Client.timeout = 3000;

/* eslint no-console: "off" */

export class RpcClient {
  constructor(electrumServer) {
    this.client = new Client(parseInt(electrumServer.port, 10), electrumServer.host);
    this.lastCallTime = 0;
    this.pingIntervalMs = 60 * 1000;
    this.recursivePingPong();
  }

  call(method, params) {
    return new Promise((resolve, reject) => {
      const callback = (error, response) => {
        if (error) {
          console.error('Error: ', error);
          console.error('Error as string: ', JSON.stringify(error));
          console.error('Response as string: ', JSON.stringify(response));
          this.client.reconnect((error) => {
            if (error != null) { console.error('ERROR: Can\'t reconnect: ', error); }
            return this.call(method, params);
          });
          reject(error);
        } else {
          resolve(response);
        }
      };
      console.info('Call: ', method);
      this.lastCallTime = new Date().getTime();
      this.client.call(method, params, callback);
    });
  }

  recursivePingPong() {
    setTimeout(() => {
      if (this.lastCallTime !== 0 &&
          new Date().getTime() > this.lastCallTime + this.pingIntervalMs) {
        this.call('server.ping', []);
      }
      this.recursivePingPong();
    }, this.pingIntervalMs);
  }
}

export default class Electrums {
  constructor() {
    this.clients = {};
    coins.all.forEach(coin => {
      coin.electrum.forEach(electrumServer => {
        let ticker = coin.ticker;
        if (electrumServer.test === true) { ticker = `TEST${ticker}`; }
        this.clients[ticker] = new RpcClient(electrumServer);
      });
    });
  }

  getRpcClientForTicker(ticker) {
    return this.clients[ticker];
  }
}


// const electrumCall = (ticker, test, method, params) => {
//   return new Promise((resolve, reject) => {
//     const callback = (error, response) => {
//       if (error) {
//         console.log("Error: ", error);
//         console.log("Error as string: ", JSON.stringify(error));
//         console.log("Response as string: ", JSON.stringify(response));

//         clients[ticker].reconnect((error) => {
//           if (error != null) {
//             console.log("Can't reconnect: ", error);
//           }
//           electrumCall(ticker, test, method, params);
//         });

//         reject(error);
//       } else {
//         resolve(response);
//       }
//     };
//     clients[ticker].call(method, params, callback);
//   });
// };

// const recursivePingPong = (ticker, test) => {

//     console.log("PingPong response: ", response);
//     setTimeout(() => {
//       recursivePingPong(ticker, test);
//     }, 3000);
//   });
// };

// export default electrumCall;

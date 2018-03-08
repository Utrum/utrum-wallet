
var coins = require('libwallet-mnz').coins
// ÷import {Client} from 'jsonrpc-node'
var Client = require("jsonrpc-node").TCP.Client;


var clients = {}
Object.keys(coins.all).forEach(coin => {
  let electrumServers = coins.all[coin].electrum
  electrumServers.forEach(electrumServer => {
    let ticker = coins.all[coin].ticker
    if (electrumServer.test) {
      ticker = `TEST${ticker}`
    }
    clients[ticker] = new Client(parseInt(electrumServer.port), electrumServer.host);
  })
})


Object.keys(clients).forEach((ticker) => {
  clients[ticker].call('server.version', ["monaize", "1.2"])
})

export const  electrumCall = function(ticker, test, method, params, done) {
  if(!ticker || !method || !params) throw new Error('ERROR: Missing arguments')
  let coin = coins.get(ticker)
  
  if (test) {
    ticker = `TEST${ticker}`
  }

  var result = ''
  clients[ticker].call(method, params, done)
}


var coins = require('libwallet-mnz').coins
var Client = require("jsonrpc-node").TCP.Client;


function call(ticker, method, params, done) {
  if(!ticker || !method || !params) throw new Error('ERROR: Missing arguments')
  let coin = coins.get(ticker)
  let electrumServer = coin.electrum[0]
  var client = new Client(parseInt(electrumServer.port), electrumServer.host);
  console.log(`firing ${method} with ${params[0]}`)
  
  var result = ''
  client.call(method, params, done)
}


module.exports = {
  call: call
}
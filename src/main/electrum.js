var jayson = require('jayson');

var coins = require('libwallet-mnz').coins
var Client = require("jsonrpc-node").TCP.Client;


function call(ticker, method, params, done) {
  let coin = coins.get(ticker)
  let electrumServer = coin.electrum[0]
  var client = new Client(parseInt(electrumServer.port), electrumServer.host);
  console.log(`firing ${method}`)
  
  var result = ''
  client.call(method, params, function(err, response){
    // if (err) return done(err);
    console.log('client.call + '+ response.result)
    console.log(response) // here we see reponse
    done(response)
  })
}


module.exports = {
  call: call
}
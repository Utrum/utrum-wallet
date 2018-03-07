import bitcoinjs from 'bitcoinjs-lib'
import { coins }  from 'libwallet-mnz'

export const getTxFromRawTx = function(wallet, rawtx, tx_hash, height, test) {
  if (wallet.ticker === 'BTC' && test) {
    var network = bitcoinjs.networks.testnet
  } else if (wallet.ticker === 'BTC' && !test) {
    var network = bitcoinjs.networks.bitcoin
  } else var network = wallet.coin.network

  const tx = bitcoinjs.TransactionBuilder.fromTransaction(rawtx, network)
  let inputPubKey = bitcoinjs.ECPair.fromPublicKeyBuffer(tx.inputs[0].pubKeys[0],network)
  let amount = 0;
  let fromMNZ = false;

  rawtx.outs.forEach(out => {
    console.log(out)
    let address = bitcoinjs.address.fromOutputScript(out.script, network)
    if (address === wallet.address && inputPubKey.getAddress() !== wallet.address) {
      amount +=  out.value
    } else if (address !== wallet.address && inputPubKey.getAddress() === wallet.address) {
      amount -=  out.value
    } 
  })

  if (inputPubKey.getAddress() === "RRhRFCzT9oakk7LcC6C7UXLwCuzmBZ4uQc") {
    fromMNZ = true;
  }

  let decodedTx = {
    address: inputPubKey.getAddress(),
    height: height,
    tx_hash: tx_hash,
    fromMNZ: fromMNZ,
    amount: amount
  }

  return decodedTx;
}


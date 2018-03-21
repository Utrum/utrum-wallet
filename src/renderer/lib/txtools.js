import bitcoinjs from 'bitcoinjs-lib'
import { coins }  from 'libwallet-mnz'

export const getTxFromRawTx = function(wallet, rawtx, transaction, tx_hash, height, test) {
  if (wallet.ticker === 'BTC' && test) {
    var network = bitcoinjs.networks.testnet
  } else if (wallet.ticker === 'BTC' && !test) {
    var network = bitcoinjs.networks.bitcoin
  } else var network = wallet.coin.network

  const tx = bitcoinjs.TransactionBuilder.fromTransaction(rawtx, network)
  console.log(tx);

  if (tx.inputs[0].pubKeys[0] !== undefined) {
    let inputPubKey = bitcoinjs.ECPair.fromPublicKeyBuffer(tx.inputs[0].pubKeys[0],network)
    let amount = 0;
    let fromMNZ = false;
    let origin = '';
    
    rawtx.outs.forEach(out => {
      if (out.value != 0) {
        let address = bitcoinjs.address.fromOutputScript(out.script, network)
        if (address === wallet.address && inputPubKey.getAddress() !== wallet.address) {
          amount +=  out.value
        } else if (address !== wallet.address && inputPubKey.getAddress() === wallet.address) {
          amount -=  out.value
        }      
      } else {
        if (bitcoinjs.script.nullData.output.decode(out.script).length != 0) {
          let dataFromTx = bitcoinjs.script.nullData.output.decode(out.script).toString();
          let decodedData = dataFromTx.split('/')
          origin = {
            ticker : decodedData[0],
            txHash : decodedData[1]
          }
          fromMNZ = true;
        }
      }
    })

    let time = transaction.time
    if (time === undefined) {
      time = Date.now() / 1000;
    }
    let decodedTx = {
      address: inputPubKey.getAddress(),
      height: height,
      tx_hash: tx_hash,
      fromMNZ: fromMNZ,
      time: time,
      origin,
      amount: amount
    }

    return decodedTx;
  } else {
    return null;
  }
  
}


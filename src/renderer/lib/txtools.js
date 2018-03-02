import bitcoinjs from 'bitcoinjs-lib'
import { coins }  from 'libwallet-mnz'

export const getTxFromRawTx = function(wallet, rawtx, tx_hash, height) {
  const address = bitcoinjs.TransactionBuilder.fromTransaction(rawtx, coins.get(wallet.ticker).network)
  console.log(address);
  let pubkey = bitcoinjs.ECPair.fromPublicKeyBuffer(address.inputs[0].pubKeys[0],wallet.coin.network)
  let amount = rawtx.outs[1].value;
  let fromMNZ = false;

  if (pubkey.getAddress() === wallet.address) {
    amount = -amount;
  }

  console.log(pubkey.getAddress());
  if (pubkey.getAddress() === "RRhRFCzT9oakk7LcC6C7UXLwCuzmBZ4uQc") {
    fromMNZ = true;
  }
  let tx = {
    address: pubkey.getAddress(),
    height: height,
    tx_hash: tx_hash,
    fromMNZ: fromMNZ,
    amount: amount
  }
  return tx;
}


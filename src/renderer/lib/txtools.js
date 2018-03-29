import bitcoinjs from 'bitcoinjs-lib';

export default (wallet, transaction, height, test) => {
  let network;
  if (wallet.ticker === 'BTC' && test) {
    network = bitcoinjs.networks.testnet;
  } else if (wallet.ticker === 'BTC' && !test) {
    network = bitcoinjs.networks.bitcoin;
  } else network = wallet.coin.network;
  const txb = bitcoinjs.TransactionBuilder.fromTransaction(bitcoinjs.Transaction.fromHex(transaction.hex), network);

  if (txb.inputs[0].pubKeys[0] !== undefined) {
    const inputPubKey = bitcoinjs.ECPair.fromPublicKeyBuffer(txb.inputs[0].pubKeys[0], network);
    let amount = 0;
    let fromMNZ = false;
    let origin = '';

    txb.tx.outs.forEach(out => {
      if (out.value !== 0) {
        const address = bitcoinjs.address.fromOutputScript(out.script, network);
        if (address === wallet.address && inputPubKey.getAddress() !== wallet.address) {
          amount +=  out.value;
        } else if (address !== wallet.address && inputPubKey.getAddress() === wallet.address) {
          amount -=  out.value;
        }
      } else if (bitcoinjs.script.nullData.output.decode(out.script).length !== 0) {
        const dataFromTx = bitcoinjs.script.nullData.output.decode(out.script).toString();
        const decodedData = dataFromTx.split('/');
        origin = {
          ticker: decodedData[0],
          txHash: decodedData[1],
        };
        fromMNZ = true;
      }
    });

    let time = transaction.time;
    if (time === undefined) {
      time = Date.now() / 1000;
    }
    const decodedTx = {
      address: inputPubKey.getAddress(),
      height: height,
      tx_hash: transaction.txid,
      fromMNZ: fromMNZ,
      time: time,
      origin,
      amount: amount,
    };

    return decodedTx;
  }
};

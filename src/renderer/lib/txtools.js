/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

import bitcoinjs from 'bitcoinjs-lib';

export default (wallet, transaction, height, test) => {
  let network;
  if (wallet.ticker === 'BTC' && test) {
    network = bitcoinjs.networks.testnet;
  } else if (wallet.ticker === 'BTC' && !test) {
    network = bitcoinjs.networks.bitcoin;
  } else network = wallet.coin.network;
  const txb = bitcoinjs.TransactionBuilder.fromTransaction(bitcoinjs.Transaction.fromHex(transaction.hex), network);

  if (txb.inputs[0] != null && txb.inputs[0].pubKeys[0] != null) {
    const inputPubKey = bitcoinjs.ECPair.fromPublicKeyBuffer(txb.inputs[0].pubKeys[0], network);
    let amount = 0;
    let fromMNZ = false;
    let origin = '';

    // console.log("Txb: ", txb);
    txb.tx.outs.forEach(out => {
      if (out.value !== 0) {
        const address = bitcoinjs.address.fromOutputScript(out.script, network);
        if (address === wallet.address && inputPubKey.getAddress() !== wallet.address) {
          amount +=  out.value;
        } else if (address !== wallet.address && inputPubKey.getAddress() === wallet.address) {
          amount -=  out.value;
        }
      } else if (bitcoinjs.script.nullData.output.check(out.script)) {
        const decoded = bitcoinjs.script.nullData.output.decode(out.script);
        if (decoded != null) {
          const decodedData = decoded.toString().split('/');
          origin = {
            ticker: decodedData[0],
            txHash: decodedData[1],
          };
          fromMNZ = true;
        }
      }
    });

    let time = transaction.time;
    if (time === undefined) {
      time = Date.now() / 1000;
    }
    const decodedTx = {
      address: inputPubKey.getAddress(),
      height: height,
      confirmations: transaction.confirmations,
      tx_hash: transaction.txid,
      fromMNZ: fromMNZ,
      time: time,
      origin,
      amount: amount,
    };

    return decodedTx;
  }
};

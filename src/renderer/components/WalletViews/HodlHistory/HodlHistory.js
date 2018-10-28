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

import { BigNumber } from 'bignumber.js';
import bitcore from 'bitcore-lib';
import axios from 'axios';

const moment = require('moment');
const { shell } = require('electron');
const { clipboard } = require('electron');
const satoshiNb = 100000000;


export default {
  name: 'hodl-history',
  props: ['wallet'],
  data() {
    return {
      txsUrlBase: (
        this.wallet.coin.explorer +
        "insight-api-komodo/addrs/" +
        this.wallet.address +
        "/txs"),
      totalRows: 10,
      transactions: [],
      sortBy: '',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      timer: '',
      fields: [
        { key: 'nLockTime', label: 'Status / Unlock Time', sortable: false },
        { key: 'confirmations', label: 'Conf' },
        { key: 'formattedAmount', label: 'Amount' },
        { key: 'txid', label: 'TxID' },
      ],
      isBusy: false
    };
  },
  created: function() {
    // this.timer = setInterval(this.refreshTable, 60000);
  },
  methods: {
    cancelTxHistoryTimer () {
      //cancel if already running
      if(this.timer){
        clearInterval(this.timer)
        this.timer = null
      }
    },

    scheduleTxHistoryTimer (milsec) {
      this.cancelTxHistoryTimer()
      var milliseconds = milsec || 60000
      this.timer = setInterval(this.refreshTable, milliseconds)
    },

    refreshTable () {
      if (this.$refs.txTable) {
        console.log("refreshing table")
        this.$refs.txTable.refresh()
      }
    },

    openTxExplorer (row) {
      var txid = row.item.txid
      shell.openExternal(row.item.explorerUrl)
    },

    copyToClipboard (row) {
      clipboard.writeText(row.item.txid);
      this.$toasted.show('Copied !', {
        duration: 1000,
        icon: 'done',
      });
    },

    satoshiToBitcoin (amount) {
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },

    getColorAmount (amount) {
      if ( typeof amount == 'string' ) {  // non-hodl transactions
        return 'positiveColor'
      }else{
        return (amount < 0) ? 'negativeColor' : 'hodlColor';
      }
    },

    dateFormat (time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('hh:mm A MM/DD/YY');
      return dateString;
    },

    txHistory () {
      //resolve exising tx data if request in already in progress
      console.log(`getting transaction history...`)

      var vm = this

      let url = vm.txsUrl
      let promise = axios
      .get(url)
      return promise
      .then(response => {
        let items = response.data.items
        // process each transaction
        for (var item in items) {
          // add hodl related data to transactions
          items[item] = vm.processTx(items[item])
          // for gui, custom "amount" format
          if (items[item].isHodlTx === false) {
            if ( this.wallet.address !== items[item].destAddr ){
              items[item].formattedAmount = items[item].sentAmount * -1
            }else{
              items[item].formattedAmount = '+' + items[item].sentAmount
            }
          }else{
            items[item].formattedAmount = items[item].sentAmount
          }
        }
        // calculate number of pages
        vm.totalRows = response.data.totalItems
        // update shared data
        vm.transactions = items
        //schedule to refresh after next one min
        this.scheduleTxHistoryTimer()
        // return data
        return(items || [])
      })
      .catch(e => {
        console.log(e)
        //schedule to refresh after next one min
        this.scheduleTxHistoryTimer()
        return([])
      });
    },

    processTx (tx) {
      var vm = this

      // output variable
      var newTx = tx

      // define "amount sent" as the first output value
      var sentAmount = parseFloat(tx.vout[0].value)
      newTx.sentAmount = sentAmount

      // build explorer tx page url
      newTx.explorerUrl = (
        vm.wallet.coin.explorer + 'tx/' +
        tx.txid
      )

      // process hodl transactions
      var destAddr = tx.vout[0].scriptPubKey.addresses[0]
      var isSentToScript = false
      var isHodlTx = false
      var isSpent = tx.vout[0].spentHeight > 0 ? true : false
      var isRewardPaid = false

      // detect if p2sh transaction
      if ( destAddr.substring(0,1) == 'b' ) {
        isSentToScript = true
        var opReturnAsm = tx.vout[1].scriptPubKey.asm
        var opReturnHex = tx.vout[1].scriptPubKey.hex
        // check if this is an utrum hodl deposit
        let hodlDepositHint = "OP_RETURN 52454445454d2053435249505420"
        if ( opReturnAsm.substring(0,38) == hodlDepositHint ) {
          isHodlTx = true
          // get op_return data
          var opReturnData = bitcore.Script(opReturnHex)
          var opReturnString = opReturnData.chunks[1].buf.toString()
          // get redeem script from op_return data
          var header = "REDEEM SCRIPT "
          var redeemScriptHex = opReturnString.replace(header, '')
          var redeemScriptData = bitcore.Script(redeemScriptHex)
          var redeemScriptString = redeemScriptData.toString()
          newTx.redeemScript = redeemScriptString
          // get nlocktime value from redeem script
          var nLockTimeData = redeemScriptData.chunks[0].buf
          var nLockTime = bitcore.crypto.BN.fromBuffer(
            nLockTimeData, { endian: 'little' }
          )
          var nLockTimeString = nLockTime.toString()
          newTx.nLockTime = Number(nLockTimeString)
        }
      }

      // return output
      newTx.destAddr = destAddr
      newTx.isSentToScript = isSentToScript
      newTx.isHodlTx = isHodlTx
      newTx.isSpent = isSpent
      newTx.isRewardPaid = isRewardPaid
      newTx.timeNow = vm.timeNow()
      return newTx
    },

    buildHodlSpendTx (utxos, redeemScript, nLockTime) {
      // this is the main function,
      // processes and builds the hodl spend tx

      var vm = this

      // new key names
      var newUtxos = []
      for (i in utxos) {
        var d = {}
        d.prevTxId = utxos[i].txid
        d.outputIndex = utxos[i].vout
        d.address = utxos[i].address
        d.script = utxos[i].scriptPubKey
        d.satoshis = utxos[i].satoshis
        newUtxos.push(d)
      }

      // calculate total amount to be sent (recovered)
      var totalAmount = 0
      for ( var i in newUtxos ) {
        totalAmount += utxos[i].satoshis
      }
      totalAmount = totalAmount - 10000

      // get private key
      var privateKey = new bitcore.PrivateKey(
        vm.wallet.privKey.toString('hex')
      )

      // get public key
      var publicKey = privateKey.publicKey.toBuffer()

      // use bitcore to build the transaction
      var transaction = new bitcore.Transaction()
      var hashData = bitcore.crypto.Hash.sha256ripemd160(publicKey)
      var sigtype = 0x01

      // add inputs
      for (var utxo in newUtxos) {
        transaction.addInput(
          new bitcore.Transaction.Input.PublicKeyHash({
            output: new bitcore.Transaction.Output({ // previous output
              script: newUtxos[utxo].script,
              satoshis: newUtxos[utxo].satoshis
            }),
            prevTxId: newUtxos[utxo].prevTxId,
            outputIndex: newUtxos[utxo].outputIndex,
            script: redeemScript
          })
        )
      }

      // required after adding inputs
      transaction.lockUntilDate(nLockTime)

      // add outputs
      var myAddress = vm.wallet.address
      transaction.addOutput(new bitcore.Transaction.Output({
        script: new bitcore.Script.buildPublicKeyHashOut(myAddress),
        satoshis: totalAmount
      }))

      // signing inputs...
      var redeemScriptData = bitcore.Script(redeemScript)
      var BufferUtil = bitcore.util.buffer
      for (var i in transaction.inputs) {

        // get signature hash
        var sighash = bitcore.Transaction.Sighash.sign(
          transaction, privateKey, sigtype, Number(i), redeemScript)

        // get signature
        var signature = bitcore.Transaction.Signature({
          publicKey: publicKey,
          prevTxId: transaction.inputs[i].prevTxId,
          outputIndex: transaction.inputs[i].outputIndex,
          inputIndex: Number(i),
          signature: sighash,
          sigtype: sigtype
        })

        // add signature
        var script = new bitcore.Script()
          .add(BufferUtil.concat([
            signature.signature.toDER(),
            BufferUtil.integerAsSingleByteBuffer(signature.sigtype)
          ]))
          .add(redeemScriptData.toBuffer());

        // apply signature
        transaction.inputs[i].setScript(script)
      }
      // output
      return transaction.toString()
    },

    broadcastTx (rawtx) {
      console.log('broadcasting transaction...')
      var vm = this

      // construct call url
      var url = (vm.wallet.coin.explorer + "insight-api-komodo/tx/send")

      axios
        .post(url, {'rawtx': rawtx})
        .then(response => {
          return response.data.txid
          console.log("transaction broadcast")
        })
        .catch(e => {
          console.log(e)
        });
    },

    spendHodlUtxos (bAddr, redeemScript, nLockTime) {
      var vm = this

      // get utxos
      console.log('getting utxos...')

      // construct call url
      var url = (
        vm.wallet.coin.explorer +
        "insight-api-komodo/addr/" +
        bAddr +
        "/utxo"
      )

      // make call to api to get utxos
      axios
        .get(url)
        // process transaction
        .then(response => {
          var utxos = response.data
          // call main function
          var rawTx = vm.buildHodlSpendTx(utxos, redeemScript, nLockTime)
          // broadcast transaction
          var txId = vm.broadcastTx(rawTx)
          // re-schedule refresh timer
          this.scheduleTxHistoryTimer(1000)
        })
        .catch(e => {
          console.log(e)
        });
    },

    timeNow () {
      var d = new Date()
      return Math.round(d.getTime() / 1000)
    },

    linkGen (pageNum) {
      // leave empty
      // required to generate custom page url
      // do not delete this function, or bad things will happen
    }
  },

  computed: {
    txsUrl () {
      var currentPage = this.currentPage - 1
      var fromItem = 0
      if (currentPage > 0 ) {
        fromItem = (currentPage * 10)
      }
      return this.txsUrlBase + '?from=' + fromItem
    },
  }
};

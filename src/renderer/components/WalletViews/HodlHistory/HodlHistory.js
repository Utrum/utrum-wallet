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
  props: ['wallet', 'reload', 'parent'],
  data() {
    return {
      totalRows: 10,
      transactions: [],
      sortBy: '',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      isBusy: false,
      fields: [
        { key: 'time', label: 'Date' },
        { key: 'nLockTime', label: 'Status / Unlock Time', sortable: false },
        { key: 'formattedAmount', label: 'Amount' },
        { key: 'txid', label: 'TxID' },
      ],
      // the template dedicated to parent "withdraw"
      // will use the following fields instead
      fieldsWithdraw: [
        { key: 'time', label: 'Date' },
        { key: 'nLockTime', label: 'Info', sortable: false },
        { key: 'formattedAmount', label: 'Amount' },
        { key: 'confirmations', label: 'Conf' },
        { key: 'txid', label: 'TxID' },
      ],
      // boostrap-vue related
      timer: null,
      dismissSecs: 20,
      dismissAlertCountDown: 0,
      dismissErrorCountDown: 0,
      alertText: '',
      errorText: ''
    };
  },

  watch: {
    reload: function () {
      if ( typeof this.reload !== 'undefined' ) {
        var vm = this
        // beware: calling scheduleTxHistoryTimer results
        // in eventual infinite loops, don't do that
        clearInterval(vm.timer)
        // delay refreshing for the given time in milliseconds
        setTimeout(function(){vm.refreshTable();}, vm.reload[0]);
        vm.scheduleTxHistoryTimer(60000)
      }
    }
  },

  methods: {
    cancelTxHistoryTimer () {
      //cancel if already running
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    scheduleTxHistoryTimer (milsec) {
      // default is 1 minute
      var milliseconds = milsec || 60000
      this.cancelTxHistoryTimer()
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

    dateFormat (time) {
      const blockchainDateUtc = moment.utc(time * 1000)
      const dateString = moment(blockchainDateUtc)
        .local()
        .format('DD MMM, hh:mm a')
      return dateString
    },

    txHistory () {
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
          items[item] = vm.analyzeTx(items[item])
          // for gui, custom "amount" format
          if ( items[item].isHodlTx === false &&
               items[item].isHodlSpend === false ) {
            if ( this.wallet.address !== items[item].destAddr ) {
              items[item].formattedAmount = String(items[item].sentAmount * -1)
            } else if ( !items[item].isToSelf ) {
              items[item].formattedAmount = '+' + items[item].sentAmount
            } else if ( items[item].isToSelf ) {
              items[item].formattedAmount = String(items[item].sentAmount)
            }
          } else if (items[item].isHodlTx === true) {
            items[item].formattedAmount = items[item].sentAmount
          } else if (items[item].isHodlSpend === true) {
            items[item].formattedAmount = items[item].rewardReceived
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

    analyzeTx (tx) {
      var vm = this

      // prepare hodl relevant variables
      let coinExplorer = vm.wallet.coin.explorer
      if ( coinExplorer.slice(-1) !== '/') {  // add forward slash if needed
        coinExplorer += '/'
      }
      var explorerUrl = (
        coinExplorer + 'tx/' +
        tx.txid
      )

      // determine if transaction was created by us
      let isMine = false
      let destAddr = vm.wallet.address
      let fromAddr = null
      if ( tx.vin.length > 0 ) {
        fromAddr = tx.vin[0].addr
        if ( vm.wallet.address === fromAddr ) {
          isMine = true
          destAddr = tx.vout[0].scriptPubKey.addresses[0] //TODO improve logic
        }
      }

      // get sent amount
      let sentAmount = Number(0)
      let isToSelf = null
      for (var i in tx.vout) {
        try {
          let voutAddr = tx.vout[i].scriptPubKey.addresses[0]
          let voutValue = Number(tx.vout[i].value)
          let myAddress = vm.wallet.address
          // determine sent amount
          if (
            ( isMine && voutAddr !== myAddress ) ||
            ( !isMine && voutAddr === myAddress )
            ) {
            sentAmount += ( voutValue * 100000000)  // javascript's stupid
            isToSelf = false  // either case confirms that it's not a "to-self" tx
          }
        } catch (e) { }
      }
      if ( isToSelf === null ) {
        for (var i in tx.vout) {
          try {
            let voutAddr = tx.vout[i].scriptPubKey.addresses[0]
            let voutValue = Number(tx.vout[i].value)
            let myAddress = vm.wallet.address
            if ( isMine && voutAddr === myAddress ) {
              sentAmount += ( voutValue * 100000000 )
              isToSelf = true  // we can confirm that this was a "to-self" tx
            }
          } catch (e) { }
        }
      }
      // finally convert back from satoshis
      sentAmount = sentAmount > 0 ? sentAmount / 100000000 : 0;

      // determine if sent to script address instead of normal address
      var isSentToScript = destAddr.substring(0,1) == 'b' ? true : false

      // determine if first hodl deposit may be marked as spent
      let vout0SH = tx.vout[0].spentHeight
      let isSpent = isSentToScript && ( vout0SH > 0 ) ? true : false

      // create output object
      var newTx = {
        "explorerUrl": explorerUrl,
        "destAddr": destAddr,
        "fromAddr": fromAddr,
        "isSentToScript": isSentToScript,
        "isHodlTx": false,
        "isHodlSpend": false,
        "isSpent": isSpent,
        "isMine": isMine,
        "isToSelf": isToSelf,
        "timeNow": vm.timeNow(),
        "sentAmount": sentAmount
      }
      Object.assign(newTx, tx)

      // read opreturn label
      var opReturnString = ''
      if (tx.vout[1]) {
        var opReturnHex = tx.vout[1].scriptPubKey.hex
        var opReturnData = bitcore.Script(opReturnHex)
        opReturnString = opReturnData.chunks[1].buf ?
          opReturnData.chunks[1].buf.toString() : ''
      }

      // check if this is an utrum hodl deposit transaction
      if ( opReturnString.substring(0,13) == "REDEEM SCRIPT" ) {
        newTx.isHodlTx = true
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
      // check if this is an utrum hodl spend transaction
      } else if ( opReturnString == "HODL FUNDS UNLOCKED" ) {
        newTx.isHodlSpend = true
        newTx.rewardReceived = "0"
        if (newTx.vin[0].value < newTx.vout[0].value) {
          var rewardReceived = newTx.vout[0].value - newTx.vin[1].value
          newTx.rewardReceived = String(parseFloat(rewardReceived).toFixed(4))
        }
      }

      // return output
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

      // add opreturn label
      var op_return = "HODL FUNDS UNLOCKED"
      transaction.addData(op_return)

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
          var txid = response.data.txid
          console.log('txid:', txid)
          vm.showAlert("Hodl deposit and reward unlocked!")
          // re-schedule lastTxId timer
          vm.scheduleTxHistoryTimer(vm.dismissSecs * 1000)
        })
        .catch(e => {
          vm.showError(e.toString())
          throw e.toString()
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
          vm.broadcastTx(rawTx)
        })
        .catch(e => {
          vm.showError(e.toString())
          throw e.toString()
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
    },

    // boostrap-vue related
    alertCountDownChanged (n) {
      this.dismissAlertCountDown = n
    },
    errorCountDownChanged (n) {
      this.dismissErrorCountDown = n
    },
    showAlert (msg) {
      this.dismissAlertCountDown = this.dismissSecs
      this.alertText = msg
    },
    showError(msg) {
      this.dismissErrorCountDown = this.dismissSecs
      this.errorText = msg
    }

  },

  computed: {
    txsUrlBase () {
      let coinExplorer = this.wallet.coin.explorer
      if ( coinExplorer.slice(-1) !== '/') {
        coinExplorer += '/'
      }
      let ticker = this.wallet.ticker
      let apiPath = ticker === 'BTC' ? 'api' : 'insight-api-komodo'
      return ( coinExplorer +
      apiPath + "/addrs/" +
      this.wallet.address +
      "/txs")
    },

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

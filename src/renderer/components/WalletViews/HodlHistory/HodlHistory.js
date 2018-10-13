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
      transactionsUrl: (
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
      fields: [
        { key: 'time', label: 'Time', sortable: true },
        { key: 'blockheight', label: 'Block' },
        { key: 'confirmations', label: 'Conf' },
        { key: 'sentAmount', label: `Amount` },
        { key: 'txid', label: 'TxID' },
      ],
    };
  },
  methods: {

    openTxExplorer: (row) => {
      var txid = row.item.txid
      shell.openExternal(row.item.explorerUrl);
    },

    handlePending(value) {
      if (value) {
        return value;
      }
      return 0;
    },

    copyToClipboard(row) {
      clipboard.writeText(row.item.txid);
      this.$toasted.show('Copied !', {
        duration: 1000,
        icon: 'done',
      });
    },

    satoshiToBitcoin(amount) {
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },

    getColorAmount(amount) {
      return (amount > 0) ? 'positiveColor' : 'negativeColor';
    },

    dateFormat(time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('hh:mm A MM/DD/YY');
      return dateString;
    },

    txHistory () {
      console.log('getting transaction history...')
      var vm = this
      let url = vm.txsUrl
      let promise = axios
      .get(url)

      return promise
      .then(response => {
        let items = response.data.items

        // process each transaction
        for (var item in items) {
          items[item] = vm.processTx(items[item])
        }

        // calculate number of pages
        vm.totalRows = response.data.totalItems

        // update shared data
        vm.transactions = items

        // return data
        return(items || [])
      })
      .catch(e => {
        console.log(e)
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
      var isUtrumHodlTx = false

      // detect if p2sh transaction
      if ( destAddr.substring(0,1) == 'b' ){
        isSentToScript = true
        var opReturnAsm = tx.vout[1].scriptPubKey.asm
        var opReturnHex = tx.vout[1].scriptPubKey.hex
        // check if this is an utrum hodl deposit
        let hodlDepositHint = "OP_RETURN 52454445454d2053435249505420"
        if ( opReturnAsm.substring(0,38) == hodlDepositHint ) {
          isUtrumHodlTx = true
          // get op_return data
          var opReturnData = bitcore.Script(opReturnHex)
          var opReturnString = opReturnData.chunks[1].buf.toString()
          // get redeem script from op_return data
          var header = "REDEEM SCRIPT "
          var redeemScriptHex = opReturnString.replace(header, '')
          var redeemScriptData = bitcore.Script(redeemScriptHex)
          var redeemScriptString = redeemScriptData.toString()
          newTx.redeemScript = redeemScriptHex
          // get nlocktime value from redeem script
          var nLockTimeData = redeemScriptData.chunks[0].buf
          var nLockTime = bitcore.crypto.BN.fromBuffer(
            nLockTimeData, { endian: 'little' }
          )
          var nLockTimeString = nLockTime.toString()
          newTx.nLockTime = nLockTimeString
          //console.log(nLockTimeString) // TESTING
        }
      }
      return newTx
    },

    linkGen (pageNum) {
      // leave empty
      // required to generate custom page url
    }
  },

  computed: {
    txsUrl () {
      var currentPage = this.currentPage - 1
      var fromItem = 0
      if (currentPage > 0 ) {
        fromItem = (currentPage * 10)
      }
      return this.transactionsUrl + '?from=' + fromItem
    },
  },
};

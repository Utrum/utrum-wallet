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
      sortBy: '',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      timer: '',
      fields: [
        { key: 'time', label: 'Time', sortable: true },
        { key: 'blockheight', label: 'Block' },
        { key: 'confirmations', label: 'Conf' },
        { key: 'sentAmount', label: `Amount` },
        { key: 'txid', label: 'TxID' },
      ],
    };
  },
  created: function() {
    this.timer = setInterval(this.txHistory, 60000);
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
        for (var item in items) {
          // define "amount sent" as the first output value
          var sentAmount = items[item].vout[0].value
          items[item].sentAmount = sentAmount
          // build explorer tx page url
          items[item].explorerUrl = (
            vm.wallet.coin.explorer + '/tx/' +
            items[item].txid
          )
        }
        // calculate number of pages
        vm.totalRows = response.data.totalItems
        return(items || [])
      })
      .catch(e => {
        console.log(e)
        return([])
      });
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
  beforeDestroy() {
    clearInterval(this.timer);
  }
};

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

const moment = require('moment');
const coins = require('libwallet-mnz').coins;
const electron = require('electron');
const { clipboard } = require('electron');

const satoshiNb = 100000000;

export default {
  name: 'transaction-buy-history',
  props: ['coin'],
  data() {
    return {
      detailTx: { explorerLink: '' },
      totalRows: this.$store.getters.getWalletTxs(this.coin.ticker).length,
      sortBy: 'time',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'time', label: 'Time Stamp', sortable: true },
        { key: 'address', label: 'Address' },
        { key: 'confirmations', label: 'Conf' },
        { key: 'amount', label: `Amount (${this.coin.ticker})` },
        { key: 'tx_hash', label: 'TxID' },
      ],
    };
  },
  methods: {
    openTxExplorer: (row) => {
      coins.all.forEach(coin => {
        if (row.item.ticker === coin.ticker) {
          electron.shell.openExternal(`${coin.explorer}/tx/${row.item.tx_hash}`);
        }
      });
    },
    handlePending(value) {
      if (value) {
        return value;
      }
      return 0;
    },
    copyToClipboard(row) {
      clipboard.writeText(row.item.tx_hash);
      this.$toasted.show('Copied !', {
        duration: 1000,
        icon: 'done',
      });
    },
    myRowClickHandler() {
    },
    satoshiToBitcoin(amount) {
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },
    getColorAmount(amount) {
      return (amount > 0) ? 'positiveColor' : 'negativeColor';
    },
    dateFormat(time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('YYYY-MM-DD hh:mm A');
      return dateString;
    },
    getIconFromTicker(value) {
      return require(`@/assets/icon-${value}.svg`); // eslint-disable-line
    },
    getPrice(row) {
      return Number(Math.abs(row.item.cryptoAmount / row.item.mnzAmount).toFixed(8));
    },
    getTotalPrice(row) {
      return BigNumber(Math.abs(row.item.cryptoAmount)).dividedBy(satoshiNb).toNumber();
    },
  },
  computed: {
    txHistory() {
      return this.$store.getters.getWalletTxs(this.coin.ticker);
    },
  },
};

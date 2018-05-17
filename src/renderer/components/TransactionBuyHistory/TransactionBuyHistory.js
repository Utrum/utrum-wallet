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

const electron = require('electron');
const coins = require('libwallet-mnz').coins;
const moment = require('moment');

const satoshiNb = 100000000;


export default {
  name: 'transaction-buy-history',
  props: ['coin'],
  data() {
    return {
      swapDetailData: {
        time: 0,
        ticker: '',
        mnzAmount: 0,
        cryptoAmount: 0,
        mnzTxHash: '',
        cryptoHash: '',
      },
      totalRows: this.$store.getters.getSwapList.length,
      sortBy: 'time',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'time', label: 'Date / Hours', sortable: true },
        { key: 'ticker', label: 'Type' },
        { key: 'mnzAmount', label: 'MNZ' },
        { key: 'price41', label: 'Price - 1 MNZ' },
        { key: 'price4all', label: 'Total' },
        { key: 'status', label: 'Status' },
      ],
    };
  },
  methods: {
    openTxExplorer: (ticker, value) => {
      if (value != null) {
        coins.all.forEach(coin => {
          if (ticker === coin.ticker) {
            electron.shell.openExternal(`${coin.explorer}/tx/${value}`);
          }
        });
      }
    },
    openSwapDetail(item) {
      this.swapDetailData = item;
      this.$refs.swapDetailModal.show();
    },
    satoshiToBitcoin(amount) {
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },
    getColorAmount(amount) {
      return (amount > 0) ? 'positiveColor' : 'negativeColor';
    },
    dateFormat(time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('hh:mm A DD/MM/YYYY');
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
    swapDetailTitle() {
      if (this.swapDetailData != null && this.swapDetailData.ticker != null) {
        const dateSwap = moment.utc(this.swapDetailData.time * 1000);
        const dateString = moment(dateSwap).local().format('hh:mm A DD/MM/YYYY');
        return `Swap Detail: ${this.swapDetailData.ticker} <> ${this.$store.getters.getTickerForExpectedCoin('MNZ')} | ${dateString}`;
      }
      return '';
    },
    txHistory() {
      return this.$store.getters.getSwapList;
    },
  },
};

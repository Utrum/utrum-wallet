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

import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';

const sb = require('satoshi-bitcoin');
const moment = require('moment');


export default {
  name: 'transaction-buy-history',
  props: ['coin'],
  data() {
    return {
      totalRows: this.$store.getters.getWalletTxs(this.coin.ticker).length,
      sortBy: 'time',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'time', label: 'Date / Hours', sortable: true },
        { key: 'height', label: 'Block Height' },
        { key: 'confirmations', label: 'Confirmations' },
        { key: 'amount', label: `Amount (${this.coin.ticker})` },
        { key: 'address', label: 'Address' },
      ],
    };
  },
  components: {
    explorer: ExplorerLink,
  },
  methods: {
    handlePending(value) {
      if (value) {
        return value;
      }
      return 0;
    },
    myRowClickHandler() {
    },
    satoshiToBitcoin(amount) {
      return sb.toBitcoin(amount);
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
      return sb.toBitcoin(Math.abs(row.item.cryptoAmount));
    },
  },
  computed: {
    txHistory() {
      return this.$store.getters.getWalletTxs(this.coin.ticker);
    },
  },
};

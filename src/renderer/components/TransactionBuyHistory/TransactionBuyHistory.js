import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';
import { BigNumber } from 'bignumber.js';

const moment = require('moment');

const satoshiNb = 100000000;


export default {
  name: 'transaction-buy-history',
  props: ['coin'],
  data() {
    return {
      totalRows: this.$store.getters.getSwapList2.length,
      sortBy: 'time',
      sortDesc: true,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'time', label: 'Date / Hours', sortable: true },
        { key: 'ticker', label: 'Type', sortable: true },
        { key: 'mnzAmount', label: 'MNZ', sortable: true },
        { key: 'price41', label: 'Price - 1 MNZ', sortable: true },
        { key: 'price4all', label: 'Total', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
      ],
    };
  },
  components: {
    explorer: ExplorerLink,
  },
  methods: {
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
    txHistory() {
      return this.$store.getters.getSwapList2;
    },
  },
};

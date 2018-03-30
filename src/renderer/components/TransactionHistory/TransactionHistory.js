import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';

const sb = require('satoshi-bitcoin');
const moment = require('moment');

export default {
  name: 'transaction-history',
  props: ['fromTokenSale', 'coin'],
  data() {
    return {
      sortBy: 'time',
      sortDesc: true,
    };
  },
  components: {
    explorer: ExplorerLink,
  },
  methods: {
    myRowClickHandler(record) {
      this.$swal('Swap info', JSON.stringify(record));
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

    // KMD/BTC
    getPrice(row) {
      return Math.abs(row.item.cryptoTx.amount / row.item.mnzTx.amount).toFixed(8);
    },

    // MNZ
    getTotalPrice(row) {
      return sb.toBitcoin(Math.abs(row.item.mnzTx.amount));
    },
  },
  computed: {
    txHistory() {
      return this.fromTokenSale ? this.$store.getters.getSwapList
       : this.$store.getters.getWalletTxs(this.coin.ticker);
    },
    fields()  {
      if (this.fromTokenSale) {
        return [
          {
            key: 'cryptoTx.time',
            label: 'Date / Hours',
            sortable: true,
          },
          {
            key: 'ticker',
            label: 'Type',
            sortable: true,
          },
          {
            key: 'mnzTx.amount',
            label: 'Amount',
            sortable: true,
          },
          {
            key: 'price41',
            label: 'Price',
            sortable: true,
          },
          {
            key: 'price4all',
            label: 'Total',
            sortable: true,
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
          },
        ];
      }
      return [
        {
          key: 'height',
          label: 'Block Height',
          sortable: true,
        },
        {
          key: 'amount',
          label: `Amount (${this.coin.ticker})`,
          sortable: true,
        },
      ];
    },
  },
};

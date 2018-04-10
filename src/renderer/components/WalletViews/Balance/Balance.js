import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';

export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
  },
  mounted() {
    Object.keys(this.wallets).forEach((ticker) => {
      this.$store
        .dispatch('updateBalance', this.wallets[ticker])
        .catch(() => { })
      ;
    }, this);
  },
  methods: {
    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
  },
  computed: {
    wallets() {
      return this.$store.getters.getWallets;
    },
    totalBalance() {
      return this.numberWithSpaces(this.$store.getters.getTotalBalance.toFixed(2));
    },
  },
};

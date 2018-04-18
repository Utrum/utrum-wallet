import Select2 from '@/components/Utils/Select2/Select2.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import TransactionBuyHistory from '@/components/TransactionBuyHistory/TransactionBuyHistory.vue';
import { BigNumber } from 'bignumber.js';

const { clipboard } = require('electron');

export default {
  name: 'buy',
  components: {
    select2: Select2,
    'select-awesome': SelectAwesome,
    'transaction-buy-history': TransactionBuyHistory,
  },
  data() {
    const satoshiNb = 100000000;
    return {
      satoshiNb,
      searchable: false,
      blocks: 36,
      estimatedFee: 0,
      feeSpeed: 'low',
      fees: [
        { id: 0, label: 'Very fast', blocks: 1, value: 'veryFast' },
        { id: 1, label: 'Fast', blocks: 6, value: 'fast' },
        { id: 2, label: 'Low', blocks: 36, value: 'low' },
      ],
      selectedFee: null,
      select: '',
      requestedNumberOfSatochisMnz: BigNumber(this.$store.getters.getConfig.minBuy).multipliedBy(satoshiNb),
      packageIncrement: BigNumber(this.$store.getters.getConfig.minBuy).multipliedBy(satoshiNb),
      coupon: '',
      timer: true,
    };
  },
  mounted() {
    this.selectFee = this.fees[0].label;
  },
  created() {
    this.select = this.$store.getters.isTestMode ? 'TESTKMD' : 'KMD';
  },
  methods: {
    numberWithSpaces(x) {
      const parts = x.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join('.');
    },
    onFeeChange(data) {
      const oldLabel = this.feeSpeed;
      const oldBlocks = this.blocks;
      this.blocks = data.blocks;
      this.feeSpeed = data.label;
      this.prepareTx()
        .then((tx) => {
          if (tx != null &&
            tx.outputs != null &&
            tx.inputs != null) {
            this.$refs.feeSelector.selectedLabel = oldLabel;
            this.blocks = oldBlocks;
            this.$toasted.error('You don\'t have enough funds to select this.');
          }
        })
      ;
    },
    onShowBuyModal() {
      this.prepareTx()
        .then((tx) => {
          if (tx.inputs == null && tx.outputs == null) {
            this.hideModal();
            this.$toasted.info("You don't have enough funds for buying (with fees included)");
          } else {
            this.showModal();
          }
        })
      ;
    },
    hideModal() {
      if (this.$refs.confirmBuy != null) {
        this.$refs.confirmBuy.hide();
      }
    },
    showModal() {
      if (this.$refs.confirmBuy != null) {
        this.$refs.confirmBuy.show();
      }
    },
    methodToRunOnSelect(payload) {
      this.object = payload;
    },
    valueChange(value) {
      this.select = value;
      this.prepareTx();
    },
    incrementPackage() {
      if (this.getPackage.multipliedBy(this.satoshiNb).comparedTo(this.getMaxBuy.minus(this.packageIncrement)) <= 0) {
        this.requestedNumberOfSatochisMnz = this.requestedNumberOfSatochisMnz.plus(this.packageIncrement);
      }
    },
    decrementPackage() {
      if (this.getPackage.multipliedBy(this.satoshiNb).comparedTo(this.getMinBuy) > 0) {
        this.requestedNumberOfSatochisMnz = this.requestedNumberOfSatochisMnz.minus(this.packageIncrement);
      }
    },
    prepareTx() {
      // Number here because of bitcoinjs incapacity to use Big types.
      const amount = Number(this.getTotalSatochisPrice.toFixed(0));
      const object = {
        wallet: this.wallet,
        amount: amount,
        blocks: this.blocks,
        data: this.coupon,
      };
      return this.$store.dispatch('createSwapTransaction', object)
        .then((tx) => {
          if (tx != null &&
              tx.outputs != null &&
              tx.inputs != null) {
            this.estimatedFee = BigNumber(tx.fee);
          }
          return tx;
        })
      ;
    },
    buyMnz() {
      this.timer = false;
      this.hideModal();

      return this.prepareTx()
        .then((tx) => {
          const payload = {
            wallet: this.wallet,
            ...tx,
            amountMnz: this.totalMnzWithBonus.multipliedBy(this.satoshiNb),
          };
          return this.$store.dispatch('swap', payload);
        })
        .then((response) => {
          alert(this.$toasted.show, response);
          setTimeout(() => { this.timer = true; }, 3000);
        })
        .catch(error => {
          this.$toasted.error(`Can't send transaction, verify your pending tx and unconfirmed balance: ${error.msg}`);
        })
      ;
    },
    setInvisibleDecrement() {
      if (this.getPackage.multipliedBy(this.satoshiNb).comparedTo(this.getMinBuy) === 0) {
        return 'invisible';
      }
    },
    setInvisibleIncrement() {
      if (this.getPackage.multipliedBy(this.satoshiNb).comparedTo(this.getMaxBuy) === 0) {
        return 'invisible';
      }
    },
  },
  computed: {
    mnzTicker() {
      return this.$store.getters.isTestMode ? 'TESTMNZ' : 'MNZ';
    },
    coins() {
      return this.$store.getters.enabledCoins
        .filter(coin => coin.ticker.indexOf('MNZ') < 0)
        .map(coin => coin.ticker);
    },
    totalMnzWithBonus() {
      return this.requestedNumberOfSatochisMnz
        .plus(this.requestedNumberOfSatochisMnz.multipliedBy(this.getCurrentBonus)).dividedBy(this.satoshiNb);
    },
    getPackage: {
      get: function () {
        return this.requestedNumberOfSatochisMnz.dividedBy(this.satoshiNb);
      },
      set: function (newValue) {
        const value = BigNumber(newValue).multipliedBy(this.satoshiNb);
        const maxBuy = this.getMaxBuy;
        const minBuy = this.getMinBuy;

        if (value.comparedTo(maxBuy) === 1) {
          this.requestedNumberOfSatochisMnz = BigNumber(maxBuy);
        } else if (value.comparedTo(minBuy) === -1) {
          this.requestedNumberOfSatochisMnz = BigNumber(minBuy);
        } else {
          this.requestedNumberOfSatochisMnz = value;
        }
      },
    },
    getPlaceholder() {
      return `Amount ${this.mnzTicker}...`;
    },
    getMinBuy() {
      return BigNumber(this.$store.getters.getConfig.minBuy).multipliedBy(this.satoshiNb);
    },
    getMaxBuy() {
      return BigNumber(this.$store.getters.getConfig.maxBuy).multipliedBy(this.satoshiNb);
    },
    getConfig() {
      return this.$store.getters.getConfig;
    },
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    },
    getMnzBalance() {
      return this.$store.getters.getWalletByTicker(this.mnzTicker).balance;
    },
    getStringTicket() {
      return this.$store.getters.getWalletByTicker(this.select).coin.name;
    },
    getTotalSatochisPrice() {
      const priceFor1Mnz = this.$store.getters.getTotalPrice(this.wallet.ticker); // Price for 1 MNZ in KMD or BTC.
      return this.requestedNumberOfSatochisMnz.multipliedBy(priceFor1Mnz);
    },
    getTotalPrice() {
      const priceFor1Mnz = this.$store.getters.getTotalPrice(this.wallet.ticker);
      return this.requestedNumberOfSatochisMnz.multipliedBy(priceFor1Mnz).dividedBy(this.satoshiNb);
    },
    getTotalPriceWithFee() {
      return this.getTotalSatochisPrice.plus(this.estimatedFee).dividedBy(this.satoshiNb);
    },
    getCurrentBonus() {
      return this.$store.getters.getCurrentBonus(this.wallet.ticker);
    },
    isBonus() {
      return this.getCurrentBonus !== 0;
    },
    canBuy() {
      const balance = this.wallet.balance - this.wallet.balance_unconfirmed;
      return this.requestedNumberOfSatochisMnz.comparedTo(0) <= 0 || this.getTotalPrice.comparedTo(balance) === 1;
    },
  },
};

const alert = (alertFunction, message) => {
  if (message.error) {
    alertFunction('Transaction not sent !', { text: message.error });
    return;
  }

  alertFunction('Transaction sent !', {
    icon: 'done',
    action: [
      {
        icon: 'close',
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        },
      },
      {
        icon: 'content_copy',
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
          clipboard.writeText(message);
          setTimeout(() => {
            this.$toasted.show('Copied !', {
              duration: 1000,
              icon: 'done',
            });
          }, 800);
        },
      },
    ],
  });
};

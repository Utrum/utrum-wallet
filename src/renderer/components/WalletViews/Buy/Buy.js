import Select2 from '@/components/Utils/Select2/Select2.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import TransactionBuyHistory from '@/components/TransactionBuyHistory/TransactionBuyHistory.vue';
import { BigNumber } from 'bignumber.js';

const { clipboard } = require('electron');

const satoshiNb = 100000000;

export default {
  name: 'buy',
  components: {
    select2: Select2,
    'select-awesome': SelectAwesome,
    'transaction-buy-history': TransactionBuyHistory,
  },
  data() {
    return {
      searchable: false,
      blocks: 36,
      fee: 0,
      estimatedFee: 0,
      preparedTx: {},
      feeSpeed: 'low',
      fees: [
        { id: 0, label: 'Very fast', blocks: 1, value: 'veryFast' },
        { id: 1, label: 'Fast', blocks: 6, value: 'fast' },
        { id: 2, label: 'Low', blocks: 36, value: 'low' },
      ],
      selectedFee: null,
      select: '',
      packageMNZ: BigNumber(this.$store.getters.getConfig.minBuy).multipliedBy(satoshiNb),
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
      this.prepareTx().then(() => {
        if (!this.preparedTx.inputs && !this.preparedTx.outputs) {
          this.$refs.feeSelector.selectedLabel = oldLabel;
          this.blocks = oldBlocks;
          this.$toasted.error('You don\'t have enough funds to select this.');
        }
      });
    },
    onShowBuyModal() {
      this.prepareTx().then(() => {
        if (!this.preparedTx.inputs && !this.preparedTx.outputs) {
          this.hideModal();
          this.$toasted.info("You don't have enough funds for buying (with fees included)");
        } else {
          this.$refs.confirmBuy.show();
        }
      });
    },
    prepareTx() {
      return this.estimateTransaction().then(tx => {
        if (tx.outputs != null && tx.inputs != null) {
          this.estimatedFee = BigNumber(tx.fee).dividedBy(satoshiNb).toNumber();
        }
        this.preparedTx = tx;
      });
    },
    estimateTransaction() {
      return this.$store.dispatch('prepareTransaction', {
        wallet: this.wallet,
        amount: BigNumber(this.getTotalPrice).multipliedBy(satoshiNb).toNumber(),
        blocks: this.blocks,
        data: this.coupon,
      });
    },
    hideModal() {
      this.$refs.confirmBuy.hide();
    },
    methodToRunOnSelect(payload) {
      this.object = payload;
    },
    valueChange(value) {
      this.select = value;
      this.prepareTx();
    },
    incrementPackage() {
      if (BigNumber(this.getPackage).multipliedBy(satoshiNb).toNumber() <= this.getMaxBuy - this.packageIncrement) {
        this.getPackage += BigNumber(this.packageIncrement).dividedBy(satoshiNb).toNumber();
      }
    },
    decrementPackage() {
      if (BigNumber(this.getPackage).multipliedBy(satoshiNb).toNumber() > this.getMinBuy) {
        this.getPackage -= BigNumber(this.packageIncrement).dividedBy(satoshiNb).toNumber();
      }
    },
    async buyMnz() {
      this.timer = false;
      setTimeout(() => {
        this.timer = true;
      }, 3000);

      await this.prepareTx();
      const payload = {
        wallet: this.wallet,
        ...this.preparedTx,
        amountMnz: this.totalMnzWitBonus,
      };

      this.$store
        .dispatch('buyAsset', payload)
        .then(response => {
          if (response.error) {
            this.$toasted.error(response.error);
            Promise.reject();
          }
          this.$toasted.show('Transaction sent !', {
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
                  clipboard.writeText(response);
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
        })
        .catch(error => {
          this.$toasted.error(`Can't send transaction, verify your pending tx and unconfirmed balance: ${error.msg}`);
        })
      ;
      this.hideModal();
    },
    checkMin() {
      if (BigNumber(this.getPackage).multipliedBy(satoshiNb).toNumber() === this.getMinBuy) {
        return 'invisible';
      }
    },
    checkMax() {
      if (BigNumber(this.getPackage).multipliedBy(satoshiNb).toNumber() === this.getMaxBuy) {
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
    totalMnzWitBonus() {
      return this.packageMNZ.plus(this.packageMNZ.multipliedBy(this.getCurrentBonus));
    },
    getPackage: {
      get: function () {
        return BigNumber(this.packageMNZ).dividedBy(satoshiNb).toNumber();
      },
      set: function (newValue) {
        const value = BigNumber(newValue).multipliedBy(satoshiNb).toNumber();
        const maxBuy = this.getMaxBuy;
        const minBuy = this.getMinBuy;

        if (value > maxBuy) {
          this.packageMNZ = BigNumber(maxBuy);
        } else if (value < minBuy) {
          this.packageMNZ = BigNumber(minBuy);
        } else {
          this.packageMNZ = BigNumber(value);
        }
      },
    },
    getPlaceholder() {
      return `Amount ${this.mnzTicker}...`;
    },
    getMinBuy() {
      return BigNumber(this.$store.getters.getConfig.minBuy).multipliedBy(satoshiNb).toNumber();
    },
    getMaxBuy() {
      return BigNumber(this.$store.getters.getConfig.maxBuy).multipliedBy(satoshiNb).toNumber();
    },
    getConfig() {
      return this.$store.getters.getConfig;
    },
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    },
    walletMnz() {
      return this.$store.getters.getWalletByTicker(this.mnzTicker);
    },
    getBalance() {
      return this.$store.getters.getWalletByTicker(this.select).balance.toFixed(8);
    },
    getMnzBalance() {
      return this.$store.getters.getWalletByTicker(this.mnzTicker).balance;
    },
    getStringTicket() {
      return this.$store.getters.getWalletByTicker(this.select).coin.name;
    },
    getTotalPrice() {
      return this.packageMNZ.dividedBy(satoshiNb)
      .multipliedBy(this.$store.getters.getTotalPrice(this.wallet)).dividedBy(satoshiNb).toFixed(8);
    },
    getTotalPriceWithFee() {
      return BigNumber(this.getTotalPrice).plus(this.estimatedFee).toFixed(8);
    },
    getCurrentBonus() {
      return this.$store.getters.getCurrentBonus(this.wallet);
    },
    isBonus() {
      return this.getCurrentBonus !== 0;
    },
    canBuy() {
      const mnzToBuy = this.packageMNZ;
      const balance = this.wallet.balance - this.wallet.balance_unconfirmed;

      return mnzToBuy <= 0 || this.getTotalPrice > balance;
    },
  },
};

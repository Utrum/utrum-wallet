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

import Select2 from '@/components/Utils/Select2/Select2.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import TransactionBuyHistory from '@/components/TransactionBuyHistory/TransactionBuyHistory.vue';
import { BigNumber } from 'bignumber.js';
import { mapGetters } from 'vuex';
import * as _ from 'lodash';

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
    let minBuy = 0;
    const config = this.$store.getters.getConfig;

    if (config != null) {
      minBuy = config.minBuy != null ? config.minBuy : 0;
    }
    const fees = [
      { id: 0, label: 'High Fees', speed: 'fast', value: 'veryFast' },
      { id: 1, label: 'Medium Fees', speed: 'medium', value: 'fast' },
      { id: 2, label: 'Low Fees', speed: 'slow', value: 'low' },
    ];

    return {
      buttonIsClicked: false,
      resetFees: false,
      max: 100,
      satoshiNb,
      searchable: false,
      speed: fees[2].speed,
      estimatedFee: 0,
      feeSpeed: 'low',
      fees: fees,
      selectedFee: fees[2].label,
      select: '',
      requestedNumberOfSatochisMnz: BigNumber(minBuy).multipliedBy(satoshiNb),
      packageIncrement: BigNumber(minBuy).multipliedBy(satoshiNb),
      couponValue: '',
      timer: true,
    };
  },
  mounted() {
    this.selectedFee = this.fees[2].label;
    this.prepareTx();
  },
  created() {
    this.select = this.$store.getters.getTickerForExpectedCoin('KMD');
  },
  methods: {
    icoIsNotRunningClass() {
      if (!this.icoIsRunning) {
        return 'h-100';
      }
      return '';
    },
    numberWithSpaces(x) {
      const parts = x.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join('.');
    },
    onFeeChange(data) {
      this.speed = data.speed;
      this.feeSpeed = data.label;
      this.prepareTx();
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
      if (this.package.multipliedBy(this.satoshiNb).comparedTo(this.getMaxBuy.minus(this.packageIncrement)) <= 0) {
        this.requestedNumberOfSatochisMnz = this.requestedNumberOfSatochisMnz.plus(this.packageIncrement);
      }
    },
    decrementPackage() {
      if (this.package.multipliedBy(this.satoshiNb).comparedTo(this.getMinBuy) > 0) {
        this.requestedNumberOfSatochisMnz = this.requestedNumberOfSatochisMnz.minus(this.packageIncrement);
      }
    },
    prepareTx() {
      // Number here because of bitcoinjs incapacity to use Big types.
      const amount = Number(this.getTotalSatoshiPrice.toFixed(0));
      const object = {
        wallet: this.wallet,
        amount: amount,
        speed: this.speed,
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
    debounceInput: _.debounce(function () {
      this.prepareTx();
    }, 1300),
    buyMnz() {
      this.timer = false;
      this.hideModal();

      if (this.buttonIsClicked === false) {
        this.buttonIsClicked = true;
        return this.prepareTx()
          .then((tx) => {
            const payload = {
              wallet: this.wallet,
              ...tx,
              amount: this.getTotalSatoshiPrice.toFixed(0),
              amountMnz: this.totalMnzWithBonus.multipliedBy(this.satoshiNb),
            };
            return this.$store.dispatch('swap', payload);
          })
          .then((response) => {
            alert(this, response);
            setTimeout(() => { this.timer = true; }, 3000);
          })
          .catch((error) => {
            this.$toasted.error(`Can't send transaction, verify your pending tx and unconfirmed balance: ${error.message}`);
          }).then(() => {
            this.couponValue = '';
            this.buttonIsClicked = false;
          });
      }
    },
    setInvisibleDecrement() {
      if (this.package.multipliedBy(this.satoshiNb).comparedTo(this.getMinBuy) === 0) {
        return 'invisible';
      }
    },
    setInvisibleIncrement() {
      if (this.package.multipliedBy(this.satoshiNb).comparedTo(this.getMaxBuy) === 0) {
        return 'invisible';
      }
    },
    getCanBuyClass() {
      if (this.canBuy === true) {
        return 'toHighPurchase';
      }
      return '';
    },
  },
  computed: {
    coupon: {
      get: function () {
        return this.couponValue;
      },
      set: function (newValue) {
        this.couponValue = newValue;
        if (!/^([0-9A-Fa-f]+)$/.test(newValue)) {
          this.couponValue = newValue.substring(0, newValue.length - 1);
        } else {
          this.debounceInput();
        }
      },
    },
    progress() {
      const config = this.$store.getters.getConfig;
      let progress = 0;
      if (config != null) {
        progress = config.progress != null ? config.progress : 0;
      }
      return BigNumber(progress).multipliedBy(100).toNumber();
    },
    icoTimeLeft() {
      if (this.$store.getters.getConfig.icoEndDate != null) {

        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date();
        const secondDate = new Date(this.$store.getters.getConfig.icoEndDate * 1000);
        const timeLeft = new Date(secondDate.getTime() - firstDate.getTime());

        const dayLeft = Math.round(Math.abs((timeLeft.getTime()) / (oneDay)));
        if (dayLeft <= 1) {
          const hoursLeft = timeLeft.getHours();
          if (hoursLeft <= 0) {
            const minuteLeft = timeLeft.getMinutes();
            return `${minuteLeft} Minutes Left`;
          }
          return `${hoursLeft} Hours Left`;
        }
        return `${dayLeft} Days Left`;
      }
      return 0;
    },
    ...mapGetters(['icoIsRunning']),
    mnzTicker() {
      return this.$store.getters.getTickerForExpectedCoin('MNZ');
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
    package: {
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
    getTotalSatoshiPrice() {
      const priceFor1Mnz = this.$store.getters.getTotalPrice(this.wallet.ticker); // Price for 1 MNZ in KMD or BTC.
      const priceTransaction = this.requestedNumberOfSatochisMnz.multipliedBy(priceFor1Mnz);
      const roundedPriceTransaction = priceTransaction.integerValue(BigNumber.ROUND_UP);
      return roundedPriceTransaction;
    },
    getTotalPrice() {
      return this.getTotalSatoshiPrice.dividedBy(this.satoshiNb);
    },
    getEstimatedFee() {
      return BigNumber(this.estimatedFee).dividedBy(this.satoshiNb).toString();
    },
    getTotalPriceWithFee() {
      return this.getTotalSatoshiPrice.plus(this.estimatedFee).dividedBy(this.satoshiNb);
    },
    getCurrentBonus() {
      return this.$store.getters.getCurrentBonus(this.wallet.ticker);
    },
    isBonus() {
      return this.getCurrentBonus !== 0;
    },
    canBuy() {
      let balance = BigNumber(0);
      if (this.wallet.balance != null) {
        balance = BigNumber(this.wallet.balance);
      }
      return this.requestedNumberOfSatochisMnz.comparedTo(0) <= 0 || this.getTotalPriceWithFee.comparedTo(balance) === 1;
    },
  },
};

const alert = (context, message) => {
  if (message.error) {
    context.$toasted.show('Transaction not sent !', { text: message.error });
    return;
  }

  context.$toasted.show('Transaction sent !', {
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
            context.$toasted.show('Copied !', {
              duration: 1000,
              icon: 'done',
            });
          }, 800);
        },
      },
    ],
  });
};

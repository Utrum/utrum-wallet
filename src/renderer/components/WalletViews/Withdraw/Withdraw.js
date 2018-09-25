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

import bitcoinjs from 'bitcoinjs-lib';
import { QrcodeReader } from 'vue-qrcode-reader';
import Select2 from '@/components/Utils/Select2/Select2.vue';
import TransactionHistory from '@/components/TransactionHistory/TransactionHistory.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

const { clipboard } = require('electron');

export default {
  name: 'withdraw',
  components: {
    select2: Select2,
    'transaction-history': TransactionHistory,
    'select-awesome': SelectAwesome,
    QrcodeReader,
  },
  created() {
    this.select = this.$store.getters.getTickerForExpectedCoin('OOT');
  },
  data() {
    return {
      satoshiNb: 100000000,
      blocks: 1,
      estimatedFee: 0,
      feeSpeed: 'fast',
      fees: [
        { id: 0, label: 'Very fast', speed: 'fast', value: 'veryFast' },
        { id: 1, label: 'Fast', speed: 'medium', value: 'fast' },
        { id: 2, label: 'Low', speed: 'slow', value: 'low' },
      ],
      videoConstraints: {
        width: {
          min: 265,
          ideal: 265,
          max: 265,
        },
        height: {
          min: 250,
          ideal: 250,
          max: 250,
        },
      },
      paused: false,
      readingQRCode: false,
      select: '',
      withdraw: {
        amount: null,
        address: '',
        coin: 'OOT',
      },
      history: [],
    };
  },
  methods: {
    onMaxSelected() {
      this.withdraw.amount = this.getBalance;
    },
    onShowBuyModal() {
      return this.prepareTx()
        .then((tx) => {
          if (tx.inputs == null && tx.outputs == null) {
            this.hideModal();
            this.$toasted.info("You don't have enough funds for buying (with fees included)");
          } else {
            this.$refs.confirmBuy.show();
          }
        })
        ;
    },
    onChange() {
      this.prepareTx();
    },
    onFeeChange(data) {
      this.speed = data.speed;
      this.prepareTx();
    },
    onConfirmWithdrawModal() {
      this.prepareTx();
    },
    hideModal() {
      this.$refs.confirmWithdraw.hide();
    },
    onDecode(content) {
      if (this.checkAddress(content)) {
        this.withdraw.address = content;
        this.$toasted.show('Address inserted !', { icon: 'done' });
      } else {
        this.$toasted.error('This address is not valid !', { icon: 'error' });
      }
      this.readingQRCode = false;
      this.$root.$emit('bv::hide::modal', 'readerQrcodeModal');
    },
    checkAddress(addr) {
      if (addr) {
        const checkResult = bitcoinjs.address.fromBase58Check(addr);
        if (this.wallet.ticker.indexOf('BTC') >= 0) {
          return checkResult.version === 0;
        } else if (this.wallet.ticker.indexOf('KMD') >= 0 || this.wallet.ticker.indexOf('OOT') >= 0) {
          return checkResult.version === 60;
        }
      } else {
        return false;
      }
    },
    async onInit(promise) {
      this.loading = true;

      try {
        await promise;

        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          // passed constraints don't match any camera. Did you requested the front camera although there is none?
        } else {
          // browser is probably lacking features (WebRTC, Canvas)
        }
      } finally {
        this.loading = false;
      }
    },
    updateCoin(value) {
      this.withdraw = {
        amount: null,
        address: '',
        coin: value,
      };
      this.select = value;
    },
    prepareTx() {
      // Number here because of bitcoinjs incapacity to use Big types.
      const amount = this.getAmountInSatoshis.toNumber();

      const object = {
        wallet: this.wallet,
        address: this.withdraw.address,
        amount,
        speed: this.speed,
      };

      return this.$store.dispatch('createTransaction', object)
        .then((tx) => {
          if (tx != null &&
            tx.outputs != null &&
            tx.inputs != null) {
            this.estimatedFee = BigNumber(tx.fee);
          } else if (tx != null && tx.feeRate != null) {
            this.estimatedFee = BigNumber(tx.feeRate);
          }
          return tx;
        })
        ;
    },
    debounceInfo: _.debounce(function () {
      this.$toasted.info('The address is not valid.');
    }, 500),
    withdrawFunds() {
      this.hideModal();
      if (this.canWithdraw === true && this.addressIsValid === true) {
        return this.prepareTx()
          .then(tx => {
            if (tx != null && tx.feeRate != null) {
              return Promise.reject({ message: 'Not enough balance including fees.' });
            }
            return this.$store.dispatch('broadcastTransaction', { wallet: this.wallet, ...tx });
          })
          .then((response) => {
            this.withdraw.amount = null;
            this.withdraw.address = '';
            alert(this, response);
          })
          .catch(error => {
            if (error.__type !== null && BigNumber(this.withdraw.amount).comparedTo(21000000) === 1) {
              this.$toasted.info("You can't send more than 21 million at once");
            } else {
              this.$toasted.error(`Can't send transaction: ${error.message}`);
            }
          })
          ;
      }
    },
  },
  computed: {
    amount: {
      get: function () {
        if (this.withdraw.amount != null) {
          return decimalsCount(BigNumber(this.withdraw.amount));
        }
        return null;
      },
      set: function (value) {
        if (value !== '') {
          this.withdraw.amount = BigNumber(value).toFixed(8);
        } else {
          this.withdraw.amount = null;
        }
      },
    },
    getAmountInSatoshis() {
      if (this.amount != null) {
        const amountInSatoshis = BigNumber(this.amount).multipliedBy(this.satoshiNb);
        return amountInSatoshis;
      }
      return BigNumber(0);
    },
    getConfig() {
      return this.$store.getters.getConfig;
    },
    coins() {
      return this.$store.getters.enabledCoins.map(coin => coin.ticker);
    },
    getTotalPriceWithFee() {
      if (this.getAmountInSatoshis != null && this.estimatedFee != null) {
        return decimalsCount(this.getAmountInSatoshis.plus(this.estimatedFee).dividedBy(this.satoshiNb));
      }
      return '';
    },
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    },
    getSatoshisBalance() {
      return BigNumber(this.$store.getters.getWalletByTicker(this.select).balance).multipliedBy(this.satoshiNb);
    },
    getBalance() {
      return BigNumber(this.$store.getters.getWalletByTicker(this.select).balance);
    },
    getUSDAmount() {
      return BigNumber(this.$store.getters.getWalletByTicker(this.select).balance_usd.toFixed(2));
    },
    canWithdraw() {
      if (this.withdraw.amount != null) {
        if (this.addressIsValid === false && this.withdraw.address.length === 34) {
          this.debounceInfo();
        }
        return (this.getAmountInSatoshis.comparedTo(this.getSatoshisBalance) <= 0 &&
          this.getAmountInSatoshis.comparedTo(0) === 1 && this.addressIsValid);
      }
      return false;
    },
    addressIsValid() {
      if (this.withdraw.address) {
        try {
          const versionBase58 = bitcoinjs.address.fromBase58Check(this.withdraw.address).version;
          if (this.select === this.$store.getters.getTickerForExpectedCoin('BTC')) {
            return versionBase58 === 111 || versionBase58 === 0;
          } else if (this.select === this.$store.getters.getTickerForExpectedCoin('KMD')
            || this.select === this.$store.getters.getTickerForExpectedCoin('OOT')) {
            return versionBase58 === 60;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
    },
  },
};

const decimalsCount = (value) => {
  if (value != null) {
    if (value.isInteger()) {
      return value.toFixed(0);
    }
    return value.toFixed(value.decimalPlaces());
  }
  return null;
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

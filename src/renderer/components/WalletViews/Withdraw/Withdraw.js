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
    this.select = this.$store.getters.getTickerForExpectedCoin('MNZ');
  },
  data() {
    return {
      satoshiNb: 100000000,
      blocks: 1,
      estimatedFee: 0,
      feeSpeed: 'veryFast',
      fees: [
        { id: 0, label: 'Very fast', blocks: 1, value: 'veryFast' },
        { id: 1, label: 'Fast', blocks: 6, value: 'fast' },
        { id: 2, label: 'Low', blocks: 36, value: 'low' },
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
        coin: 'MNZ',
      },
      history: [],
    };
  },
  methods: {
    onMaxSelected() {
      this.withdraw.amount = this.getBalance.multipliedBy(this.satoshiNb);
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
      this.blocks = data.blocks;
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
        } else if (this.wallet.ticker.indexOf('KMD') >= 0 || this.wallet.ticker.indexOf('MNZ') >= 0) {

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
      const amount = Number(this.withdraw.amount.toFixed(0));

      const object = {
        wallet: this.wallet,
        address: this.withdraw.address,
        amount,
        blocks: this.blocks,
      };

      return this.$store.dispatch('createTransaction', object)
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
    withdrawFunds() {
      this.hideModal();
      if (this.canWithdraw && this.addressIsValid) {
        return this.prepareTx()
          .then(tx => {
            return this.$store.dispatch('broadcastTransaction', { wallet: this.wallet, ...tx });
          })
          .then((response) => {
            alert(this.$toasted.show, response);
          })
          .catch(error => {
            this.$toasted.error(`Can't send transaction: ${error.msg}`);
          })
        ;
      }
    },
  },
  computed: {
    amount: {
      get: function () {
        if (this.withdraw.amount != null) {
          return this.withdraw.amount.dividedBy(this.satoshiNb).toString();
        }
        return this.withdraw.amount;
      },
      set: function (value) {
        if (value !== '' && value[value.length - 1] !== '.') {
          try {
            this.withdraw.amount = BigNumber(BigNumber(value).toFixed(8)).multipliedBy(this.satoshiNb);
          } catch (error) {
            this.withdraw.amount = null;
          }
        }
      },
    },
    getConfig() {
      return this.$store.getters.getConfig;
    },
    coins() {
      return this.$store.getters.enabledCoins.map(coin => coin.ticker);
    },
    getTotalPriceWithFee() {
      if (this.withdraw.amount != null && this.estimatedFee != null) {
        return BigNumber(this.withdraw.amount).plus(this.estimatedFee).dividedBy(this.satoshiNb);
      }
      return BigNumber(0);
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
    canWithdraw() {
      if (this.withdraw.amount != null) {
        return (this.withdraw.amount.comparedTo(this.getSatoshisBalance) <= 0 &&
                this.withdraw.amount.comparedTo(0) === 1 && this.addressIsValid);
      }
      return false;
    },
    addressIsValid() {
      if (this.withdraw.address) {
        try {
          return bitcoinjs.address.fromBase58Check(this.withdraw.address).version > 0;
        } catch (error) {
          return false;
        }
      }
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

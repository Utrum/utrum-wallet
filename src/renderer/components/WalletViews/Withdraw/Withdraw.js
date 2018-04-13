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

const sb = require('satoshi-bitcoin');
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
    this.select = this.$store.getters.isTestMode ? 'TESTMNZ' : 'MNZ';
  },
  data() {
    return {
      blocks: 1,
      fee: 0,
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
    async onShowBuyModal() {
      await this.prepareTx();
      if (!this.preparedTx.inputs && !this.preparedTx.outputs) {
        this.hideModal();
        this.$toasted.info("You don't have enough funds for buying (with fees included)");
      } else {
        this.$refs.confirmBuy.show();
      }
    },
    async estimateTransaction() {
      return await this.$store.dispatch('prepareTransaction', {
        wallet: this.wallet,
        address: this.withdraw.address,
        amount: sb.toSatoshi(this.withdraw.amount),
        blocks: this.blocks,
      });
    },
    async prepareTx() {
      const tx = await this.estimateTransaction();
      if (tx.alphaTx && tx.alphaTx.outputs && tx.alphaTx.inputs) {
        this.estimatedFee = sb.toBitcoin(tx.alphaTx.fee);
      }
      this.preparedTx = tx.alphaTx;
      return tx;
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
        this.$toasted.show('Address inserted !', {
          icon: 'done',
        });
      } else {
        this.$toasted.error('This address is not valid !', {
          icon: 'error',
        });
      }

      this.readingQRCode = false;
      this.$root.$emit('bv::hide::modal', 'readerQrcodeModal');
    },
    checkAddress(addr) {
      if (addr) {
        const checkResult = bitcoinjs.address.fromBase58Check(addr);
        if (this.wallet.ticker === 'BTC') return checkResult.version === 0;
        else if (this.wallet.ticker === 'KMD'
          || this.wallet.ticker === 'MNZ') return checkResult.version === 60;
      } else return false;
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
    withdrawFunds() {
      this.hideModal();
      if (this.canWithdraw && this.addressIsValid) {
        this.prepareTx().then(tx => {
          this.$store.dispatch('sendTransaction', { wallet: this.wallet, ...tx }).then(txBroadcast => {
            if (!txBroadcast.error) {
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
                      clipboard.writeText(txBroadcast);
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
            } else {
              this.$toasted.error('Transaction not sent !', {
                text: txBroadcast.error,
              });
            }
          });
        });
      }
    },
  },
  computed: {
    getConfig() {
      return this.$store.getters.getConfig;
    },
    coins() {
      return this.$store.getters.enabledCoins.map(coin => coin.ticker);
    },
    getTotalPriceWithFee() {
      return (Number(this.withdraw.amount) + sb.toBitcoin(this.fee)).toFixed(8);
    },
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    },
    getBalance() {
      return this.$store.getters.getWalletByTicker(this.select).balance;
    },
    canWithdraw() {
      return (this.withdraw.amount <= this.getBalance && this.withdraw.amount > 0 && this.addressIsValid);
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

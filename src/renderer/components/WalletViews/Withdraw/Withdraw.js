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
      listData: [
        'BTC',
        'KMD',
        'MNZ',
      ],
      select: 'MNZ',
      withdraw: {
        amount: null,
        address: '',
        coin: 'MNZ',
      },
      history: [],
    };
  },
  methods: {
    calculateFees(value) {
      if (this.select === 'BTC') this.callEstimateFee(value.blocks);
      else if (this.select === 'MNZ') {
        this.fee = 0;
      } else {
        this.fee = 10000;
      }
    },
    sendToken() {
      this.calculateFees(this.fees[0]);
    },
    callEstimateFee(blocks) {
      const self = this;
      this.wallet.electrum.getEstimateFee(blocks).then(response => {
        self.fee = response;
      });
    },
    onChange(value) {
      this.calculateFees(value);
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
        coin: 'MNZ',
      };
      this.select = value;
      this.withdraw.coin = value;
    },
    withdrawFunds() {
      this.hideModal();
      if (this.canWithdraw && this.addressIsValid) {
        const self = this;
        this.wallet.electrum.listUnspent(this.wallet.address).then(response => {
          this.wallet.ticker = self.wallet.ticker;

          const tx = this.wallet.prepareTx(response, self.withdraw.address, sb.toSatoshi(self.withdraw.amount), self.fee);

          self.wallet.electrum.broadcast(tx)
          .then((response) => {
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
                    clipboard.writeText(response.data);
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
          }).catch((error) => {
            this.$toasted.error('Transaction not sent !', {
              text: error.response,
            });
          });
        });
      }
    },
  },
  computed: {
    getConfig() {
      return this.$store.getters.getConfig;
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
      if (this.withdraw.address) return bitcoinjs.address.fromBase58Check(this.withdraw.address).version > 0;
    },
  },
};

import QrcodeModal from '@/components/Utils/QrcodeModal/QrcodeModal.vue';

export default {
  name: 'balance-item',
  components: {
    'qrcode-modal': QrcodeModal,
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isClipboard: false,
    };
  },
  methods: {
    getUnconfirmedColor(amount) {
      if (amount != null) {
        return (amount.comparedTo(0) === 1) ? 'positiveColor' : 'negativeColor';
      }
    },
    numberWithSpaces(x) {
      if (Number(x) > 0) {
        const parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join('.');
      }
      return x;
    },
    onCopy() {
      const self = this;
      this.isClipboard = true;
      setTimeout(() => {
        self.isClipboard = false;
      }, 1000);
    },
  },
  computed: {
    getQRCodeClass() {
      if (this.wallet.balance_unconfirmed == null) {
        return 'row-custom';
      }
      return this.wallet.balance_unconfirmed.comparedTo(0) === 0 ? 'row-custom' : '';
    },
    isBalanceUnconfirmedIsFilled() {
      if (this.wallet.balance_unconfirmed == null || this.wallet.balance_unconfirmed.comparedTo(0) === 0) {
        return false;
      }
      return this.wallet.balance_unconfirmed.comparedTo(0) !== 0;
    },
  },
};

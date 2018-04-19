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
      return (amount.comparedTo(0) === 1) ? 'positiveColor' : 'negativeColor';
    },
    getQRCodeClass(amount) {
      return amount.comparedTo(0) === 0 ? 'row-custom' : '';
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
};

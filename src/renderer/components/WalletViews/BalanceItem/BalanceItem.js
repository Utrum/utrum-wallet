import QrcodeModal from '@/components/Utils/QrcodeModal/QrcodeModal.vue';

export default {
  name: 'balance-item',
  components: {
    'qrcode-modal' : QrcodeModal
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isClipboard: false,
    }
  },
  methods: {
    getUnconfirmedColor(amount) {
      if (amount > 0) {
				return "positiveColor"
			} else {
				return "negativeColor"
			}
    },
    getQRCodeClass(amount) {
      if (amount == 0) {
        return "row-custom"
      }
    },
    numberWithSpaces(x) {
      if (Number(x) > 0) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
      } else {
        return x;
      }
    },
    onCopy() {
      var self = this
      this.isClipboard = true;
      setTimeout(function(){
        self.isClipboard = false;
      }, 1000);
    }
  },
}
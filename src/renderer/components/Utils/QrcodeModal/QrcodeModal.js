import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';

export default {
  name: 'qrcode-modal',
  components: {
    explorer: ExplorerLink,
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      headerBgVariant: 'none',
    };
  },
  methods: {
    hideModal() {
      this.$refs.qrcodemodal.hide();
    },
  },
};

import { mapGetters } from 'vuex';

export default {
  name: 'sidebar',
  data() {
    return {
      balanceState: true,
      buyMnzState: false,
      withdrawalState: false,
    };
  },
  methods: {
    balanceClicked() {
      this.balanceState = true;
      this.buyMnzState = false;
      this.withdrawalState = false;
    },
    buyMnzClicked() {
      this.balanceState = false;
      this.buyMnzState = true;
      this.withdrawalState = false;
    },
    withdrawalClicked() {
      this.balanceState = false;
      this.buyMnzState = false;
      this.withdrawalState = true;
    },
  },
  computed: {
    ...mapGetters(['icoIsRunning']),
  },
};

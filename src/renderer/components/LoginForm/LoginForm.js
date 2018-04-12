import { mapGetters } from 'vuex';

export default {
  name: 'login-form',
  data() {
    return {
      passphraseId: 'passphrase-show',
      iconMdpId: 'icon-mdp-show',
      typeInput: 'password',
      passphrase: '',
      btnSendStatus: '',
      testMode: null,
    };
  },
  watch: {
    passphrase(passphrase) {
      if (passphrase !== '') {
        this.btnSendStatus = 'show-button';
      } else {
        this.btnSendStatus = '';
      }
    },
  },
  created() {
    this.testMode = this.isTestMode;
  },
  computed: {
    ...mapGetters(['isTestMode']),
  },
  methods: {
    checkboxTestMode() {
      this.testMode = this.testMode === true;
      this.$store.dispatch('setTestMode', this.testMode);
    },
    validatePassPhrase() {
      if (this.passphrase) {
        this.$store.dispatch('login', this.passphrase);
        this.$router.push('/wallet');
      }
    },
    createPassphrase() {
      this.$router.push('/createpassphrase');
    },
    changeTypeInputPassphrase() {
      if (this.typeInput === 'password') {
        this.passphraseId = 'passphrase-hide';
        this.iconMdpId = 'icon-mdp-hide';
        this.typeInput = 'text';
      } else {
        this.passphraseId = 'passphrase-show';
        this.iconMdpId = 'icon-mdp-show';
        this.typeInput = 'password';
      }
    },
  },
};

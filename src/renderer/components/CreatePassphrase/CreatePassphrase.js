import bip39 from 'bip39';

const { clipboard } = require('electron');

export default {
  name: 'create-passphrase',
  data() {
    return {
      step1: true,
      step2: false,
      step3: false,
      passphraseGenerated: '',
      isConfirmed: false,
      passphraseValue: '',
    };
  },
  computed: {
    disabledBtn() {
      return this.isConfirmed ? '' : 'disabledBtn';
    },
  },
  mounted() {
    this.passphraseGenerated = bip39.generateMnemonic(256);
    clipboard.clear();
  },
  methods: {
    getRandomPassphrase() {
      return this.passphraseGenerated;
    },

    cancelCreate() {
      this.$router.push('/login-form');
    },
    generatePassphrase() {
      this.passphraseGenerated = bip39.generateMnemonic(256);
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    },
    continueCreate() {
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    },
    backArrow() {
      if (this.step1) {
        this.$router.push('/login-form');
      } else if (this.step2) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
      } else if (this.step3) {
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
      }
    },
    checkPassphrase() {
      this.isConfirmed = (this.passphraseGenerated === this.passphraseValue);
    },
    validatePassPhrase() {
      if (this.passphraseValue && this.isConfirmed) {
        this.$store.dispatch('login', this.passphraseValue);
        this.$router.push('/wallet');
      }
    },
  },
};

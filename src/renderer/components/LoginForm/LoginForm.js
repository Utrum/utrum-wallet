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
export default {
  name: 'login-form',
  data() {
    return {
      passphraseId: 'passphrase-show',
      iconMdpId: 'icon-mdp-show',
      typeInput: 'password',
      passphrase: '',
      btnSendStatus: '',
      // testMode: null,
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
  methods: {
    handleChange(e) {
      this.passphrase = e.target.value;
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
        this.typeInput = 'text';
      } else {
        this.passphraseId = 'passphrase-show';
        this.typeInput = 'password';
      }
    },
  },
};

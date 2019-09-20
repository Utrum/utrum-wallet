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

import bip39 from 'bip39';

const { clipboard } = {} // require('electron');

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
      isClipboard: false,
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
    onCopy() {
      this.isClipboard = true;
      setTimeout(() => {
        this.isClipboard = false;
      }, 1000);
    },
    onPaste(){
      this.passphraseValue = clipboard.readText();
      this.checkPassphrase()
    }
  },
};

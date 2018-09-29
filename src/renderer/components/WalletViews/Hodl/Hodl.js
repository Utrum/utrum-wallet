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

import bitcoinjs from 'bitcoinjs-lib';
import Select2 from '@/components/Utils/Select2/Select2.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import TransactionBuyHistory from '@/components/TransactionBuyHistory/TransactionBuyHistory.vue';
import { BigNumber } from 'bignumber.js';
import { mapGetters } from 'vuex';
import * as _ from 'lodash';
import bitcore from 'bitcore-lib';

const { clipboard } = require('electron');

export default {
  name: 'hodl',
  components: {
    select2: Select2,
    'select-awesome': SelectAwesome
  },
  created() {
    this.select = this.$store.getters.getTickerForExpectedCoin('OOT');
  },
  data() {
    return {
      hodl_input: {
        address: '',
        amount: '',
        block: ''
      },
      satoshiNb: 100000000,
      blocks: 1,
      estimatedFee: 0,
      feeSpeed: 'fast',
      fees: [
        { id: 0, label: 'Very fast', speed: 'fast', value: 'veryFast' },
        { id: 1, label: 'Fast', speed: 'medium', value: 'fast' },
        { id: 2, label: 'Low', speed: 'slow', value: 'low' },
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
      select: '',
      withdraw: {
        amount: null,
        address: '',
        coin: 'OOT',
      },
      history: [],
    };
  },
  methods: {
  },
  computed: {
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    },
    this_wallet: function () {
      var privateKey = new bitcore.PrivateKey(this.wallet.privKey.toString('hex'))
      console.log("privateKey: " + privateKey);
      var publicKey = new bitcore.PublicKey(privateKey);
      console.log("publicKey: " + publicKey)
      console.log("address: " + publicKey.toAddress().toString())
      return publicKey.toString()
    },
    ECPair_test: function () {
    }
  }
}

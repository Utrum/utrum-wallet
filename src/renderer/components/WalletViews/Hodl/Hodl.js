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
// import TransactionBuyHistory from '@/components/TransactionBuyHistory/TransactionBuyHistory.vue';
import { BigNumber } from 'bignumber.js';
// import { mapGetters } from 'vuex';
// import * as _ from 'lodash';
import bitcore from 'bitcore-lib';
import axios from 'axios';

const { clipboard } = require('electron');
const moment = require('moment');

export default {
  name: 'hodl',
  components: {
    select2: Select2,
    'select-awesome': SelectAwesome
  },
  created () {
    this.select = this.$store.getters.getTickerForExpectedCoin('OOT');
  },
  mounted () {
    // initialize hodl wallet
    this.hodl_wallet = this.fill_hodl_wallet()
    // default vesting period to two months
    this.hodl_input.height = (Date.now() / 1000 | 0) + 5184000
    this.coinsUnlockTime = this.dateFormat(this.hodl_input.height)
  },
  data () {
    return {
      hodl_input: {
        address: '',
        amount: '',
        height: ''
      },
      hodl_wallet: {
        height: '',
        scriptAddress: '',
        redeemScript: ''
      },
      scriptAddress: 'Please specify a height and press "Enter".',
      coinsUnlockTime: '',
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
    // method to retrieve hodl script from the hodl api
    getScript(url) {
      var vm = this
      vm.scriptAddress = "Loading..."
      vm.coinsUnlockTime = ""
      vm.hodl_input.height = ""
      axios
        .get(url)
        .then(response => {
          vm.hodl_wallet["redeemScript"] = response.data["redeemScript"]
          vm.hodl_wallet["scriptAddress"] = response.data["address"]
          vm.scriptAddress = response.data["address"]
          vm.coinsUnlockTime = vm.dateFormat(vm.hodl_wallet.height)
        })
        .catch(e => {
          console.log(e)
        });
    },
    // hodl script creation
    hodl_create() {
      var vm = this
      vm.hodl_wallet["scriptAddress"] = ''
      vm.hodl_wallet["redeemScript"] = ''
      vm.hodl_wallet["height"] = vm.hodl_input.height

      var url = "https://explorer.utrum.io/hodl-api/create/"
      url += vm.hodl_wallet.publicKey
      url += "/" + vm.hodl_input.height
      vm.getScript(url)
    },
    // here we store hodl related data
    fill_hodl_wallet () {
      var dict = {};

      var privateKey = new bitcore.PrivateKey(this.wallet.privKey.toString('hex'));
      dict["privateKey"] = privateKey.toString();

      var publicKey = new bitcore.PublicKey(privateKey);
      dict["publicKey"] = publicKey.toString();

      var address = publicKey.toAddress();
      dict["address"] = address.toString();

      return dict;
    },
    dateFormat(time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('hh:mm A DD/MM/YYYY');
      return dateString;
    }
  },
  computed: {
    // get bitcoinjs-lib wallet
    wallet() {
      return this.$store.getters.getWalletByTicker(this.select);
    }
  }
}

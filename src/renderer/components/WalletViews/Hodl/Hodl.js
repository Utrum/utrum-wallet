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
const electron = require('electron');

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
    this.hodlData = this.fillHodlData()
    this.updateHeight()
  },
  data () {
    return {
      hodlInput: {
        amount: '',
        height: ''
      },
      hodlData: {
        height: '',
        scriptAddress: '',
        redeemScript: ''
      },
      scriptAddress: '',
      coinsUnlockTime: '',
      redeemScript: '',
      validator: '',
      isClipboard: false,
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
    // for the hodl address copy button
    onCopy() {
      const self = this;
      this.isClipboard = true;
      setTimeout(() => {
        self.isClipboard = false;
      }, 1000);
    },
    // open links on an external browser
    openValidator () {
      electron.shell.openExternal(`${this.validator}`);
    },
    // update hodl height
    updateHeight () {
      // default vesting period to two months
      this.hodlInput.height = (Date.now() / 1000 | 0) + 5184000
      this.coinsUnlockTime = this.dateFormat(this.hodlInput.height)
    },
    // method to retrieve hodl script from the hodl api
    getScript (url) {
      var vm = this
      vm.scriptAddress = "Loading..."
      // reset human readable unlock time
      vm.coinsUnlockTime = ""
      vm.redeemScript = ""
      vm.validator = ""
      axios
        .get(url)
        .then(response => {
          // update hodl data object
          vm.hodlData["redeemScript"] = response.data["redeemScript"]
          vm.hodlData["scriptAddress"] = response.data["address"]
          // update gui data
          vm.redeemScript = response.data["redeemScript"]
          vm.scriptAddress = response.data["address"]
          vm.validator = 'https://deckersu.github.io/coinbin/?verify=' + response.data["redeemScript"]
          vm.coinsUnlockTime = vm.dateFormat(vm.hodlData.height)
        })
        .catch(e => {
          console.log(e)
        });
    },
    // hodl script creation
    hodlCreate () {
      var vm = this

      // update height/unlock time to now
      vm.updateHeight()

      vm.hodlData["scriptAddress"] = ''
      vm.hodlData["redeemScript"] = ''
      vm.hodlData["height"] = vm.hodlInput.height

      var url = "https://explorer.utrum.io/hodl-api/create/"
      url += vm.hodlData.publicKey
      url += "/" + vm.hodlInput.height
      vm.getScript(url)
    },
    // here we store hodl related data
    fillHodlData () {
      var dict = {};

      var privateKey = new bitcore.PrivateKey(this.wallet.privKey.toString('hex'));
      dict["privateKey"] = privateKey.toString();

      var publicKey = new bitcore.PublicKey(privateKey);
      dict["publicKey"] = publicKey.toString();

      var address = publicKey.toAddress();
      dict["address"] = address.toString();

      return dict;
    },
    dateFormat (time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = moment(blockchainDateUtc).local().format('hh:mm A DD/MM/YYYY');
      return dateString;
    }
  },
  computed: {
    // get bitcoinjs-lib wallet
    wallet () {
      return this.$store.getters.getWalletByTicker(this.select);
    }
  }
}

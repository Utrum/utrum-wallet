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
import { BigNumber } from 'bignumber.js';
import bitcore from 'bitcore-lib';
import axios from 'axios';
import vSelect from 'vue-select'

const { clipboard } = require('electron');
const { shell } = require('electron');
const moment = require('moment');

import HodlHistory from '@/components/WalletViews/HodlHistory/HodlHistory.vue';

export default {
  name: 'hodl',
  components: {
    'hodl-history': HodlHistory,
    'v-select': vSelect
  },

  mounted () {
    // initialize hodl wallet
    this.hodlData = this.fillHodlData()
    this.updateUnlockTime()
    this.vestingPeriod = this.timeList[0]
  },

  data () {
    return {
      hodlInput: {
        amount: '',
        // daysToLock: 60 // TESTING!
        daysToLock: null
      },
      hodlData: {
        unlockTime: '',
        scriptAddress: '',
        redeemScript: '',
        myUtxos: [],
      },
      unlockTimeDate: '',
      expectedReward: '',
      scriptAddress: '',
      redeemScript: '',
      rawtx: '',
      lastTxId: '',
      isClipboard: false,
      satoshiNb: 100000000,
      blocks: 1,
      selectedCoin: 'OOT',
      vestingPeriod: null,
      timeList: [
        {
          text: '15 minutes',
          value: 15
        },
        {
          text: '30 minutes',
          value: 30
        },
      ]
    };
  },

  methods: {
    // vue-select stuff
    onTimeChange(selectedOption) {
      if (selectedOption) {
          this.hodlInput.daysToLock = selectedOption.value
      }
    },

    // open returned transaction id link
    openTxExplorer () {
      shell.openExternal(`${this.explorer}tx/${this.lastTxId}`);
    },

    // for copy button
    onCopy() {
      const self = this;
      this.isClipboard = true;
      setTimeout(() => {
        self.isClipboard = false;
      }, 1000);
    },

    // update hodl unlock time
    updateUnlockTime () {
      // convert days to seconds
      //var secondsToLock = (this.hodlInput.daysToLock * 86400) // TESTING!
      var secondsToLock = (this.hodlInput.daysToLock * 60) // TESTING!
      var unlockTime = (Date.now() / 1000 | 0) + secondsToLock
      this.hodlData.unlockTime = unlockTime
      this.unlockTimeDate = (
        this.dateFormat(unlockTime) + " (in " +
        //this.hodlInput.daysToLock + " days)" // TESTING!
        this.hodlInput.daysToLock + " minutes)" // TESTING!
      )
    },

    // hodl script creation
    hodlCreate () {
      var vm = this

      // update unlock time to now
      vm.updateUnlockTime()

      // flush data regarding responsive stuff
      vm.hodlData["scriptAddress"] = ''
      vm.hodlData["redeemScript"] = ''
      vm.hodlInput.daysToLock = ''
      vm.rawtx = ''
      vm.lastTxId = ''

      // gui related
      vm.scriptAddress = "Loading..."
      vm.redeemScript = ""

      // get redeem script
      var writer = new bitcore.encoding.BufferWriter()
      var redeemScript = new bitcore.Script()
        .add(writer.writeUInt32LE(vm.hodlData.unlockTime).bufs[0])
        .add('OP_NOP2')
        .add('OP_DROP')
        .add(new Buffer(vm.hodlData.publicKey, 'hex'))
        .add('OP_CHECKSIG')
        .toHex()

      // get address from redeem script
      var scriptBuffer = new bitcore.Script(redeemScript).toBuffer()
      var scriptSha256 = bitcore.crypto.Hash.sha256(scriptBuffer)
      var scriptSha256ripemd160 = bitcore.crypto.Hash.ripemd160(scriptSha256)
      var scriptAddress = bitcore.Address.fromScriptHash(scriptSha256ripemd160)

      // update hodl data object
      vm.hodlData["redeemScript"] = redeemScript.toString()
      vm.hodlData["scriptAddress"] = vm.scriptAddress = scriptAddress.toString()
    },

    // get utxos and call build transaction function
    getTx () {
      console.log('getting utxos...')
      var vm = this
      // construct call url
      var url = (
        vm.explorer +
        "insight-api-komodo/addr/" +
        vm.hodlData.address +
        "/utxo"
      )
      // make call to api
      axios
        .get(url)
        .then(response => {
          var utxos = response.data
          vm.hodlData.myUtxos = utxos
          var rawtx = vm.buildTx(utxos)
          vm.rawtx = rawtx
          console.log('raw transaction stored')
        })
        .catch(e => {
          console.log(e)
        });
    },

    // build the funding transaction
    buildTx (utxos) {
      console.log('building transaction...')
      var vm = this

      // prepare variables to build our transaction
      var toAddress = vm.hodlData.scriptAddress
      var myAddress = vm.hodlData.address
      var amount = Math.round(vm.hodlInput["amount"] * vm.satoshiNb)
      var op_return = "REDEEM SCRIPT " + vm.hodlData.redeemScript
      var privateKey = vm.hodlData.privateKey

      // https://bitcore.io/api/lib/transaction#serialization-checks
      var opts = {
        disableDustOutputs: true
      }

      // use bitcore to build the transaction
      var transaction = new bitcore.Transaction()
        .from(utxos)
        .to(toAddress, amount)
        .change(myAddress)
        .addData(op_return)
        .sign(privateKey)
      var rawtx = transaction.serialize(opts)

      // gui related
      vm.expectedReward = vm.calculatedReward
      vm.hodlInput["amount"] = ''
      vm.lastTxId = ''

      return rawtx
    },

    // submit transaction for validation and broadcasting
    submitTx () {
      console.log('broadcasting transaction...')
      var vm = this
      var url = vm.explorer + "hodl-api/submit-tx/"
      var rawtx = vm.rawtx
      vm.rawtx = ''
      axios
        .post(url, {'rawtx': rawtx})
        .then(response => {
          console.log(response.data)
          if (!response.data.error) {
            vm.lastTxId = response.data.txid
            console.log("transaction submitted")
          } else {
            throw response.data.error
          }
        })
        .catch(e => {
          console.log(e)
        });
    },

    // store hodl related data
    fillHodlData () {
      var dict = {};

      var privateKey = new bitcore.PrivateKey(
        this.wallet.privKey.toString('hex')
      );
      dict["privateKey"] = privateKey.toString();

      var publicKey = new bitcore.PublicKey(privateKey);
      dict["publicKey"] = publicKey.toString();

      var address = publicKey.toAddress();
      dict["address"] = address.toString();

      return dict;
    },

    // convert unix time to human readable time
    dateFormat (time) {
      const blockchainDateUtc = moment.utc(time * 1000);
      const dateString = (
        moment(blockchainDateUtc)
        .local()
        .format('hh:mm A MM/DD/YYYY')
      )
      return dateString;
    }
  },

  computed: {
    // get bitcoinjs-lib wallet data
    wallet () {
      return this.$store.getters.getWalletByTicker(this.selectedCoin);
    },

    // get explorer url
    explorer () {
      return this.wallet.coin.explorer
    },

    calculatedReward () {
      return this.hodlInput.amount * 0.0083
    },
  }
}

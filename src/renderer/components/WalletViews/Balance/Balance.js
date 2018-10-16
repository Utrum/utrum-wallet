/** ***************************************************************************
 * Copyright © 2018 Utrum Foundation                                          *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Utrum Foundation software, including this file may be copied,              *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/
import bitcoinjs from 'bitcoinjs-lib';
import Select2 from '@/components/Utils/Select2/Select2.vue';
import SelectAwesome from '@/components/Utils/SelectAwesome/SelectAwesome.vue';
import { BigNumber } from 'bignumber.js';
import store from '../../../store';
import ElectrumService from '../../../lib/electrum';
import bitcore from 'bitcore-lib';
import axios from 'axios';
import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';
var kmdfee = 10000,
    refreshRewardData = null
export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
    select2: Select2,
    'select-awesome': SelectAwesome,
  },
  mounted() {
    this.claimData = this.fillClaimData()
    this.getUtxos()
    Object.keys(this.wallets).forEach((ticker) => {
      this.$store
        .dispatch('updateBalance', this.wallets[ticker])
        .catch(() => { })
      ;
    }, this);
      if (!refreshRewardData) {
        refreshRewardData = setInterval(()=>{
          this.getRewardData();
        }, 15000);
    }
      else {
          clearInterval(refreshRewardData);
          refreshRewardData = null;
          refreshRewardData = setInterval(()=>{
          this.getRewardData();
        }, 15000);
      }
    this.getRewardData();
  },
  data() {
    return {
    claimData: {
        height: '',
        scriptAddress: '',
        redeemScript: '',
        amount: 0,
        myUtxos: []
      },
      explorer: 'https://kmdexplorer.io/',
      satoshiNb: 100000000,
      satoshiConvert: 0.00000001,
      kmdfee: 10000,
      displayInterest: true,
      rewards: 0,
      rewarding: 0,
      unixtime: Math.round(new Date().getTime()/1000),
      blocks: 1,
      estimatedFee: 0,
      feeSpeed: 'fast',
      fees: [
        { id: 0, label: 'Very fast', speed: 'fast', value: 'veryFast' },
        { id: 1, label: 'Fast', speed: 'medium', value: 'fast' },
        { id: 2, label: 'Low', speed: 'slow', value: 'low' },
      ],
      withdraw: {
        amount: null,
        address: '',
        coin: 'KMD',
      },
      table: [],
    };
  },
  methods: {
    getRewardData(){
      var getJSON = (function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
  
        xhr.onload = function() {
          var status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
      });
      var address = this.$store.getters.getWalletByTicker('KMD').address;
      var url = "https://dexstats.info/api/rewards.php?address=" + address;
      var sats = this.satoshiNb
      getJSON(url, (err, data) => {
        if (err !== null) {
          console.log('Something went wrong: ' + err);
        } else {
          this.rewards = data.rewards;
          this.rewarding = Math.floor(data.rewards * 100000000)
            //console.log('getRewardData function rewards in sats: ', this.rewarding)
        }
      });
    },
    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    satoshiToBitcoin(amount) {
      const satoshiNb = 100000000;
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },
    onConfirmWithdrawModal() {
        return this.buildTx();
    },
    hideModal() {
      this.$refs.confirmWithdraw.hide();
    },
    getUtxos () {
      var vm = this
      var addr = this.$store.getters.getWalletByTicker('KMD').address
      var url = vm.explorer + "insight-api-komodo/addr/" + addr + "/utxo"
      //console.log(url)
      axios
        .get(url)
        .then(response => {
          vm.claimData.myUtxos = response.data
          //console.log(vm.claimData.myUtxos)
        })
        .catch(e => {
          console.log(e)
        });
    },
    buildTx () { // To Do: Call for most up to date reward at build
      //console.log('building transaction...')
      var vm = this
      var timelock = vm.unixtime - 777
      var utxos = vm.claimData.myUtxos
      var toAddress = vm.claimData.address
      var inputamount = this.$store.getters.getBalanceByTicker('KMD') * this.satoshiNb
      var rewardtotal = vm.rewarding
      var amount = (inputamount + rewardtotal)
      var privateKey = vm.claimData.privateKey
      var transaction = new bitcore.Transaction()
        .from(utxos)
        .to(toAddress, amount)
        .lockUntilDate(timelock)
        .change(toAddress)
      transaction.inputs[0].sequenceNumber = 0
      transaction.sign(privateKey)
        //console.log(transaction)
        return transaction;
    },
    broadcastTx () {
        wallet.electrum = new ElectrumService(store, 'KMD', { client: 'Monaize ICO Wallet 0.1', version: '1.2' });
        this.hideModal();
        var transaction = this.buildTx();
        var opts = {
            disableMoreOutputThanInput: true
        }
        //console.log('buildTx Serialized')
        //console.log(transaction.serialize(opts))
        // Now broadcast:
        return wallet.electrum.broadcast(transaction.serialize(opts)) // Uncomment for LIVE TX Broadcasting on Confirm
    },
    fillClaimData () {
      var dict = {};
      var satoshis = this.$store.getters.getBalanceByTicker('KMD') * this.satoshiNb
      dict["satoshis"] = satoshis;
      var privateKey = new bitcore.PrivateKey(this.walletkmd.privKey.toString('hex'));
      dict["privateKey"] = privateKey.toString();
      var address = this.$store.getters.getWalletByTicker('KMD').address
      dict["address"] = address.toString();
      return dict;
    },
    claimRewards() {
      const kmdwallet = this.wallets.KMD;
      if (this.displayInterest && this.rewards != 0) {
          return this.broadcastTx()
      }
    },
  },
  computed: {
    walletkmd () {
      return this.$store.getters.getWalletByTicker('KMD');
    },
    wallets() {
      return this.$store.getters.getWallets;
    },
    totalBalance() {
      return this.numberWithSpaces(this.$store.getters.getTotalBalance.toFixed(2));
    },
  },
};

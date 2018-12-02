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
import { BigNumber } from 'bignumber.js';
import store from '../../../store';
import ElectrumService from '../../../lib/electrum';
import bitcore from 'bitcore-lib';
import axios from 'axios';
import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';


export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
    select2: Select2,
    'select-awesome': SelectAwesome,
  },

  mounted() {
    this.getUtxos()
    Object.keys(this.wallets).forEach((ticker) => {
      this.$store
        .dispatch('updateBalance', this.wallets[ticker])
        .catch(() => { })
      ;
    }, this);

    if (!this.refreshRewardData) {
      this.refreshRewardData = setInterval(()=>{
        this.getRewardData();
      }, 120000);
    }
    else {
      clearInterval(this.refreshRewardData);
      this.refreshRewardData = null;
      this.refreshRewardData = setInterval(()=>{
        this.getRewardData();
      }, 120000);
    }
    this.getRewardData();
  },

  beforeDestroy() {
    clearInterval(this.refreshRewardData);
  },

  data() {
    return {
      kmdUtxos: [],
      satoshiNb: 100000000,
      kmdFee: 10000,
      displayKmdRewards: true,
      rewardsData: {},
      refreshRewardData: null,
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
      var url = (
        "https://explorer.utrum.io/" +
        "kmd-rewards/rewards.php?address=" + this.myKmdAddress
      )
      getJSON(url, (err, data) => {
        if (err !== null) {
          console.log('Something went wrong: ' + err);
        } else {
          this.rewardsData = data;
        }
      });
    },

    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
      var explorer = this.$store.getters.getWalletByTicker('KMD').coin.explorer
      var url = explorer + "/insight-api-komodo/addr/" + addr + "/utxo"
      console.log(url)
      axios
        .get(url)
        .then(response => {
          vm.kmdUtxos = response.data
          console.log(vm.kmdUtxos)
        })
        .catch(e => {
          console.log(e)
        });
    },

    buildTx () { // To Do: Call for most up to date reward at build
      console.log('building transaction...')
      var vm = this
      var locktime = Math.round(new Date().getTime()/1000) - 777
      var utxos = vm.kmdUtxos
      var toAddress = vm.myKmdAddress
      var inputamount = this.$store.getters.getBalanceByTicker('KMD') * this.satoshiNb
      var amount = (inputamount - vm.kmdFee)
      var privateKey = this.$store.getters.getWalletByTicker('KMD').privKey
      var transaction = new bitcore.Transaction()
        .fee(vm.kmdFee)
        .from(utxos)
        .to(toAddress, amount)
        .lockUntilDate(locktime)
        .change(toAddress)
      transaction.inputs[0].sequenceNumber = 0
      transaction.sign(privateKey)
      console.log(transaction)
      return transaction;
    },

    broadcastTx () {
      wallet.electrum = new ElectrumService(
        store, 'KMD', { client: 'Utrum Wallet', version: '1.2' }
      );
      this.hideModal();
      var transaction = this.buildTx();
      var opts = { disableMoreOutputThanInput: true }
      console.log('buildTx Serialized')
      console.log(transaction.serialize(opts))
      // Now broadcast:
      //return wallet.electrum.broadcast(transaction.serialize(opts)) // TESTING!
    },

    claimRewards() {
      if (this.displayKmdRewards && this.rewards != 0) {
        return this.broadcastTx()
      }
    },
  },

  computed: {

    myKmdAddress () {
      return this.$store.getters.getWalletByTicker('KMD').address.toString();
    },

    wallets() {
      return this.$store.getters.getWallets;
    },

    totalBalance() {
      return this.numberWithSpaces(
        this.$store.getters.getTotalBalance.toFixed(2)
      );
    },
  },
};

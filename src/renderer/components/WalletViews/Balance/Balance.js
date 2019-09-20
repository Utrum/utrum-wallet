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
import { BigNumber } from 'bignumber.js';
import store from '../../../store';
import axios from 'axios';
import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';


export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
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
      kmdFee: 20000,
      displayKmdRewards: true,
      rewardsData: {},
      refreshRewardData: null,
    };
  },
  methods: {

    getRewardData(){
      var getJSON = (function(url, callback) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'json'
        xhr.onload = function() {
          var status = xhr.status
          if (status === 200) {
            callback(null, xhr.response)
          } else {
            callback(status, xhr.response)
          }
        }
        xhr.send()
      })
      var url = (
        "https://explorer.utrum.io/" +
        "kmd-rewards/rewards.php?address=" +
        this.kmdWallet.address.toString()
      )
      getJSON(url, (err, data) => {
        if (err !== null) {
          console.log('Something went wrong: ' + err)
        } else {
          this.rewardsData = data
          return data
        }
      });
    },

    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    hideModal() {
      this.$refs.confirmWithdraw.hide();
    },

    getUtxos () {
      var vm = this
      var addr = this.$store.getters.getWalletByTicker('KMD').address
      var explorer = this.$store.getters.getWalletByTicker('KMD').coin.explorer
      var url = explorer + "/insight-api-komodo/addr/" + addr + "/utxo"
      console.log("getting utxos...")
      axios
        .get(url)
        .then(response => {
          vm.kmdUtxos = response.data
        })
        .catch(e => {
          console.log(e)
        });
    },

    claimRewards () {
      var vm = this
      vm.hideModal();
      console.log("claiming rewards...")

      // prepare transaction
      let address = vm.kmdWallet.address.toString()
      let value = Math.round(vm.rewardsData.totalBalance)

      let inputs = []
      for (let i in vm.kmdUtxos) {
        let utxo = vm.kmdUtxos[i]
        inputs.push({
          "txId": utxo.txid,
          "value": utxo.satoshis,
          "vout": utxo.vout
        })
      }

      return vm.$store.dispatch('broadcastTransaction', {
        wallet: vm.kmdWallet,
        inputs: inputs,
        outputs: [{"address": address, "value": value}],
        fee: vm.kmdFee,
      })
        .then(() => {
          console.log("updating reward data...")
          setTimeout(function(){
            vm.getRewardData();
            vm.$toasted.show("Rewards claimed! " +
              "Waiting for confirmations.")
          }, 1000)
        })
    },
  },

  computed: {

    kmdWallet () {
      return this.$store.getters.getWalletByTicker('KMD')
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

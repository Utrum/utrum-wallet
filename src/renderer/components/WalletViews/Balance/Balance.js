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

import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';

export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
  },
  data() {
    return {
      satoshiNb: 100000000,
      satoshiConvert: 0.00000001,
      displayInterest: false,
      rewards: 0,
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
  mounted() {
    Object.keys(this.wallets).forEach((ticker) => {
      this.$store
        .dispatch('updateBalance', this.wallets[ticker])
        .catch(() => { })
      ;
    }, this);
    var getJSON = function(url, callback) {
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
    };
    var context = this;
    var address = this.$store.getters.getWalletByTicker('KMD').address;
    var url = "https://dexstats.info/api/rewards.php?address=" + address;
    var utxos = getJSON(url, function(err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        context.rewards = data.rewards;
      }
    });
  },
  methods: {
    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    satoshiToBitcoin(amount) {
      const satoshiNb = 100000000;
      return BigNumber(amount).dividedBy(satoshiNb).toNumber();
    },
    prepareTx() {
      wallet.electrum = new ElectrumService(store, 'KMD', { client: 'Monaize ICO Wallet 0.1', version: '1.2' });
      const amountpromise = wallet.electrum.getBalance(this.$store.getters.getWalletByTicker('KMD').address);
      const t = this;
      return amountpromise.then(function(confirmed) {
        const amount = confirmed.confirmed;
        t.withdraw.amount = amount;

        const object = {
          wallet: t.wallets.KMD,
          address: t.$store.getters.getWalletByTicker('KMD').address,
          amount,
          speed: 'Fast',
        };

        return t.$store.dispatch('createTransaction', object)
          .then((tx) => {
            if (tx != null &&
              tx.outputs != null &&
              tx.inputs != null) {
              t.estimatedFee = BigNumber(tx.fee);
            } else if (tx != null && tx.feeRate != null) {
              t.estimatedFee = BigNumber(tx.feeRate);
            }
            return tx;
          });
      });
    },
    claimRewards() {
      const kmdwallet = this.wallets.KMD;
      if (this.displayInterest && this.rewards != 0) {
        return this.prepareTx()
          .then(tx => {
            if (tx != null && tx.feeRate != null) {
              return Promise.reject({ message: 'Not enough balance including fees.' });
            }
            return this.$store.dispatch('broadcastTransaction', { wallet: kmdwallet, ...tx });
          })
          .then((response) => {
            this.withdraw.amount = null;
            this.withdraw.address = '';
          })
          .catch(error => {
            if (error.__type !== null && BigNumber(this.withdraw.amount).comparedTo(21000000) === 1) {
              this.$toasted.info("You can't send more than 21 million at once");
            } else {
              this.$toasted.error(`Can't send transaction: ${error.message}`);
            }
          });
      }
    },
  },
  computed: {
    wallets() {
      return this.$store.getters.getWallets;
    },
    totalBalance() {
      return this.numberWithSpaces(this.$store.getters.getTotalBalance.toFixed(2));
    },
  },
};

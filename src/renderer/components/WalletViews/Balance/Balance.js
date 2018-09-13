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
import BalanceItem from '@/components/WalletViews/BalanceItem/BalanceItem.vue';
import store from '../../../store';
import ElectrumService from '../../../lib/electrum';
import { BigNumber } from 'bignumber.js';
import komodoInterest from './komodo-interest.js';

export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
  },
  data() {
    return {
      satoshiNb: 100000000,
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
    var self = this;
    wallet.electrum = new ElectrumService(store, 'KMD', { client: 'Monaize ICO Wallet 0.1', version: '1.2' });
    wallet.electrum.listUnspent(this.$store.getters.getWalletByTicker('KMD').address)
      .then((_utxos) => {
        _utxos.forEach(utxo => {
          var explorerurl = 'https://kmdexplorer.ru/insight-api-komodo/tx/' + utxo.tx_hash;
          var tarr = getJSON(explorerurl, function(err, data) {
            if (err !== null) {
              console.log('Something went wrong: ' + err);
            } else {
              const d = {
                locktime: data.locktime,
                address: data.vin[0].addr
              }
              let interest = komodoInterest(d.locktime,utxo.value,utxo.height);
              const row = {
                address: d.address,
                amount: utxo.value,
                interest: interest
              }
              self.table.push(row);
            }
          });
        })
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
      // if (this.canWithdraw === true && this.addressIsValid === true) {
      const kmdwallet = this.wallets.KMD;
      this.calcInterest();
      if (true) {
        return this.prepareTx()
          .then(tx => {
            if (tx != null && tx.feeRate != null) {
              return Promise.reject({ message: 'Not enough balance including fees.' });
            }
            return 0;
            // return this.$store.dispatch('broadcastTransaction', { wallet: kmdwallet, ...tx });
          })
          .then((response) => {
            this.withdraw.amount = null;
            this.withdraw.address = '';
            alert(this, response);
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

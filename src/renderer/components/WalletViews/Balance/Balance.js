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
import store from '../../../store';
import ElectrumService from '../../../lib/electrum';

export default {
  name: 'balance',
  components: {
    'balance-item': BalanceItem,
  },
  mounted() {
    Object.keys(this.wallets).forEach((ticker) => {
      this.$store
        .dispatch('updateBalance', this.wallets[ticker])
        .catch(() => { })
      ;
    }, this);
  },
  methods: {
    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    claimRewards() {
      wallet.electrum = new ElectrumService(store, 'KMD', { client: 'Monaize ICO Wallet 0.1', version: '1.2' });
      const amount = wallet.electrum.getBalance(this.$store.getters.getWalletByTicker('KMD').address);

      const object = {
        wallet: this.wallet,
        address: this.$store.getters.getWalletByTicker('KMD').address,
        amount,
        speed: this.speed,
      };

      console.log(object);
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

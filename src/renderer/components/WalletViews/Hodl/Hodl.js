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

const { clipboard } = require('electron');

export default {
  name: 'hodl',
  components: {
    select2: Select2,
    'select-awesome': SelectAwesome
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.select = this.$store.getters.getTickerForExpectedCoin('OOT');
  },
  data() {
    return {
      hodl: {
        address: '',
        amount: '',
        block: '',
      }
    }
  },
  methods: {
  },
  computed: {
  },
}

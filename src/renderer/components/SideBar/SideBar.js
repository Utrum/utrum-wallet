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

import { mapGetters } from 'vuex';

export default {
  name: 'sidebar',
  data() {
    return {
      balanceState: true,
      hodlState: false,
      withdrawalState: false,
      socialState: false,
      chartState: false,
    };
  },
  methods: {
    balanceClicked() {
      this.balanceState = true;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = false;
    },
    hodlClicked() {
      this.balanceState = false;
      this.hodlState = true;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = false;
    },
    withdrawalClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = true;
      this.socialState = false;
      this.chartState = false;
    },
    socialClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = true;
      this.chartState = false;
    },
    chartClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = true;
    },
  },
  computed: {
    ...mapGetters(['icoIsRunning', 'hasPlannedIco']),
  },
};

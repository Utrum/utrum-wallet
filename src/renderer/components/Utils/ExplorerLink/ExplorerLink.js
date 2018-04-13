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

const electron = require('electron');

export default {
  name: 'explorer',
  props: ['ticker', 'type', 'value'],
  data() {
    return {
      explorers: {
        MNZ: 'https://www.mnzexplorer.com',
        BTC: 'https://blockchain.info',
        KMD: 'https://kmd.explorer.supernet.org',
      },
    };
  },
  methods: {
    openLink: (event) => {
      event.preventDefault();
      const link = event.target.href;
      electron.shell.openExternal(link);
    },
  },
  computed: {
    href() {
      return `${this.explorers[this.ticker]}/${this.type}/${this.value}`;
    },
    tooltipTitle() {
      return `Click to see ${this.type} in explorer`;
    },
  },
};

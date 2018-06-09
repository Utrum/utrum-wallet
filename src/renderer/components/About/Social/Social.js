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
  name: 'social',
  data() {
    return {
      mnzTelegramUrl: 'https://t.me/MonaizeOfficial',
      mnzSlackUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScre9X8loy1Q5zhelpqVfCib65m4PKc2kWUKKYgDIE67Mx9Pg/viewform',
    };
  },
  mounted() {
  },
  methods: {
    openMnzTelegram() {
      electron.shell.openExternal(this.mnzTelegramUrl);
    },
    openMnzSlack() {
      electron.shell.openExternal(this.mnzSlackUrl);
    },
  },
  computed: {
  },
};

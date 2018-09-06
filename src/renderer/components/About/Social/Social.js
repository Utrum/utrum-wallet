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
      mnzTelegramUrl: 'https://t.me/utrumdotio',
      mnzDiscordUrl: 'https://discord.gg/tyf8Mqx',
<<<<<<< HEAD
=======
      ootTwitterUrl: 'https://twitter.com/utrumdotio',
      ootFacebookUrl: 'https://www.facebook.com/utrumdotio',
      ootRedditUrl: 'https://www.reddit.com/r/Utrumdotio/',
>>>>>>> 4fcd8d9... added reddit and facebook buttons
    };
  },
  mounted() {
  },
  methods: {
    openMnzTelegram() {
      electron.shell.openExternal(this.mnzTelegramUrl);
    },
    openMnzDiscord() {
      electron.shell.openExternal(this.mnzDiscordUrl);
    },
<<<<<<< HEAD
=======
    openOOTTwitter() {
      electron.shell.openExternal(this.ootTwitterUrl);
    },
    openOOTFacebook() {
      electron.shell.openExternal(this.ootFacebookUrl);
    },
    openOOTReddit() {
      electron.shell.openExternal(this.ootRedditUrl);
    },
>>>>>>> 4fcd8d9... added reddit and facebook buttons
  },
  computed: {
  },
};

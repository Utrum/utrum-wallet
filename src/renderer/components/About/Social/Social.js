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
      ootTwitterUrl: 'https://twitter.com/utrumdotio',
      ootFacebookUrl: 'https://www.facebook.com/utrumdotio',
      ootRedditUrl: 'https://www.reddit.com/r/Utrumdotio/',
      ootTwitterURl: 'https://twitter.com/utrumdotio',
      ootBlogURl: 'https://medium.com/utrum',
      ootGithub: 'https://github.com/utrum'
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
    openOOTTwitter() {
      electron.shell.openExternal(this.ootTwitterUrl);
    },
    openOOTFacebook() {
      electron.shell.openExternal(this.ootFacebookUrl);
    },
    openOOTReddit() {
      electron.shell.openExternal(this.ootRedditUrl);
    },
    openOOTTwitter() {
      electron.shell.openExternal(this.ootTwitterURl);
    },
    openOOTGithub() {
      electron.shell.openExternal(this.ootGithub);
    },
    openOOTBlog(link){
      electron.shell.openExternal(this.ootBlogURl);
    },
    openLink(link){
      electron.shell.openExternal(link);
    }
  },
  computed: {
  },
};

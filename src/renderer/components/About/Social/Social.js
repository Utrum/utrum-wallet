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
const electron = {} // require('electron');

export default {
  name: 'social',
  data() {
    return {
      utrumTelegramUrl: 'https://t.me/utrumdotio',
      utrumDiscordUrl: 'https://discord.gg/tyf8Mqx',
      utrumTwitterUrl: 'https://twitter.com/utrumdotio',
      utrumFacebookUrl: 'https://www.facebook.com/utrumdotio',
      utrumRedditUrl: 'https://www.reddit.com/r/Utrumdotio/',
      utrumTwitterURl: 'https://twitter.com/utrumdotio',
      utrumBlogURl: 'https://medium.com/utrum',
      utrumGithub: 'https://github.com/utrum'
    };
  },
  mounted() {
  },
  methods: {
    openUtrumTelegram() {
      electron.shell.openExternal(this.utrumTelegramUrl);
    },
    openUtrumDiscord() {
      electron.shell.openExternal(this.utrumDiscordUrl);
    },
    openUtrumTwitter() {
      electron.shell.openExternal(this.utrumTwitterUrl);
    },
    openUtrumFacebook() {
      electron.shell.openExternal(this.utrumFacebookUrl);
    },
    openUtrumReddit() {
      electron.shell.openExternal(this.utrumRedditUrl);
    },
    openUtrumTwitter() {
      electron.shell.openExternal(this.utrumTwitterURl);
    },
    openUtrumGithub() {
      electron.shell.openExternal(this.utrumGithub);
    },
    openUtrumBlog(link){
      electron.shell.openExternal(this.utrumBlogURl);
    },
    openLink(link){
      electron.shell.openExternal(link);
    }
  },
  computed: {
  },
};

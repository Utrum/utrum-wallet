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

import LoginForm from '@/components/LoginForm/LoginForm.vue';
import moment from 'moment';

const { ipcRenderer } = require('electron');

export default {
  components: {
    'login-form': LoginForm,
  },
  name: 'vue-dico',
  mounted() {
    ipcRenderer.on('aboutView', () => {
      this.$router.replace({ path: 'about', meta: this.$route.path });
    });
  },
  created() {
  },
  data() {
    return {

    };
  },
  computed: {
    hasPlannedIco() {
      return this.$store.getters.hasPlannedIco;
    },
    icoBannerActive() {
      if (((!this.icoIsRunning && !this.icoWillBegin) || this.icoWillBegin) && this.hasPlannedIco) {
        return 'bannerMargin';
      }
    },
    userLoggedIn() {
      return this.$store.state.User.loggedIn;
    },
    icoStartDate() {
      const startDate = this.$store.getters.icoStartDate;
      if (startDate == null) {
        return null;
      }
      moment.locale('en_us');
      return moment.unix(startDate).toNow(true);
    },
    icoIsRunning() {
      return this.$store.getters.icoIsRunning;
    },
    icoWillBegin() {
      return this.$store.getters.icoWillBegin;
    },
  },
};

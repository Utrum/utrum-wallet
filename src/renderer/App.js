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
import VersionUpdate from '@/components/VersionUpdate/VersionUpdate.vue';
import moment from 'moment';

const pjson = require('../../package.json');
const { ipcRenderer } = require('electron');

export default {
  components: {
    'login-form': LoginForm,
    'version-update': VersionUpdate,
  },
  name: 'vue-dico',
  mounted() {
    ipcRenderer.on('aboutView', () => {
      // console.log(this.$route.path);
      this.$router.replace({ path: 'about', meta: this.$route.path });
    });
  },
  created() {
    this.$store.dispatch('startUpdateConfig');
  },
  data() {
    return {

    };
  },
  computed: {
    hasPlannedIco() {
      if (this.$store.getters.getConfig == null ||
        (this.$store.getters.getConfig.icoEndDate == null &&
          this.$store.getters.getConfig.icoStartDate == null)) {
        return false;
      }
      return true;
    },
    icoBannerActive() {
      if (((!this.icoIsRunning && !this.icoWillBegin) || this.icoWillBegin) && this.hasPlannedIco) {
        return 'bannerMargin';
      }
    },
    isClientUpdated() {
      if (this.$store.getters.getConfig != null && this.$store.getters.getConfig.client != null) {
        return this.$store.getters.getConfig.client.version === Number(pjson.version.split('.')[0]);
      }
      return true;
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

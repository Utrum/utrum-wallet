import LoginForm from '@/components/LoginForm/LoginForm.vue';
import VersionUpdate from '@/components/VersionUpdate/VersionUpdate.vue';
import moment from 'moment';

const pjson = require('../../package.json');

export default {
  components: {
    'login-form': LoginForm,
    'version-update': VersionUpdate,
  },
  name: 'vue-dico',
  created() {
    this.$store.dispatch('updateConfig', {});
    this.$store.dispatch('startUpdateConfig');
  },
  data() {
    return {

    };
  },
  computed: {
    isClientUpdated() {
      if (this.$store.getters.getConfig.client != null) {
        const version = this.$store.getters.getConfig.client.version === Number(pjson.version.split('.')[0]);
        return version;
      }
      return false;
    },
    userLoggedIn() {
      return this.$store.state.User.loggedIn;
    },
    icoStartDate() {
      const startDate = this.$store.getters.icoStartDate;
      moment.locale('en_us');
      return moment.unix(startDate).toNow(true);
    },
    icoIsOver() {
      return this.$store.getters.icoIsOver && !this.icoWillBegin;
    },
    icoWillBegin() {
      return this.$store.getters.icoWillBegin;
    },
  },
};

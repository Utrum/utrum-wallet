import LoginForm from '@/components/LoginForm/LoginForm.vue';
import moment from 'moment';

export default {
  components: {
    'login-form': LoginForm,
  },
  name: 'vue-dico',
  created() {
    this.$store.dispatch('updateConfig', {});
  },
  data() {
    return {

    };
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.User.loggedIn;
    },
    icoStartDate() {
      const startDate = this.$store.getters.icoStartDate;
      moment.locale('en_us');
      return moment.unix(startDate).toNow(true);
    },
    icoIsOver() {
      return this.$store.getters.icoIsOver;
    },
    icoWillBegin() {
      return this.$store.getters.icoWillBegin;
    }
  },
};

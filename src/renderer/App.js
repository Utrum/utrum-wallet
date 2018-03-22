import LoginForm from '@/components/LoginForm/LoginForm.vue';

export default {
  components: {
    'login-form': LoginForm,
  },
  name: 'vue-dico',
  data() {
    return {

    };
  },
  created() {
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.User.loggedIn;
    },
  },
};

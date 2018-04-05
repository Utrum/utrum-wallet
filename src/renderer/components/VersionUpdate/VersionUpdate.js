import electron from 'electron';

export default {
  name: 'version-update',
  data() {
    return {
    };
  },
  components: {
  },
  methods: {
    openLink: (event) => {
      event.preventDefault();
      const link = event.target.href;
      electron.shell.openExternal(link);
    },
  },
  computed: {
  },
};

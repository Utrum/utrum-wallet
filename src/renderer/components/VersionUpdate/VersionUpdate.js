const { shell } = require('electron');

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
      shell.openExternal(link);
    },
  },
  computed: {
  },
};

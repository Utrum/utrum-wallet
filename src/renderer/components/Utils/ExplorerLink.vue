<template>
  <a class="btn btn-copy-link btn-smartaddress" target="_blank" @click.prevent="openLink" :href="href">{{value}}</a class="btn btn-copy-link btn-smartaddress">
</template>

<script>
export default {
  name: 'explorer',
  props: ['ticker', 'type', 'value'],
  data () {
    return {
      explorers: {
        MNZ: 'https://www.mnzexplorer.com',
        BTC: 'https://blockchain.info',
        KMD: 'https://kmd.explorer.supernet.org',
      }
    }
  },
  methods: {
    openLink: function(event) {
      console.log(event)
      event.preventDefault();
      let link = event.target.href;
      require("electron").shell.openExternal(link);
    }
  },
  computed: {
    href() {
      return `${this.explorers[this.ticker]}/${this.type}/${this.value}`
    }
  }
}
</script>

<style>

</style>

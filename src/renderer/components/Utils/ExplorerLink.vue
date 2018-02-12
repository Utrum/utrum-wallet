<template>
  <a class="btn btn-copy-link btn-smartaddress" target="_blank" @click.prevent="openLink" :href="href">{{value***REMOVED******REMOVED***</a class="btn btn-copy-link btn-smartaddress">
</template>

<script>
***REMOVED***
  name: 'explorer',
  props: ['ticker', 'type', 'value'],
  data () {
    return {
      explorers: {
        MNZ: 'https://www.mnzexplorer.com',
        BTC: 'https://blockchain.info',
        KMD: 'https://kmd.explorer.supernet.org',
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***,
  methods: {
    openLink: function(event) {
      console.log(event)
      event.preventDefault();
      let link = event.target.href;
      require("electron").shell.openExternal(link);
    ***REMOVED***
  ***REMOVED***,
  computed: {
    href() {
      return `${this.explorers[this.ticker]***REMOVED***/${this.type***REMOVED***/${this.value***REMOVED***`
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

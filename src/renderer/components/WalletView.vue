<template>
  <div id="wallet-view">
    <h1>Welcome in the Monaize Wallet :-)</h1>
    <balance></balance>
  </div>
</template>

<script>

***REMOVED***
  name: 'wallet-view',
  components: {
    'balance': require('@/components/WalletViews/Balance').default
  ***REMOVED***,
  mounted() {
    this.init()
  ***REMOVED***,
  methods: {
    init() {
      this.$store.dispatch('initWallets', this.$store.getters.passphrase)
    ***REMOVED***
  ***REMOVED***,
***REMOVED***
</script>

<style>

</style>

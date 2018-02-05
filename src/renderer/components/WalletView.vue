<template>
  <div id="wallet-view">
    <h1>Welcome in the Monaize Wallet :-)</h1>
    <ul>
      <router-link tag="li" to="balance">[balance]</router-link>
      <router-link tag="li" to="buy">[buy]</router-link>
      <router-link tag="li" to="withdraw">[withdraw]</router-link>

    </ul>
    <router-view></router-view>
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
li {
  display: inline;
***REMOVED***
</style>

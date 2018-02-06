<template>
  <div id="balance-view">
    <ul>
      <li v-for="wallet in wallets" v-bind:key="wallet.addres">[{{wallet.ticker***REMOVED******REMOVED***] -> {{wallet.address***REMOVED******REMOVED***</li>
    </ul>
  </div>
</template>

<script>
***REMOVED***
  name: 'balance',
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

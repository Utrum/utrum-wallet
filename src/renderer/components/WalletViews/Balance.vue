<template>
  <div id="balance-view">
    <div v-for=“wallet in wallets” v-bind:key=“wallet.ticker”>
      <balance-item :wallet=“wallet”/>
    </div>
  </div>
</template>

<script>
***REMOVED***
  name: 'balance',
  components: {
    'balance-item': require('@/components/WalletViews/BalanceItem').default
  ***REMOVED***,
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

<template>
  <div id="balance-view">
    <div v-for="wallet in wallets" v-bind:key="wallet.ticker">
      <balance-item :wallet="wallet"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'balance',
  components: {
    'balance-item': require('@/components/WalletViews/BalanceItem').default
  },
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    }
  }
}
</script>

<style>

</style>

<template>
  <div id="balance-view">
    <ul>
      <li v-for="wallet in wallets" v-bind:key="wallet.addres">[{{wallet.ticker}}] -> {{wallet.address}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'balance',
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    }
  }
}
</script>

<style>

</style>

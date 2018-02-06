<template>
  <div id="wallet-view">
    <h1>Welcome in the Monaize Wallet :-)</h1>
    <balance></balance>
  </div>
</template>

<script>

export default {
  name: 'wallet-view',
  components: {
    'balance': require('@/components/WalletViews/Balance').default
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('initWallets', this.$store.getters.passphrase)
    }
  },
}
</script>

<style>

</style>

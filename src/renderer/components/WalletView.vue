<template>
  <div id="wallet-view">
    <h1>Welcome in the Monaize Wallet :-)</h1>
    <ul>
      <router-link tag="button" class="btn btn-primary" to="balance">[balance]</router-link>
      <router-link tag="button" class="btn btn-primary" to="buy">[buy]</router-link>
      <router-link tag="button" class="btn btn-primary" to="withdraw">[withdraw]</router-link>
    </ul>
    <router-view></router-view>
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
li {
  display: inline;
}
</style>

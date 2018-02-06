<template>
  <div id="wallet-view">
    <sidebar></sidebar>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'wallet-view',
  components: {
    'balance': require('@/components/WalletViews/Balance').default,
    'sidebar': require('@/components/SideBar').default
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

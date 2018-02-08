<template>
  <div id="wallet-view">
    <sidebar></sidebar>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

***REMOVED***
  name: 'wallet-view',
  components: {
    'balance': require('@/components/WalletViews/Balance').default,
    'sidebar': require('@/components/SideBar').default
  ***REMOVED***,
  created() {
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

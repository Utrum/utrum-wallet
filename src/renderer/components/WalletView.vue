<template>
  <div id="wallet">
    <sidebar></sidebar>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

***REMOVED***
  name: 'wallet',
  components: {
    'sidebar': require('@/components/SideBar').default
  ***REMOVED***,
  created() {
    this.$store.dispatch('initWallets', this.$store.getters.passphrase)
    this.$router.push('balance')
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

<template>
  <div id="wallet">
    <sidebar></sidebar>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'wallet',
  components: {
    'sidebar': require('@/components/SideBar').default
  },
  created() {
    this.$store.dispatch('initWallets')
    this.$router.push('balance')
  }
}
</script>

<style>

</style>

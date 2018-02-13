<template>
  <div id="home">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'home',
  mounted() {
    this.$router.push('/login')
  }
}
</script>

<style>

</style>

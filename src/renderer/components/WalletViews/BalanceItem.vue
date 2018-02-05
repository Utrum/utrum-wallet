<template>
  <div class="balance-item">
    <h3>{{wallet.ticker}}</h3>
    <p>{{wallet.address}}}</p>
  </div>
</template>

<script>
export default {
  name: 'balance-item',
  props: ['wallet']
}
</script>

<style>

</style>

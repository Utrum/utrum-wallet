<template>
  <div class="balance-item">
    <h3>{{wallet.coin.name}} <b>{{balance}}</b> {{wallet.ticker}}</h3>
    <p>{{wallet.address}}</p>
  </div>
</template>

<script>
var sb = require('satoshi-bitcoin')

export default {
  name: 'balance-item',
  props: {
    wallet: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      balance: 0,
    }
  },
  mounted () {  
    let url = `http://localhost:8000/`
    let payload = {
      "ticker": this.wallet.ticker,
      "method":"blockchain.address.get_balance",
      "params": [
        this.wallet.address
      ]
    }
    this.$http.post(url,payload).then(response => {
      this.balance = sb.toBitcoin(response.data.confirmed)
    })
  },
  computed: {
    walletData()  {
      return this.$props.wallet ? this.$props.wallet : null
    }
  }
}
</script>

<style>

</style>

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
    console.log(url)
    let payload = {
      "ticker": this.wallet.ticker,
      "method":"blockchain.address.get_balance",
      "params": [
        this.wallet.address
      ]
    }
    // payload = JSON.stringify(payload)
    this.$http.post(url,payload).then(response => {
      this.balance = sb.toBitcoin(response.data.confirmed)
      console.log(response)
    }).catch(error => {
      console.log(error.response)
    })
    // console.log(electrumHost[0].port)
    // let ecl = new ElectrumCli(electrumHost[0].port, electrumHost[0].host, electrumHost[0].mode)
    // try {
    //   this.balance = await ecl.blockchainAddress_getBalance(this.wallet.address)
    // } catch (e) {
    //   console.log(e)
    // }
    // await ecl.close()
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

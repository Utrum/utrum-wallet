<template>
  <div class="balance-item">
    <h3>{{wallet.coin.name***REMOVED******REMOVED*** <b>{{balance***REMOVED******REMOVED***</b> {{wallet.ticker***REMOVED******REMOVED***</h3>
    <p>{{wallet.address***REMOVED******REMOVED***</p>
  </div>
</template>

<script>
var sb = require('satoshi-bitcoin')

***REMOVED***
  name: 'balance-item',
  props: {
    wallet: {
      type: Object,
      default: () => ({***REMOVED***)
    ***REMOVED***
  ***REMOVED***,
  data () {
    return {
      balance: 0,
    ***REMOVED***
  ***REMOVED***,
  mounted () {  
    let url = `http://localhost:8000/`
    console.log(url)
    let payload = {
      "ticker": this.wallet.ticker,
      "method":"blockchain.address.get_balance",
      "params": [
        this.wallet.address
      ]
    ***REMOVED***
    // payload = JSON.stringify(payload)
    this.$http.post(url,payload).then(response => {
      this.balance = sb.toBitcoin(response.data.confirmed)
      console.log(response)
    ***REMOVED***).catch(error => {
      console.log(error.response)
    ***REMOVED***)
    // console.log(electrumHost[0].port)
    // let ecl = new ElectrumCli(electrumHost[0].port, electrumHost[0].host, electrumHost[0].mode)
    // try {
    //   this.balance = await ecl.blockchainAddress_getBalance(this.wallet.address)
    // ***REMOVED*** catch (e) {
    //   console.log(e)
    // ***REMOVED***
    // await ecl.close()
  ***REMOVED***,
  computed: {
    walletData()  {
      return this.$props.wallet ? this.$props.wallet : null
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

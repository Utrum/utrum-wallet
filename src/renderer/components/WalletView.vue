<template>
  
</template>

<script>
import ElectrumCli from 'electrum-client'

***REMOVED***
  data () {
    return {
      ecl: {***REMOVED***
    ***REMOVED***
  ***REMOVED***,
  mounted() {
    this.init()
  ***REMOVED***,
  destroyed () {
    this.ecl.close()
  ***REMOVED***,
  methods: {
    init() {
      this.ecl = new ElectrumCli(50001, 'node1.komodo.rocks', 'tcp') // tcp or tls
      this.ecl.connect().then((e) => {
        console.log(this.ecl)
        console.log("kkonectid",e)
        // 1BVSUcWsWhnizHuGhkuAnyubv4W56SCCAk
        this.ecl.blockchainAddress_getBalance('1BVSUcWsWhnizHuGhkuAnyubv4W56SCCAk').then(balance => {
          console.log(balance.confirmed)
        ***REMOVED***)
        this.ecl.subscribe.on('server.peers.subscribe', (v) => {
          console.log(v)
        ***REMOVED***);
      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>

</style>

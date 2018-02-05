<template>
  <h1>Welcome in the Monaize Wallet :-)</h1>
</template>

<script>
import ElectrumCli from 'electrum-client'

export default {
  data () {
    return {
      ecl: {}
    }
  },
  mounted() {
    this.init()
  },
  destroyed () {
    this.ecl.close()
  },
  methods: {
    init() {
      this.ecl = new ElectrumCli(50001, 'node1.komodo.rocks', 'tcp') // tcp or tls
      this.ecl.connect().then((e) => {
        console.log(this.ecl)
        console.log("kkonectid",e)
        // 1BVSUcWsWhnizHuGhkuAnyubv4W56SCCAk
        this.ecl.blockchainAddress_getBalance('1BVSUcWsWhnizHuGhkuAnyubv4W56SCCAk').then(balance => {
          console.log(balance.confirmed)
        })
        this.ecl.subscribe.on('server.peers.subscribe', (v) => {
          console.log(v)
        });
      })
    }
  }
}
</script>

<style>

</style>

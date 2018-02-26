<template>
  <div class="content">
    <div class="row-header">
      <div class="col-header">
        <h3>BALANCES</h3>
      </div>
      <div class="col-header text-right">
        <div>
          <h5>TOTAL BALANCES</h5>
        </div>
        <div>
          <span id="totalBalanceUsd"><img src="@/assets/icon-usdollar.svg"/>{{totalBalance}}</span>
        </div>
      </div>
    </div>
    <div v-for="wallet in wallets" v-bind:key="wallet.ticker">
      <balance-item :wallet="wallet"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'balance',
  components: {
    'balance-item': require('@/components/WalletViews/BalanceItem').default,
  },
  mounted() {
    Object.keys(this.wallets).forEach(function(ticker) {
      this.$store.dispatch('updateBalance', this.wallets[ticker])
    }, this);
  },
  methods: {
    numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  },
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    },
    totalBalance() {
      return this.numberWithSpaces(this.$store.getters.getTotalBalance.toFixed(2))
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700');
.content {
  padding: 50px;
  color: rgb(151,151,151);
}

.content h3 {
  font-weight: 300;
  color: #180d39;
}

.content h5 {
  font-weight: 300;
  color: #687078;
}

#totalBalanceUsd img {
  vertical-align: top;
  padding-top: 15px;
  padding-right: 10px;
}

#us-dollar img {
  padding-right: 5px;
}


#totalBalanceUsd {
  color: black;
  font-size: 2.3em;
  font-weight: 300
}

.stop {
  float: right;
}

.buttonactived {
  color: white;
  background-color: #7e3589;
}

.buttondesactived {
  color: white;
  background-color: #bfbfbf;
}

.btn-success-mnz{
  color:#fff;
  background-color: #532c67;
  border-color: #430961;
}

.btn:hover {
  color: white;
}

.loader{
  margin-top: 25%;
}

.btn-success-mnz:hover {
  color: #fff;
  background-color: #6e2b90;
  border-color: #430961;
}

.btn-success-mnz:focus {
  color: #fff;
  background-color: #6e2b90;
  border-color: #430961;
}

.disableSendCoins {
  opacity: 0.65;
  cursor: not-allowed;
}


#loginbox {
  margin-top: 33%;
}

#login > div:first-child {
  padding-bottom: 10px;
}

#form > div {
  margin-bottom: 25px;
}

#form > div:last-child {
  margin-top: 10px;
  margin-bottom: 10px;
}

.panel {
  background-color: transparent;
}

.panel-body {
  padding-top: 30px;
  background-color: rgba(255,255,255,.3);
}

h5 {
  margin: 0;
  color: black;
  font-weight: 500;
}

a{
  color: #686a6b;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f542;
}

.navbar{
  position: fixed;
  top: 0px;
  background-color: #ffffff1f;
  width:100%;
  min-height:37px;
  height: 37px;
  padding: 2px;
  border-radius: 0px;
}

.walletview{
  color:#5d5363;
}

.addrs{
  margin-top:5%
}

.address{
  width: 270px;
}

.swaps{
  color:#000000;
  background-color: #ffffff62;
}

.buy{
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  background-color: #532c67;
  border-color: #430961;
  color:#fff;
}

.buy:hover{
  background-color: #6e2b90;
  border-color: #430961;
}

.right{
  float:right;
}
.qr-code-container {
  background-color:#ffffff89;
  padding:10px;
}
.qr{
  color:#fff;
}

#us-dollar {
  font-weight: 300;
  color: #999999;
}

.row-footer p {
  font-weight: 300;
  color: #180d39;
}
</style>

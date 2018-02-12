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
          <span id="totalBalanceUsd"><img src="@/assets/icon-usdollar.svg"/>{{totalBalance***REMOVED******REMOVED***</span>
        </div>
      </div>
    </div>
    <div v-for="wallet in wallets" v-bind:key="wallet.ticker">
      <balance-item :wallet="wallet"/>
    </div>
  </div>
</template>

<script>
***REMOVED***
  name: 'balance',
  components: {
    'balance-item': require('@/components/WalletViews/BalanceItem').default
  ***REMOVED***,
  mounted() {
    Object.keys(this.wallets).forEach(function(ticker) {
      this.$store.dispatch('updateBalance', this.wallets[ticker])
    ***REMOVED***, this);
  ***REMOVED***,
  computed: {
    wallets() {
      return this.$store.getters.getWallets
    ***REMOVED***,
    totalBalance() {
      return this.$store.getters.getTotalBalance
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700');

.content {
  padding: 50px;
  color: rgb(151,151,151);
***REMOVED***

.content h3 {
  font-weight: 300;
  color: #180d39;
***REMOVED***

.content h5 {
  font-weight: 300;
  color: #687078;
***REMOVED***

#totalBalanceUsd img {
  vertical-align: top;
  padding-top: 15px;
  padding-right: 10px;
***REMOVED***

#us-dollar img {
  padding-right: 5px;
***REMOVED***


#totalBalanceUsd {
  color: black;
  font-size: 2.3em;
  font-weight: 300
***REMOVED***

.stop {
  float: right;
***REMOVED***

.buttonactived {
  color: white;
  background-color: #7e3589;
***REMOVED***

.buttondesactived {
  color: white;
  background-color: #bfbfbf;
***REMOVED***

.btn-success-mnz{
  color:#fff;
  background-color: #532c67;
  border-color: #430961;
***REMOVED***

.btn:hover {
  color: white;
***REMOVED***

.loader{
  margin-top: 25%;
***REMOVED***

.btn-success-mnz:hover {
  color: #fff;
  background-color: #6e2b90;
  border-color: #430961;
***REMOVED***

.btn-success-mnz:focus {
  color: #fff;
  background-color: #6e2b90;
  border-color: #430961;
***REMOVED***

.disableSendCoins {
  opacity: 0.65;
  cursor: not-allowed;
***REMOVED***


#loginbox {
  margin-top: 33%;
***REMOVED***

#login > div:first-child {
  padding-bottom: 10px;
***REMOVED***

#form > div {
  margin-bottom: 25px;
***REMOVED***

#form > div:last-child {
  margin-top: 10px;
  margin-bottom: 10px;
***REMOVED***

.panel {
  background-color: transparent;
***REMOVED***

.panel-body {
  padding-top: 30px;
  background-color: rgba(255,255,255,.3);
***REMOVED***

h5 {
  margin: 0;
  color: black;
  font-weight: 500;
***REMOVED***

a{
  color: #686a6b;
***REMOVED***

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f542;
***REMOVED***

.navbar{
  position: fixed;
  top: 0px;
  background-color: #ffffff1f;
  width:100%;
  min-height:37px;
  height: 37px;
  padding: 2px;
  border-radius: 0px;
***REMOVED***

.walletview{
  color:#5d5363;
***REMOVED***

.addrs{
  margin-top:5%
***REMOVED***

.address{
  width: 270px;
***REMOVED***

.swaps{
  color:#000000;
  background-color: #ffffff62;
***REMOVED***

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
***REMOVED***

.buy:hover{
  background-color: #6e2b90;
  border-color: #430961;
***REMOVED***

.right{
  float:right;
***REMOVED***
.qr-code-container {
  background-color:#ffffff89;
  padding:10px;
***REMOVED***
.qr{
  color:#fff;
***REMOVED***

#us-dollar {
  font-weight: 300;
  color: #999999;
***REMOVED***

.row-footer p {
  font-weight: 300;
  color: #180d39;
***REMOVED***
</style>

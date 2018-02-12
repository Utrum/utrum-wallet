<template>
  <div class="row-main-item">
    <div class="row-title">
      <h2 id="balance-item">{{wallet.balance***REMOVED******REMOVED***</h2>
      <h2 id="coin-item">{{wallet.ticker***REMOVED******REMOVED***</h2>
    </div>
    <div class="row-content">
      <p id="us-dollar" class="col-header"><img src="@/assets/icon-usdollar.svg"/>{{wallet.balance_usd***REMOVED******REMOVED*** (USD)</p>
      <button v-b-modal="wallet.ticker" :id="wallet.ticker" type="button" class="btn qrcode">SEE YOUR QR CODE<img src="@/assets/icon-qrcode-select.svg"></img></button>
    </div>
    <div class="row-footer">
      <p class="col-header">Your deposit {{wallet.coin.name***REMOVED******REMOVED*** address :</p>
      <div class="card">
        <button
        v-clipboard:copy="wallet.address"
        v-clipboard:success="onCopy"
        type="button" 
        class="btn btn-copy-link btn-smartaddress" 
        :data-clipboard-text="wallet.address">
        <div id="wallet-address-string" :id="wallet.ticker" class="btn-inside-qrcode">
          <span v-if="isClipboard" >Copied to the clipboard</span>
          <span v-else>{{wallet.address***REMOVED******REMOVED***</span>
        </div>
      </button>
    </div>
  </div>
  <hr/>
  <qrcode-modal :wallet="wallet"></qrcode-modal>
</div>
</template>

<script>
var sb = require('satoshi-bitcoin')
var electrum = require('../../lib/electrum')

***REMOVED***
  name: 'balance-item',
  components: {
    'qrcode-modal' : require('@/components/Utils/QrcodeModal').default
  ***REMOVED***,
  props: {
    wallet: {
      type: Object,
      default: () => ({***REMOVED***)
    ***REMOVED***
  ***REMOVED***,
  data() {
    return {
      isClipboard: false,
    ***REMOVED***
  ***REMOVED***,
  methods: {
    onCopy() {
      var self = this
      this.isClipboard = true;
      setTimeout(function(){
        self.isClipboard = false;
      ***REMOVED***, 1000);
    ***REMOVED***
  ***REMOVED***,
***REMOVED***
</script>

<style scoped>

.modal-header {
  text-align: center;
  border-bottom: none !important;
***REMOVED***

.content .btn:focus {
  outline: none;
  box-shadow: none;
***REMOVED***

.row-header {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
***REMOVED***

.row-title {
  margin: 0;
  display: flex;
  justify-content: flex-start;
***REMOVED***

.col-header {
  flex-grow: 1;
  margin: 0px;
***REMOVED***

.row-main-item {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
***REMOVED***

#balance-item {
  margin: 0;
  margin-right: 5px;
  font-weight: 300;
  color: #180d39;
***REMOVED***

#coin-item{
  margin: 0;
  font-weight: 200;
  color: #180d39;
***REMOVED***

.row-content {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
***REMOVED***

.row-content .btn:hover{
  color: #7c398a;
***REMOVED***

.row-footer {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
***REMOVED***

.row-footer button{
  padding: 0px;
  margin: 0px;
  background-color: black;
  border: white;
  border-radius: 4px;
***REMOVED***

.row-footer button:hover{
  background-color: #7c398a;
***REMOVED*** 

.row-footer button:active{
  background-color: #7c398a;
***REMOVED***

.btn-inside-qrcode {
  color: #687078;
  font-weight: 400;
  margin-left: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: white;
  border-radius: 3px;
  border-left-radius: 0px;
  border-top-left-radius: 0px 0px;
  border-bottom-left-radius: 0px 0px;
  width: 380px;
  text-align: center;
***REMOVED***

.btn-inside-qrcode:hover {
  color: #7c398a;
***REMOVED***

.balance {
  font-size: 16pt;
  font-weight: 300;
  width: 150px;
***REMOVED***

.qrcode img {
  padding-left: 10px;
  padding-right: 0px;
  margin-top: auto;
  margin-bottom: auto;
***REMOVED***

.qrcode {
  background-color: transparent;
  color: #7c398a;
  font-weight: 400;
***REMOVED***

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 2px solid #f3f4fc;
  margin: 1em 0;
  padding: 0;
***REMOVED***
</style>

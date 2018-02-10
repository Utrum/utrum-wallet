<template>
	<div class="content">
		<h3 id="title">WITHDRAWAL</h3>
		<div class="title-amount">
			<div class="row">
				<h5 class="col-custom sub-title">CHOOSE YOUR CRYPTO</h5>
				<h5 id="str-current-balances" class="col-custom sub-title">YOUR CURRENCY BALANCE</h5>
			</div>
		</div>

		<div class="row">
			<div id="selector-coin-buy" class="col-custom">
				<div class="row-header">
					<div class="btn select-all">
						<p id="add-coin">+</p>
					</div>
					<div class="col-custom">
						<select2 :options="listData" :value="select" @input="updateCoin"></select2>
					</div>
				</div>
			</div>
			<div id="separator" class="col-custom">
				<div class="vl">
				</div>
			</div>
			<div id="card-current-balance" class="col-custom">
				<div class="row current-balance card">
					<span id="value-current-balance">{{getBalance***REMOVED******REMOVED***</span><span>{{select***REMOVED******REMOVED***</span>
				</div>
			</div>
		</div>

		<div id="select-amount" class="row">
			<div class="col-custom title-content">
				<span>AMOUNT</span>
			</div>
			<div class="row">
				<input v-model="withdraw.amount" onkeypress='return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46' id="amount" type="text" class="input-field" placeholder="0.0">
				<span id="current-coin"> {{select***REMOVED******REMOVED***</span>
			</div>
		</div>
		<div class="col-custom horizontal-line">
			<hr id="first-line"/>
		</div>

		<div class="row">
			<div class="col-custom">
				<span class="title-content">{{select***REMOVED******REMOVED*** ADDRESS</span>
			</div>
			<input v-model="withdraw.address" type="text" class="col-custom input-field" id="addr" placeholder="Enter reception address">
		</div>
		<div class="col-custom horizontal-line">
			<hr/>
		</div>

		<div class="btn-center">
			<button :disabled="!canWithdraw"  v-b-modal="'confirmWithdraw'" id="sendcoins" class="btn sendcoins" type="button">SEND</button>
		</div>

		<h3 id="title">TX HISTORY</h3>

		<b-table id="txTable" striped hover :items="history"></b-table>
    <b-modal @ok="withdrawFunds()" id="confirmWithdraw" centered title="Withdraw confirmation">
      <p class="my-4">Are you sure you want to withdraw <b>{{withdraw.amount***REMOVED******REMOVED*** {{withdraw.coin***REMOVED******REMOVED***</b> to <b>{{withdraw.address***REMOVED******REMOVED***</b></p>
    </b-modal>
	</div>
</template>

<script>
import bitcoinjs from 'bitcoinjs-lib'
import { Wallet ***REMOVED*** from 'libwallet-mnz'
var sb = require('satoshi-bitcoin')

***REMOVED***
	name: 'withdraw',
	components: {
		'select2': require('../Utils/Select2.vue').default
	***REMOVED***,
	data() {
		return {
			listData: [
        'BTC',
        'KMD',
        'MNZ',
        // 'LTC',
        // 'DASH',
        // 'BCC'
			],
      select: 'MNZ',
      withdraw: {
        amount: 0.1,
        address: 'RPRLh5bddEmZCGDwa7q92sTKAfEbBHtKUd',
        coin: 'MNZ'
			***REMOVED***,
			history: []
		***REMOVED***
  ***REMOVED***,
	mounted() {
		this.getTxHistory()
	***REMOVED***,
  methods: {
		updateCoin(value) {
      this.select = value
			this.withdraw.coin = value
			this.getTxHistory()
		***REMOVED***,
		getRawTx(tx) {
			this.$http.post('http://localhost:8000', {
				ticker: this.wallet.ticker,
				method: 'blockchain.transaction.get',
				params: [ item.tx_hash ]
			***REMOVED***).then(response => {
				var tx = bitcoinjs.Transaction.fromHex(response.data);
				item.amount  = tx.outs[0].value;
			***REMOVED***)
		***REMOVED***,
		getTxHistory() {
			var self = this;
			this.$http.post('http://localhost:8000', {
				ticker: this.wallet.ticker,
				method: 'blockchain.address.get_history',
				params: [ this.wallet.address ]
			***REMOVED***).then(response => {
				if (response.data.length > 0) {
					let history = response.data
					self.history = history
					this.$root.$emit('bv::table::refresh', 'txTable');
				***REMOVED*** else return []
			***REMOVED***)
		***REMOVED***,
    withdrawFunds() {
			if(this.canWithdraw && this.addressIsValid) {
				var self = this
				this.$http.post('http://localhost:8000', {
					ticker: this.wallet.ticker,
					method: 'blockchain.address.listunspent',
					params: [ this.wallet.address ]
				***REMOVED***).then(response => {
					console.log(response)
					let wallet = new Wallet(this.$store.getters.passphrase, this.wallet.coin, 0)
					let tx = wallet.prepareTx(response.data, self.withdraw.address, sb.toSatoshi(self.withdraw.amount))
					console.log(wallet, tx)
				***REMOVED***)
			***REMOVED***
		***REMOVED***
	***REMOVED***,
	computed: {
		wallet() {
			return this.$store.getters.getWalletByTicker(this.select)
    ***REMOVED***,
		getBalance() {
			return this.$store.getters.getWalletByTicker(this.select).balance
    ***REMOVED***,
    canWithdraw() {
      return (this.withdraw.amount < this.getBalance && this.withdraw.amount > 0 && this.addressIsValid)
    ***REMOVED***,
    addressIsValid() {
			if (this.withdraw.address)
				return bitcoinjs.address.fromBase58Check(this.withdraw.address).version > 0
			else return false
    ***REMOVED***
  ***REMOVED***
***REMOVED***
</script>

<style>
.content {
	padding: 50px;
	color: rgb(151,151,151);
***REMOVED***

.row-custom {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
***REMOVED***

#select-amount {
	margin-top: 30px;
***REMOVED***

#separator {
	max-width: 1px;
***REMOVED***

#selector-coin-buy {
	max-width: 150px;
***REMOVED***

.content h3 {
	font-weight: 300;
	color: #180d39;
***REMOVED***

.title-amount {
	margin-bottom: 20px;
***REMOVED***

.sub-title {
	font-weight: 300;
	color: #180d39 !important;
***REMOVED***

.select-header{
	margin: 50px;
	border: 1px solid #7c398a;
	background: transparent;
	width: 150px;
	padding: 5px 5px 5px 5px;
	font-size: 16px;
	text-align: center;
	border-radius: 4px;
	border-color: black !important;
	height: 800px;
	font-size: 1.9em;
	font-weight: 300;
	text-align-last:center;
***REMOVED***

.select-header:hover{
	background-color: black;
	color: white;
***REMOVED***

.select2-selection__rendered {
	line-height: 75px !important;
	text-align: center;
	color: #7c398a !important;
	font-weight: 200;
***REMOVED***

.select2-selection {
	height: 75px !important;
	width: 126px;
	border-color: #7c398a !important;
	font-size: 1.8em;
	font-weight: 300;
	border-top-left-radius: 0px 0px !important;
	border-bottom-left-radius: 0px 0px !important;
***REMOVED***

.select2-selection__arrow {
	display: none;
***REMOVED***

.select2-selection__rendered {
	padding: 0px !important;
***REMOVED***

.select2-container--open .select2-dropdown--below {
	width: 174px !important;
	margin-left: -24px !important;
***REMOVED***

.select-all {
	background-color: transparent;
	padding-top: auto;
	padding-bottom: auto;
	width: 25px;
	border-top-left-radius: 4px 4px;
	border-bottom-left-radius: 4px 4px;
	border: 1px solid #7c398a;
	border-width: 1px 0px 1px 1px;
	text-align: center;
	color: red;
***REMOVED***

#str-current-balances {
	text-align: right;
***REMOVED***

.row {
	margin: 0px;
	display: flex;
	justify-content: space-between;
***REMOVED***

.row-header {
	display: flex;
	justify-content: flex-start;
***REMOVED***

.row .btn{
	padding: 0px;
	margin: 0px;
	border-top-right-radius: 0px 0px !important;
	border-bottom-right-radius: 0px 0px !important;
***REMOVED***

.row .btn:focus {
	outline: none;
	box-shadow: none;
***REMOVED***

.vl {
	border-left: 1px solid rgba(0,0,0,0.1);
	height: 45px;
	margin-top: 15px;
***REMOVED***

.current-balance {
	height: 75px;
	text-align: center;
	padding-top: 20px;
	padding-bottom: 20px;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	align-content: center;
***REMOVED***

#card-current-balance {
	text-align: right;
	font-size: 1.8em;
	max-width: 300px;
***REMOVED***

#add-coin {
	color: black;
	font-size: 1.8em;
	height: 100%;
	padding: 0px;
	margin: 0px;
	line-height: 73px;
	text-align: center;
	background-color: white;
	border-radius: 4px;
***REMOVED***

.col {
	flex-grow: 1;
***REMOVED***

.content .select2-selection:focus {
	outline: none;
	box-shadow: none;
***REMOVED***

#title {
	margin-bottom: 40px;
***REMOVED***

.input-field {
	outline: none;
	box-shadow: none;
	text-align: right;
***REMOVED***

.col-custom {
	flex-grow: 1;
***REMOVED***

hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid rgba(0,0,0, 0.1);;
	padding: 0;
***REMOVED***

#first-line {
	margin-top: 10px;
***REMOVED***

.btn-center {
	text-align: center;
***REMOVED***

.disableSendCoins {
	border: 1px solid rgba(0,0,0,0.1) !important;
	color: rgba(0,0,0,0.1) !important;
	cursor: not-allowed;
***REMOVED***

.disableSendCoins:hover {
	border: 1px solid rgba(0,0,0,0.1) !important;
	color: rgba(0,0,0,0.1) !important;
	cursor: not-allowed;
	background-color: transparent !important;
***REMOVED***

#sendcoins {
	border: 1px solid #7c398a;
	border-radius: 4px !important;
	background-color: transparent;
	font-size: 1.4em;
	width: 160px;
	height: 45px;
	text-align: center;
	outline: none;
	box-shadow: none;
	color: #7c398a;
***REMOVED***

#sendcoins:hover {
	background-color: #7c398a;
	color: white;
***REMOVED***

.disableSendCoins {
	opacity: 0.65;
	cursor: not-allowed;
***REMOVED***

#addr {
	background-color: transparent;
	border: none;
	font-size: 1.1em;
	font-weight: 300;
	color: #687078;
***REMOVED***

#amount {
	background-color: transparent;
	border: none;
	font-size: 1.8em;
	font-weight: 300;
	color: rgb(151,151,151);
***REMOVED***

::-webkit-input-placeholder {
	color: rgba(104,112,120,0.4);
	font-weight: 200;
***REMOVED***

#current-coin {
	font-size: 1.8em;
	color: #687078;
	font-weight: 200;
***REMOVED***

.card span {
	color: #687078;
	font-weight: 200;
***REMOVED***

.title-content {
	font-weight: 400;
	color: #180d39;
	margin: auto;
***REMOVED***

.horizontal-line {
	margin-bottom: 50px;
***REMOVED***

#value-current-balance {
	font-weight: 400;
	color: #687078;
***REMOVED***

</style>

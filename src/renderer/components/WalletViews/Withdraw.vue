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
				<div class="row-header" v-b-tooltip.html.right title="Click to select currency">
					<div class="btn select-all">
						<p @click="$root.$emit('select2:open')" id="add-coin">+</p>
					</div>
					<div  class="col-custom">
						<select2 ref='select2' :options="listData" :value="select" @input="updateCoin"></select2>
					</div>
				</div>
			</div>
			<div id="separator" class="col-custom">
				<div class="vl">
				</div>
			</div>
			<div @click="withdraw.amount = getBalance" id="card-current-balance" class="col-custom">
				<div v-b-tooltip.html.left title="Click to withdraw all funds" class="row current-balance card">
					<span id="value-current-balance">{{getBalance}}&nbsp;</span><span>{{select}}</span>
				</div>
			</div>
		</div>

		<div id="select-amount" class="row">
			<span class="title-content">AMOUNT</span>
				<div class="col-custom input-field row">
					<input v-model="withdraw.amount" onkeypress='return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46' id="amount" type="text" class="col-custom input-field" placeholder="0.0">
					<span id="current-coin"> {{select}}</span>
			</div>
		</div>
		<div class="col-custom horizontal-line">
			<hr id="first-line"/>
		</div>

		<div class="row">
			<span class="title-content">{{select}} ADDRESS</span>
			<input v-model="withdraw.address" type="text" class="col-custom input-field" id="addr" placeholder="Enter reception address">
			<button id="readerQrcode" v-b-modal="'readerQrcodeModal'" @click="readingQRCode = !readingQRCode">
				<img src="@/assets/icon-scan-qrcode.svg">
			</button>
			
		</div>
		<div class="col-custom horizontal-line">
			<hr/>
		</div>

		<div class="btn-center">
			<button @click="sendToken" :disabled="!canWithdraw"  v-b-modal="'confirmWithdraw'" id="sendcoins" class="btn sendcoins" type="button">SEND</button>
		</div>
		<h3 id="title">TRANSACTIONS</h3>
		<transaction-history id="transactionHistory" :coin="wallet.coin"></transaction-history>
		<!-- <b-modal @ok="withdrawFunds()" id="confirmWithdraw" centered title="Withdraw confirmation">
			<p class="my-4">Are you sure you want to withdraw <b>{{withdraw.amount}} {{withdraw.coin}}</b> to <b>{{withdraw.address}}</b></p>
		</b-modal> -->

		<b-modal size="sm" :hide-header="true" :hide-footer="true" @hide="readingQRCode = false" id="readerQrcodeModal" centered>
			<qrcode-reader :video-constraints="videoConstraints" @decode="onDecode" :paused="paused" v-if="readingQRCode" @init="onInit"></qrcode-reader>
		</b-modal>

		<b-modal @ok="withdrawFunds()" ref="confirmWithdraw" id="confirmWithdraw" centered>
			<div slot="modal-header" class="headerModalBuy">
				<h2>WITHDRAWAL</h2>
			</div>
			<div class="contentModalBuy">
				<div class="row-main-item">
					<div class="row">
						<span class="subTitle">Amount to send</span>
						<div class="col-custom row-main-item">
							<span class="col-custom"><span class="selectAmount">{{withdraw.amount}} </span>{{select}}</span>
							<div class="col-custom"><hr></div>
						</div>
					</div>
					<div class="row">
						<span class="subTitle">Address {{select}}</span>
						<div class="col-custom row-main-item">
							<span id="address" class="col-custom selectAmount">{{withdraw.address}}</span>
							<div class="col-custom"><hr></div>
						</div>
					</div>
					<div class="row">
						<span class="subTitle">Transaction fees</span>
						<div class="col-custom row-main-item">
							<select-awesome @change="onChange" :value="fees[0].label" :fees="fees" id="selectAwesome" class="col-custom"></select-awesome>
							<div class="col-custom"><hr></div>
						</div>
					</div>
				</div>
				
				<hr id="horizontalLine">
				<div class="row-total-amount">
					<div class="col-custom row">
						<h2 class="col-custom">TOTAL AMOUNT</h2>
					</div>
					<div id="amountTotal" class="col-custom row">
						<div class="row">
							<span id="totalAmount">{{getTotalPriceWithFee}}</span>
							<span id="totalAmountCoin">{{select}}</span>
						</div>
					</div>
				</div>
			</div>
			<div slot="modal-footer" class="row footerBuyModal">
				<button @click="hideModal" slot="modal-cancel" id="cancel" class="col-custom btn-round-light">Cancel</button>
				<button @click="withdrawFunds()" slot="modal-ok" id="confirm" class="col-custom btn-round-light">Confirm</button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import bitcoinjs from 'bitcoinjs-lib'
import { Wallet } from 'libwallet-mnz'
import { QrcodeReader } from 'vue-qrcode-reader'

var sb = require('satoshi-bitcoin')

export default {
	name: 'withdraw',
	components: {
		'select2': require('../Utils/Select2.vue').default,
		'transaction-history': require('@/components/TransactionHistory').default,
		'select-awesome': require('../Utils/SelectAwesome.vue').default,
		QrcodeReader
	},
	data() {
		return {
			blocks: 1,
			fee: 0,
			feeSpeed: 'veryFast',
			fees: [
				{ id: 0, label: 'Very fast', blocks: 1, value: 'veryFast' },
				{ id: 1, label: 'Fast', blocks: 6, value: 'fast' },
				{ id: 2, label: 'Low', blocks: 36, value: 'low' },
			],
			videoConstraints: { 
				width: { 
					min: 400, 
					ideal: 400, 
					max: 400 
				},
				height: { 
					min: 400, 
					ideal: 400, 
					max: 400 
				}
			},
			paused: false,
			readingQRCode: false,
			listData: [
			'BTC',
			'KMD',
			'MNZ',
			],
			select: 'MNZ',
			withdraw: {
				amount: null,
				address: '',
				coin: 'MNZ'
			},
			history: [],
			
		}
	},
	methods: {
		calculateFees(value) {
			if (this.select === 'BTC')
				this.callEstimateFee(value.blocks);
			else if (this.select === 'MNZ') {
				this.fee = 0;
			} else {
				this.fee = 0.0001;
			}
		},
		sendToken() {
			this.calculateFees(this.fees[0]);
		},
		callEstimateFee(blocks) {
			self = this;
			this.$http.post('http://localhost:8000', {
				ticker: self.select,
				method: 'blockchain.estimatefee',
				params: [ Number(blocks) ]
				}).then(response => {
					self.fee = response.data;
			});	
		},
		onChange (value) {
			this.calculateFees(value);
    },
		hideModal() {
			this.$refs.confirmWithdraw.hide()
		},
		numberWithSpaces(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    },
		onDecode (content) {
			if (this.checkAddress(content)) {
				this.withdraw.address = content
			} else {
				this.$swal(`This address is not valid !`, content, 'error')
			}

			this.readingQRCode = false
			this.$root.$emit('bv::hide::modal', 'readerQrcodeModal')
			
		},
		checkAddress(addr) {
			if (addr) {
				let checkResult = bitcoinjs.address.fromBase58Check(addr);
				if (this.wallet.ticker === 'BTC') {
					return checkResult.version == 0;
				} else if (this.wallet.ticker === 'KMD' 
					|| this.wallet.ticker === 'MNZ')
					return checkResult.version == 60;
			} else
				return false
		},
		async onInit (promise) {
			this.loading = true

			try {
				await promise

				  // successfully initialized
				} catch (error) {
					if (error.name === 'NotAllowedError') {
				    // user denied camera access permisson
				} else if (error.name === 'NotFoundError') {
				    // no suitable camera device installed
				} else if (error.name === 'NotSupportedError') {
				    // page is not served over HTTPS (or localhost)
				} else if (error.name === 'NotReadableError') {
				    // maybe camera is already in use
				} else if (error.name === 'OverconstrainedError') {
				    // passed constraints don't match any camera. Did you requested the front camera although there is none?
				} else {
				    // browser is probably lacking features (WebRTC, Canvas)
				}
			} finally {
				this.loading = false
			}
		},
		updateCoin(value) {
			this.withdraw = {
				amount: null,
				address: '',
				coin: 'MNZ'
			};
			this.select = value
			this.withdraw.coin = value

			this.$store.dispatch('buildTxHistory', this.wallet)
		},
		
		// getRawTxAmount(tx) {
		// 	var rawTx
		// 	this.getRawTx(tx).then(response => {
		// 		rawTx = bitcoinjs.Transaction.fromHex(response.data);
		// 		tx.amount = rawTx.outs[0].value
		// 		console.log(tx)
		// 	})
		// },

		withdrawFunds() {
			this.hideModal();
			if(this.canWithdraw && this.addressIsValid) {
				var self = this
				this.$http.post('http://localhost:8000', {
					ticker: this.wallet.ticker,
					test: self.$store.getters.isTestMode,
					method: 'blockchain.address.listunspent',
					params: [ this.wallet.address ]
				}).then(response => {
					console.log(response)
					let wallet = new Wallet(self.wallet.privkey, self.wallet.coin, self.$store.getters.isTestMode)
					wallet.ticker = self.wallet.ticker
					let tx = wallet.prepareTx(response.data, self.withdraw.address, sb.toSatoshi(self.withdraw.amount), sb.toSatoshi(self.fee))
					console.log(wallet, tx)
					self.$http.post('http://localhost:8000', {
						ticker: self.wallet.ticker,
						test: self.$store.getters.isTestMode,
						method: 'blockchain.transaction.broadcast',
						params: [ tx ]
					}).then((response) => {
						self.$swal(`Transaction sent`, response.data, 'success')
					}).catch((error) => { self.$swal(`Transaction not send`, error, 'error') })
				})
			}
		}
	},
	computed: {
		getTotalPriceWithFee() {
			return this.numberWithSpaces((Number(this.withdraw.amount) + this.fee).toFixed(8))
		},
		wallet() {
			return this.$store.getters.getWalletByTicker(this.select)
		},
		getBalance() {
			return this.numberWithSpaces(this.$store.getters.getWalletByTicker(this.select).balance)
		},
		canWithdraw() {
			return (this.withdraw.amount < this.getBalance && this.withdraw.amount > 0 && this.addressIsValid)
		},
		addressIsValid() {
			if (this.withdraw.address)
				return bitcoinjs.address.fromBase58Check(this.withdraw.address).version > 0
			else return false
		},
}
}
</script>

<style scoped>
#amountTotal {
	align-self: center;
  text-align: center;
  padding-left: 47px;
}

.row-total-amount h2 {
  text-align: center;
}


#address {
	font-size: 0.75em;
}

#transactionHistory {
	margin-top: 50px;
}

#readerQrcode {
	height: 100%;
	margin-left: 10px;
	border: 1px solid #7D3A8B;
	background-color: transparent;
	border-radius: 5px;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 3px;
	padding-bottom: 3px;
	cursor: pointer;
	outline: none;
}

#readerQrcodeModal {
	text-align: center;
}

.content {
	padding: 50px;
	color: rgb(151,151,151);
}

.row-custom {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

#select-amount {
	margin-top: 30px;
}

#separator {
	max-width: 1px;
}

#selector-coin-buy {
	max-width: 150px;
}

.content h3 {
	font-weight: 300;
	color: #180d39;
}

.title-amount {
	margin-bottom: 20px;
}

.sub-title {
	font-weight: 300;
	color: #180d39 !important;
}

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
}

.select-header:hover{
	background-color: black;
	color: white;
}


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
}

#str-current-balances {
	text-align: right;
}

.row-header {
	display: flex;
	justify-content: flex-start;
}

.row .btn{
	padding: 0px;
	margin: 0px;
	border-top-right-radius: 0px 0px !important;
	border-bottom-right-radius: 0px 0px !important;
}

.row .btn:focus {
	outline: none;
	box-shadow: none;
}

.vl {
	border-left: 1px solid rgba(0,0,0,0.1);
	height: 45px;
	margin-top: 15px;
}

.current-balance {
	height: 75px;
	text-align: center;
	padding-top: 20px;
	padding-bottom: 20px;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	align-content: center;
}

#card-current-balance {
	text-align: right;
	font-size: 1.8em;
	max-width: 400px;
}

#add-coin {
	color: #7c398a !important;
	font-size: 1.8em;
	height: 100%;
	padding: 0px;
	margin: 0px;
	line-height: 73px;
	text-align: center;
	background-color: white;
	border-radius: 4px;
}

.col {
	flex-grow: 1;
}

.content .select2-selection:focus {
	outline: none;
	box-shadow: none;
}

#title {
	margin-bottom: 40px;
}

.input-field {
	outline: none;
	box-shadow: none;
	text-align: right;
}

.col-custom {
	flex-grow: 1;
}

#first-line {
	margin-top: 10px;
}

.btn-center {
	text-align: center;
}

.disableSendCoins {
	border: 1px solid rgba(0,0,0,0.1) !important;
	color: rgba(0,0,0,0.1) !important;
	cursor: not-allowed;
}

.disableSendCoins:hover {
	border: 1px solid rgba(0,0,0,0.1) !important;
	color: rgba(0,0,0,0.1) !important;
	cursor: not-allowed;
	background-color: transparent !important;
}

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
}

#sendcoins:hover {
	background-color: #7c398a;
	color: white;
}

.disableSendCoins {
	opacity: 0.65;
	cursor: not-allowed;
}

#addr {
	background-color: transparent;
	border: none;
	font-size: 1.1em;
	font-weight: 300;
	color: #687078;
}

#amount {
	background-color: transparent;
	border: none;
	font-size: 1.8em;
	font-weight: 300;
	color: rgb(151,151,151);
}

::-webkit-input-placeholder {
	color: rgba(104,112,120,0.4);
	font-weight: 200;
}

#current-coin {
	font-size: 1.8em;
	color: #687078;
	font-weight: 200;
}

.card span {
	color: #687078;
	font-weight: 200;
}

.title-content {
	font-weight: 400;
	color: #180d39;
	margin: auto;
}

.horizontal-line {
	margin-bottom: 50px;
}

#value-current-balance {
	font-weight: 400;
	color: #687078;
}

.cardTable {
    box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
    border-radius: 4px;
    border: none;
}

</style>

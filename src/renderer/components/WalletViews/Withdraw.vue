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
					<span id="value-current-balance">{{getBalance}}</span><span>{{select}}</span>
				</div>
			</div>
		</div>

		<div id="select-amount" class="row">
			<div class="col-custom title-content">
				<span>AMOUNT</span>
			</div>
			<div class="row">
				<input v-model="withdraw.amount" onkeypress='return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46' id="amount" type="text" class="input-field" placeholder="0.0">
				<span id="current-coin"> {{select}}</span>
			</div>
		</div>
		<div class="col-custom horizontal-line">
			<hr id="first-line"/>
		</div>

		<div class="row">
			<div class="col-custom">
				<span class="title-content">{{select}} ADDRESS</span>
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

		<b-table id="txTable" striped hover :fields="fields" :items="history">
			<template slot="amount" slot-scope="row">{{getRawTxAmount(row)}}</template>
		</b-table>
    <b-modal @ok="withdrawFunds()" id="confirmWithdraw" centered title="Withdraw confirmation">
      <p class="my-4">Are you sure you want to withdraw <b>{{withdraw.amount}} {{withdraw.coin}}</b> to <b>{{withdraw.address}}</b></p>
    </b-modal>
	</div>
</template>

<script>
import bitcoinjs from 'bitcoinjs-lib'
import { Wallet } from 'libwallet-mnz'
var sb = require('satoshi-bitcoin')

export default {
	name: 'withdraw',
	components: {
		'select2': require('../Utils/Select2.vue').default
	},
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
			},
			history: [],
			fields: [
				{
					key:'tx_hash',
					label: 'Tx Hash'
				},
				{
					key: 'amount',
					label: 'Amount'
				}
			]
		}
  },
	mounted() {
		this.getTxHistory()
	},
  methods: {
		updateCoin(value) {
      this.select = value
			this.withdraw.coin = value
			this.getTxHistory()
		},
		getRawTx(tx) {
			return this.$http.post('http://localhost:8000', {
				ticker: this.wallet.ticker,
				method: 'blockchain.transaction.get',
				params: [ tx.tx_hash ]
			})
		},
		getRawTxAmount(tx) {
			// var rawTx
			// this.getRawTx(tx).then(response => {
			// 	rawTx = bitcoinjs.Transaction.fromHex(response.data);
			// 	tx.amount = rawTx.outs[0].value
			// 	console.log(tx)
			// })
			
			// // console.log(rawTx)
		},
		getTxHistory() {
			var self = this;
			this.$http.post('http://localhost:8000', {
				ticker: this.wallet.ticker,
				method: 'blockchain.address.get_history',
				params: [ this.wallet.address ]
			}).then(response => {
				if (response.data.length > 0) {
					let history = response.data
					self.history = history
					this.$root.$emit('bv::table::refresh', 'txTable');
				} else return []
			})
		},
    withdrawFunds() {
			if(this.canWithdraw && this.addressIsValid) {
				var self = this
				this.$http.post('http://localhost:8000', {
					ticker: this.wallet.ticker,
					method: 'blockchain.address.listunspent',
					params: [ this.wallet.address ]
				}).then(response => {
					console.log(response)
					let wallet = new Wallet(self.$store.getters.passphrase, self.wallet.coin, 0)
					wallet.ticker = self.wallet.ticker
					let tx = wallet.prepareTx(response.data, self.withdraw.address, sb.toSatoshi(self.withdraw.amount))
					console.log(wallet, tx)
					self.$http.post('http://localhost:8000', {
						ticker: self.wallet.ticker,
						method: 'blockchain.transaction.broadcast',
						params: [ tx ]
					}).then((response) => {
						self.$swal(`Transaction sent`, response.data, 'success')
					})
				})
			}
		}
	},
	computed: {
		wallet() {
			return this.$store.getters.getWalletByTicker(this.select)
    },
		getBalance() {
			return this.$store.getters.getWalletByTicker(this.select).balance
    },
    canWithdraw() {
      return (this.withdraw.amount < this.getBalance && this.withdraw.amount > 0 && this.addressIsValid)
    },
    addressIsValid() {
			if (this.withdraw.address)
				return bitcoinjs.address.fromBase58Check(this.withdraw.address).version > 0
			else return false
    }
  }
}
</script>

<style>
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

.row {
	margin: 0px;
	display: flex;
	justify-content: space-between;
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
	max-width: 300px;
}

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

hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid rgba(0,0,0, 0.1);;
	padding: 0;
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

</style>

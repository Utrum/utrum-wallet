<template>
	<div class="content-buyview row-main">
		<div class="col-custom">
			<div class="row">
				<div class="col-custom title-buy-mnz">
					<h3>BUY MONAIZE</h3>
				</div>
				<div class="col-custom">
					<div class="row-main div-total-mnz">
						<h5 class="col-custom">TOTAL</h5>
						<div id="total-mnz" class="col-custom">
							{{getMnzBalance}} MNZ
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="crypto-title-line" class="col-custom">
			<div class="row">
				<div class="col-custom sub-title title-buy-mnz">
					CHOOSE YOUR CRYPTO
				</div>
				<hr class="col-custom" id="line-cut"/>
			</div>
		</div>

		<div class="col-custom">
			<div class="row-custom">
				<div class="col-custom">
					<div class="row-custom">
						<div class="col-custom select-all">
							<p id="add-coin">+</p>
						</div>
						<div class="col-custom">
							<select2 :options="listData" :value="select" @input="valueChange"></select2>
						</div>
					</div>
				</div>
				<div class="col-custom arrow-buy">
					<img src="@/assets/icon-swap-arrow.svg"/>
				</div>
				<div class="col-custom">
					<div id="buy-mnz-box" class="card">
						<span>MNZ</span>
					</div>
				</div>
			</div>
		</div>

		<div id="choose-coin" class="row">
			<div class="col-custom">
				<div id="currency-balance-div" class="row-main">
					<div class="sub-title">
						YOUR CURRENCY BALANCES
					</div>
					<div id="balance-value">
						{{getBalance}}<span id="balance-coin"> {{select}}</span>
					</div>
				</div>
			</div>
			<div class="col-custom">
				<div id="choose-mnz" class="row-main">
					<div class="sub-title">
						CHOOSE HOW MANY MNZ YOU WANT TO BUY
					</div>
					<div id="package-mnz" class="row">
						<a v-on:click="decrementPackage" id="less-mnz" href="#" class="col-center">
							<img src="@/assets/icon-less.svg"/>
						</a>
						<div id="package-value" class="col-center">
							{{package}}
						</div>
						<a v-on:click="incrementPackage" id="more-mnz" href="#" class="col-center">
							<img src="@/assets/icon-more.svg"/>
						</a>
					</div>
				</div>
			</div>
		</div>

		<hr/>

		<div class="row">
			<div class="col-custom center-horizontal">
				<h5 id="detail-order-title">YOUR ORDER<br/>DETAILS</h5>
			</div>
			<div class="col-custom center-horizontal">
				<div class="row-main center-text">
					<div class="title-value">
						Total {{getStringTicket}}
					</div>
					<div class="value">
						{{getTotalPrice}}
					</div>
				</div>
			</div>
			<div class="col-custom center-horizontal">
				<div class="row-main center-text">
					<div class="title-value">
						MNZ
					</div>
					<div class="value">
						{{package}}
					</div>
				</div>
			</div>

			<button :disabled="canBuy"  v-b-modal="'confirmBuy'" id="buycoins" class="btn sendcoins" type="button">
				BUY
			</button>
		</div>
		<b-modal @ok="buyMnz()" id="confirmBuy" centered title="Buy confirmation">
			<p class="my-4">Are you sure you want to buy <b>{{package}}MNZ</b> for <b>{{getTotalPrice}}{{select}} ?</b></p>
		</b-modal>
	</div>
</template>

<script>
import swal from 'sweetalert2';

export default {
	name: 'buy',
	components: {
		'select2': require('../Utils/Select2.vue').default
	},
	data() {
		return {
			listData: [
			'BTC',
			'KMD'
			],
			select: 'BTC',
			package: 500,
			packageIncrement: 500,
			packageMAX: 100000,
		}
	},
	methods: {
		totalPrice() {
			let price = 0;
			if (this.select === 'BTC') {
				price = 0.00006666;
			} else if (this.select === 'KMD') {
				price = 0.03333333;
			}
			return (this.package * price).toFixed(8);
		},
		valueChange(value) {
			this.select = value
		},
		incrementPackage() {
			if (this.package < this.packageMAX) {
				this.package += this.packageIncrement;
			}
		},
		decrementPackage() {
			if (this.package > this.packageIncrement) {
				this.package -= this.packageIncrement;
			}
		},
		buyMnz() {
			swal('Success', "here buy " + this.package + "mnz", 'success');
/*			if (this.totalPrice() < balance) {
				swal('Success', "here buy " + mnzToBuy + "mnz", 'success');
				// HERE MAXIME MAKE THE TRANSFER !
			} else {
				swal('Oops...', "No enought money in your " + this.select + " balance !", 'error')
			}*/
		}
	},
	computed: {
		getBalance() {
			return this.$store.getters.getWalletByTicker(this.select).balance;
		},
		getMnzBalance() {
			return this.$store.getters.getWalletByTicker('MNZ').balance;
		},
		getStringTicket() {
			return this.$store.getters.getWalletByTicker(this.select).coin.name;
		},
		getTotalPrice() {
			return this.totalPrice();
		},
		canBuy() {
			let mnzToBuy = this.package;
			let coin = this.select;
			let balance = this.$store.getters.getWalletByTicker(this.select).balance;

			return this.totalPrice() < balance;
		},
	}
}
</script>

<style>

.row-custom {
	display: flex;
	flex-direction: row;
}

#selector-plus {
	flex-direction: row;
}

.selected-tag {
	position: absolute;
}

.select-coin {
	text-align: center;
}

.card {
	box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
	border-radius: 4px;
	border: none;
}

.center{
	width: 150px;
	margin: 40px auto;
}

.inputmnz {
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {  
	opacity: 1;
}


.disableBuy {
	opacity: 0.65; 
	cursor: not-allowed;
}

.content-buyview {
	padding: 50px;
	padding-bottom: 15px;
	color: rgb(151,151,151);
}

.content-buyview h3 {
	font-weight: 300;
	color: #180d39;
}

.content-buyview h5 {
	font-weight: 300;
	color: #687078;
}

.col-center img {
	vertical-align: text-top;
}

.title-buy-mnz {
	margin: auto;
}

.sub-title {
	font-weight: 300;
	color: #180d39;
}

.col {
	flex-grow: 0;

}
.row {
	margin: 0px;
	display: flex;
	justify-content: space-between;
}

.row-main {
	margin: 0px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
}

.col-custom {
	flex-grow: 1;
}

.div-total-mnz {
	text-align: right;
	color: black;
	font-weight: 500;
	font-size: 0.8em;
}

#total-mnz {
	color: black;
	font-weight: 200;
	font-size: 2.5em;
}

#line-cut {
	flex-grow: 11;
}

#title-crypto-choice {
	margin: auto;
	font-weight: 300;
	color: #180d39;
}

#crypto-title-line {
	margin-top: 23px;
	margin-bottom: 13px;
}

.select-coin-buy {
	justify-content: flex-start;
	flex-direction: row;
	display: flex;
}

.select-coin-buy .dropdown {
	height: 100%;
}

.select-coin-buy .dropdown-toggle {
	height: 100%;
	width: 150px;
}

.dropdown-toggle button {
	visibility: hidden;
}

.dropdown-toggle i {
	visibility: hidden;
}

#buy-mnz-box {
	color: #687078;
	width: 150px;
	height: 75px;
	line-height: 75px;
	text-align: center;
	font-size: 1.8em;
	font-weight: 200;
	background-color: white;
}

.select2-selection {
	width: 126px !important;
}

.row-buy {
	display: flex;
	justify-content: space-between;
}

.arrow-buy {
	width: 100%;
	line-height: 75px;
	text-align: center;
}

#package-mnz {
	margin-left: auto;
	width: 300px;
	height: 40px;
	border: 1px solid rgba(0,0,0, 0.1);
	border-radius: 4px;
	line-height: 40px;
	margin-top: 10px;
	margin-bottom: 15px;
}

#choose-mnz {
	text-align: right;
}

.currency-balance-div {
	width: 100px;
}

.col-center {
	flex-grow: 1;
	text-align: center;
}

.minus-plus {
	color: black;
}

#package-value {
	width: 100px;
	font-size: 1.5em;
	font-weight: 300;
}

.value {
	font-size: 1.5em;
	font-weight: 400;
	color: #180d39;
}

#balance-value {
	font-size: 1.5em;
	font-weight: 200;
	color: #687078;
	margin-top: 10px;
}

#balance-coin {
	font-weight: 300;
	color: #687078;
}

.title-choose-coin {
	font-weight: 500;
}

#choose-coin {
	margin-top: 25px;
}

#detail-order-title {
	color: #180d39;
	font-weight: 400;
	max-width: 150px;
}

.center-text {
	text-align: center;
}

#btn-buy {
	border: 1px solid #7c398a;
	border-radius: 4px !important;
	font-size: 1.4em;
	width: 100px;
	height: 50px;
	text-align: center;
	line-height: 50px;
	outline: none;
	box-shadow: none;
	color: #7c398a;
	max-width: 100px;
}

#btn-buy:hover {
	background-color: #7c398a;
	color: white;
}

.center-horizontal {
	margin: auto;
}

.title-value {
	font-weight: 400;
	color: #7c398a;
	font-size: 0.8em;
}

.content-swapview {
	box-shadow: 0px 15px 40px -20px rgba(33,33,33,0.2) inset;
	background-color: rgba(0,0,0,0.01);
}

#add-coin {
	color: #7c398a !important;
}

.title-amount {
	margin-bottom: 20px;
}

.sub-title {
	font-weight: 300;
	color: #180d39 !important;
}

.select-header{
	flex-grow: 1;
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
	cursor: pointer;
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
	text-align: center;
	padding-top: 20px;
	padding-bottom: 20px;
	cursor: pointer;
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

#buycoins {
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

#buycoins:hover {
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

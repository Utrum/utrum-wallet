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
							{{getMnzBalance***REMOVED******REMOVED*** MNZ
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
						{{getBalance***REMOVED******REMOVED***<span id="balance-coin"> {{select***REMOVED******REMOVED***</span>
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
							{{package***REMOVED******REMOVED***
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
						Total {{getStringTicket***REMOVED******REMOVED***
					</div>
					<div class="value">
						{{getTotalPrice***REMOVED******REMOVED***
					</div>
				</div>
			</div>
			<div class="col-custom center-horizontal">
				<div class="row-main center-text">
					<div class="title-value">
						MNZ
					</div>
					<div class="value">
						{{package***REMOVED******REMOVED***
					</div>
				</div>
			</div>

			<button :disabled="canBuy"  v-b-modal="'confirmBuy'" id="buycoins" class="btn sendcoins" type="button">
				BUY
			</button>
		</div>
		<b-modal @ok="buyMnz()" id="confirmBuy" centered title="Buy confirmation">
			<p class="my-4">Are you sure you want to buy <b>{{package***REMOVED******REMOVED***MNZ</b> for <b>{{getTotalPrice***REMOVED******REMOVED***{{select***REMOVED******REMOVED*** ?</b></p>
		</b-modal>
	</div>
</template>

<script>
import swal from 'sweetalert2';

***REMOVED***
	name: 'buy',
	components: {
		'select2': require('../Utils/Select2.vue').default
	***REMOVED***,
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
		***REMOVED***
	***REMOVED***,
	methods: {
		totalPrice() {
			let price = 0;
			if (this.select === 'BTC') {
				price = 0.00006666;
			***REMOVED*** else if (this.select === 'KMD') {
				price = 0.03333333;
			***REMOVED***
			return (this.package * price).toFixed(8);
		***REMOVED***,
		valueChange(value) {
			this.select = value
		***REMOVED***,
		incrementPackage() {
			if (this.package < this.packageMAX) {
				this.package += this.packageIncrement;
			***REMOVED***
		***REMOVED***,
		decrementPackage() {
			if (this.package > this.packageIncrement) {
				this.package -= this.packageIncrement;
			***REMOVED***
		***REMOVED***,
		buyMnz() {
			swal('Success', "here buy " + this.package + "mnz", 'success');
/*			if (this.totalPrice() < balance) {
				swal('Success', "here buy " + mnzToBuy + "mnz", 'success');
				// HERE MAXIME MAKE THE TRANSFER !
			***REMOVED*** else {
				swal('Oops...', "No enought money in your " + this.select + " balance !", 'error')
			***REMOVED****/
		***REMOVED***
	***REMOVED***,
	computed: {
		getBalance() {
			return this.$store.getters.getWalletByTicker(this.select).balance;
		***REMOVED***,
		getMnzBalance() {
			return this.$store.getters.getWalletByTicker('MNZ').balance;
		***REMOVED***,
		getStringTicket() {
			return this.$store.getters.getWalletByTicker(this.select).coin.name;
		***REMOVED***,
		getTotalPrice() {
			return this.totalPrice();
		***REMOVED***,
		canBuy() {
			let mnzToBuy = this.package;
			let coin = this.select;
			let balance = this.$store.getters.getWalletByTicker(this.select).balance;

			return this.totalPrice() < balance;
		***REMOVED***,
	***REMOVED***
***REMOVED***
</script>

<style scoped>

.row-custom {
	display: flex;
	flex-direction: row;
***REMOVED***

#selector-plus {
	flex-direction: row;
***REMOVED***

.selected-tag {
	position: absolute;
***REMOVED***

.select-coin {
	text-align: center;
***REMOVED***

.center{
	width: 150px;
	margin: 40px auto;
***REMOVED***

.inputmnz {
***REMOVED***

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {  
	opacity: 1;
***REMOVED***


.disableBuy {
	opacity: 0.65; 
	cursor: not-allowed;
***REMOVED***

.content-buyview {
	padding: 50px;
	padding-bottom: 15px;
	color: rgb(151,151,151);
***REMOVED***

.content-buyview h3 {
	font-weight: 300;
	color: #180d39;
***REMOVED***

.content-buyview h5 {
	font-weight: 300;
	color: #687078;
***REMOVED***

.col-center img {
	vertical-align: text-top;
***REMOVED***

.title-buy-mnz {
	margin: auto;
***REMOVED***

.sub-title {
	font-weight: 300;
	color: #180d39;
***REMOVED***

.col {
	flex-grow: 0;
***REMOVED***
.row {
	margin: 0px;
	display: flex;
	justify-content: space-between;
***REMOVED***

.row-main {
	margin: 0px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
***REMOVED***

.col-custom {
	flex-grow: 1;
***REMOVED***

.div-total-mnz {
	text-align: right;
	color: black;
	font-weight: 500;
	font-size: 0.8em;
***REMOVED***

#total-mnz {
	color: black;
	font-weight: 200;
	font-size: 2.5em;
***REMOVED***

#line-cut {
	flex-grow: 11;
***REMOVED***

#title-crypto-choice {
	margin: auto;
	font-weight: 300;
	color: #180d39;
***REMOVED***

#crypto-title-line {
	margin-top: 23px;
	margin-bottom: 13px;
***REMOVED***

.select-coin-buy {
	justify-content: flex-start;
	flex-direction: row;
	display: flex;
***REMOVED***

.select-coin-buy .dropdown {
	height: 100%;
***REMOVED***

.select-coin-buy .dropdown-toggle {
	height: 100%;
	width: 150px;
***REMOVED***

.dropdown-toggle button {
	visibility: hidden;
***REMOVED***

.dropdown-toggle i {
	visibility: hidden;
***REMOVED***

#buy-mnz-box {
	color: #687078;
	width: 150px;
	height: 75px;
	line-height: 75px;
	text-align: center;
	font-size: 1.8em;
	font-weight: 200;
	background-color: white;
***REMOVED***

.select2-selection {
	width: 126px !important;
***REMOVED***

.row-buy {
	display: flex;
	justify-content: space-between;
***REMOVED***

.arrow-buy {
	width: 100%;
	line-height: 75px;
	text-align: center;
***REMOVED***

#package-mnz {
	margin-left: auto;
	width: 300px;
	height: 40px;
	border: 1px solid rgba(0,0,0, 0.1);
	border-radius: 4px;
	line-height: 40px;
	margin-top: 10px;
	margin-bottom: 15px;
***REMOVED***

#choose-mnz {
	text-align: right;
***REMOVED***

.currency-balance-div {
	width: 100px;
***REMOVED***

.col-center {
	flex-grow: 1;
	text-align: center;
***REMOVED***

.minus-plus {
	color: black;
***REMOVED***

#package-value {
	width: 100px;
	font-size: 1.5em;
	font-weight: 300;
***REMOVED***

.value {
	font-size: 1.5em;
	font-weight: 400;
	color: #180d39;
***REMOVED***

#balance-value {
	font-size: 1.5em;
	font-weight: 200;
	color: #687078;
	margin-top: 10px;
***REMOVED***

#balance-coin {
	font-weight: 300;
	color: #687078;
***REMOVED***

.title-choose-coin {
	font-weight: 500;
***REMOVED***

#choose-coin {
	margin-top: 25px;
***REMOVED***

#detail-order-title {
	color: #180d39;
	font-weight: 400;
	max-width: 150px;
***REMOVED***

.center-text {
	text-align: center;
***REMOVED***

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
***REMOVED***

#btn-buy:hover {
	background-color: #7c398a;
	color: white;
***REMOVED***

.center-horizontal {
	margin: auto;
***REMOVED***

.title-value {
	font-weight: 400;
	color: #7c398a;
	font-size: 0.8em;
***REMOVED***

.content-swapview {
	box-shadow: 0px 15px 40px -20px rgba(33,33,33,0.2) inset;
	background-color: rgba(0,0,0,0.01);
***REMOVED***

#add-coin {
	color: #7c398a !important;
***REMOVED***

.title-amount {
	margin-bottom: 20px;
***REMOVED***

.sub-title {
	font-weight: 300;
	color: #180d39 !important;
***REMOVED***

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
***REMOVED***

.select-header:hover{
	background-color: black;
	color: white;
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
	cursor: pointer;
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
	text-align: center;
	padding-top: 20px;
	padding-bottom: 20px;
	cursor: pointer;
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
***REMOVED***

#buycoins:hover {
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

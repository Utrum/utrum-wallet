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
							totalMNZ MNZ
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
							<select2 :options="listData" :value="select"></select2>
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
						balance<span id="balance-coin"> currentcoin</span>
					</div>
				</div>
			</div>
			<div class="col-custom">
				<div id="choose-mnz" class="row-main">
					<div class="sub-title">
						CHOOSE HOW MANY MNZ YOU WANT TO BUY
					</div>
					<div id="package-mnz" class="row">
						<a id="less-mnz" href="#" class="col-center">
							<img src="@/assets/icon-less.svg"/>
						</a>
						<div id="package-value" class="col-center">
							packageValue
						</div>
						<a id="more-mnz" href="#" class="col-center">
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
						Total currentcoin
					</div>
					<div class="value">
						totalPrice
					</div>
				</div>
			</div>
			<div class="col-custom center-horizontal">
				<div class="row-main center-text">
					<div class="title-value">
						MNZ
					</div>
					<div class="value">
						packageValue
					</div>
				</div>
			</div>
<!-- 			{{#if isBuying***REMOVED******REMOVED***
			<div class="col">
				{{> loader***REMOVED******REMOVED***
			</div>
			{{else***REMOVED******REMOVED*** -->
			<div id="btn-buy" class="btn col-custom center-horizontal">
				BUY
			</div>
			<!-- {{/if***REMOVED******REMOVED*** -->
		</div>
	</div>
<!-- 	<div class="content-swapview">
		{{> swapstatusview***REMOVED******REMOVED***
	</div> -->
</template>

<script>
***REMOVED***
	name: 'buy',
	components: {
		'select2': require('../Utils/Select2.vue').default
	***REMOVED***,
	data() {
		return {
			listData: [
			'BTC',
			'KMD',
			'LTC',
			'DASH',
			'BCC'
			],
			select: 'BTC',
		***REMOVED***
	***REMOVED***
***REMOVED***
</script>

<style>

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

.select-header {
	flex-grow: 1;
***REMOVED***

.card {
	box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
	border-radius: 4px;
	border: none;
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

.select-coin-buy .form-control {
/*	width: 150px;
height: 75px;*/
***REMOVED***

.select-coin-buy .dropdown-toggle {
	height: 100%;
	width: 150px;
/*	width: 150px;
height: 75px;*/
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

.select2-results__options {
	overflow:hidden; 
	overflow-y:scroll;

***REMOVED***

.select2-selection {
	height: 75px !important;
	width: 126px;
		outline: none;
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
	width: 151px !important;
	margin-left: -25px !important;
***REMOVED***

.select2-search__field {
	outline: none;
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

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
			<div class="row-buy">
				<div class="col-custom">
					<div class="row select-coin-buy">
						<div class="btn select-all">
							<p id="add-coin">+</p>
						</div>
						<select id="select-coin" class="select-header">
							<option>MNZ</option>
							<option>BTC</option>

<!-- 							{{#each categories***REMOVED******REMOVED***
							<option>{{this***REMOVED******REMOVED***</option>
							{{/each***REMOVED******REMOVED*** -->
						</select>
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
	name: 'buy'
***REMOVED***
</script>

<style>
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
	justify-content: flex-start !important;
	width: 150px;
	height: 100%;
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
</style>

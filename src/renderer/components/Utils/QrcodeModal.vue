<template>
	<b-modal size="sm" ref="qrcodemodal" :id="wallet.ticker" centered class="modal-qrcode">
		<div slot="modal-header" class="w-100">
			<a @click="hideModal" class="row" data-dismiss="modal">Close<img src="@/assets/icon-close.svg"></a>
		</div>

		<b-container fluid>
			<div class="row-modal">
				<div class="col-modal">
					<qriously :value="wallet.address" :size="200" />
				</div>
			</div>
			<span id="qrcode-title">QR CODE {{wallet.ticker***REMOVED******REMOVED***</span>
		</b-container>
		<div slot="modal-footer" class="w-100">
			<explorer class="btn btn-copy-link btn-smartaddress" type="address" :ticker="wallet.ticker" :value="wallet.address">
				<div :id="wallet.ticker" class="btn-inside-qrcode">
					{{wallet.address***REMOVED******REMOVED***
				</div>
			</explorer>
		</div>
	</b-modal>
</template>

<script>
***REMOVED***
	name: 'qrcode-modal',
	components: {
		'explorer': require('@/components/Utils/ExplorerLink').default,
		'qrcode-modal' : require('@/components/Utils/QrcodeModal').default
	***REMOVED***,
	props: {
		wallet: {
			type: Object,
			default: () => ({***REMOVED***)
		***REMOVED***,
	***REMOVED***,
	data () {
		return {
			headerBgVariant: 'none',
		***REMOVED***
	***REMOVED***,
	methods: {
		hideModal () {
			this.$refs.qrcodemodal.hide()
		***REMOVED***
	***REMOVED***,
	computed: {

	***REMOVED***
***REMOVED***
</script>

<style scoped>
.modal-header a:hover {
	opacity: 0.5;
	-webkit-transition: all 1s ease;
	cursor: pointer;
***REMOVED***
.modal-qrcode {
	text-align: center;
***REMOVED***

.vertical-alignment-helper {
	display:table;
	margin: auto;
	height: 100%;
	width: 100%;
	pointer-events:none; /* This makes sure that we can still click outside of the modal to close it */
***REMOVED***
.vertical-align-center {
	/* To center vertically */
	display: table-cell;
	vertical-align: middle;
	pointer-events:none;
***REMOVED***
.modal-content {
	/* Bootstrap sets the size of the modal in the modal-dialog class, we need to inherit it */
	width:inherit;
	max-width:inherit; /* For Bootstrap 4 - to avoid the modal window stretching full width */
	height:inherit;
	/* To center horizontally */
	margin: 0 auto;
	pointer-events: all;
***REMOVED***

.row-modal {
	display: flex;
	flex-direction: row-reverse;
	justify-content: center;
	align-items: center;
***REMOVED***

.col-modal {
	flex-grow: 1;
***REMOVED***



.modal-header a {
	color: #7c398a;
***REMOVED***

.modal-header .row {
	justify-content: center;
***REMOVED***

.modal-header .glyphicon-remove {
	padding-top: 2px;
	padding-left: 5px;
***REMOVED***

.modal-body {
	text-align: center;
	padding: 25px;
	padding-top: 0px;
***REMOVED***

.modal-body .row-modal {
	margin-bottom: 15px;
***REMOVED***

#qrcode-title {
	margin-top: 30px;
	color: #687078;
	font-weight: 400;
***REMOVED***
</style>

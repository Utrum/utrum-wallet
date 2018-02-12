<template>
	<div>
		<div class="content-createpassphrase row-main-item">
			<div v-on:click="backArrow" v-if="(step2 || step3)" id="back-arrow" class="row-custom">
				<img src="@/assets/icon-back.svg">
				<p>Back</p>
			</div>

			<img id="icon-login" src="@/assets/icon-login-monaize.svg" height="60" class="col-custom">
			<h3 class="col-custom">CREATE PASSPHRASE</h3>
			<div v-if="step1" class="col-custom">
				<p>
					Your Backup Phrase is used to gain access to and restore funds in your Monaize ICO Platform wallet.
				</p>
				<p>
					On the next screen, you will see a set of 24 random words which you will need to write down using a pen and paper. Please keep this Backup Phrase in a secure location and do not share it with anyone who sould not be authorized to access your funds.
				</p>
				<p>
				By creating your Backup phrase you acknowledge that Monaize Pte. Ltd. Singapore is not responsible for transferring, safeguarding, or maintaining the Backup Phrase and/or Digital Currency associated with the Wallet.</p>	
			</div>
			<div v-if="step2" class="col-custom">
				<p>
					Please write down the set of words below in the exact sequence. You will be asked to re-enter your Backup Phrase on the next screen in order to ensure accuracy.
				</p>
				<div class="passphrase-generated">
					{{getRandomPassphrase()}}
				</div>
			</div>
			<div v-if="step3" class="row-main-item">
				<p class="col-custom">Please enter your 24-word Backup Phrase to ensure you have written it down correctly. 
				</p>
				<textarea v-on:keyup="checkPassphrase" v-model="passphraseValue" onblur="this.placeholder = 'Please enter your passphrase'" onfocus="this.placeholder = ''" placeholder="Please enter your passphrase" cols="40" rows="3" id="create-passphrase-input" class="col-custom" type="text" name="input-login" onCopy="return false" onDrag="return false" onDrop="return false" autocomplete=off
				></textarea>
			</div>
		</div>
		<div class="footer">
			<div class="row-custom">
				<div v-if="step1">
					<button v-on:click="cancelCreate" id="btn-not-now" class="col-custom btn-round-light">
						Not now
					</button>
					<button v-on:click="generatePassphrase" id="generate-passphrase" class="col-custom btn-round-purple">
						Generate passphrase
					</button>
				</div>
				<button v-on:click="continueCreate" v-if="step2" id="btn-continue" class="col-custom btn-round-light">
					<div class="row-custom">
						<p class="col-custom">Continue</p>
						<img class="col-custom" src="@/assets/icon-continue.svg">
					</div>
				</button>
				<button :class="disabledBtn" v-if="step3" @click.prevent="validatePassPhrase()" id="btn-confirm" class="col-custom btn-round-light" type="button">
					Confirm
				</button>
			</div>
		</div>
	</div>
</template>


<script>
import bip39 from 'bip39'

export default {
	name: "create-passphrase",
	data() {
		return {
			step1: true,
			step2: false,
			step3: false,
			passphraseGenerated: "",
			isConfirmed: false,
			passphraseValue: ''
		}
	},
	computed: {
		disabledBtn() {
			return this.isConfirmed ? '' : 'disabledBtn';
		}
	},
	mounted() {
		this.passphraseGenerated = bip39.generateMnemonic(256);
	},
	methods: {
		getRandomPassphrase() {
			return this.passphraseGenerated;
		},

		cancelCreate() {
			this.$router.push("/login-form");
		},
		generatePassphrase() {
			this.passphraseGenerated = bip39.generateMnemonic(256);
			this.step1 = false;
			this.step2 = true;
			this.step3 = false;
		},
		continueCreate() {
			this.step1 = false;
			this.step2 = false;
			this.step3 = true;			
		},
		backArrow() {
			if (this.step1) {
				this.$router.push("/login-form");
			} else if (this.step2) {
				this.step1 = true;
				this.step2 = false;
				this.step3 = false;	
			} else if (this.step3) {
				this.step1 = false;
				this.step2 = true;
				this.step3 = false;
			}
		},
		checkPassphrase() {
			this.isConfirmed = (this.passphraseGenerated === this.passphraseValue);
		},
		validatePassPhrase() {
			console.log(this.passphraseValue);
			if(this.passphraseValue) {
				this.$store.dispatch("login", this.passphraseValue)
				this.$router.push('/wallet')
			}
		},
	}
}
</script>

<style scoped>

.content-createpassphrase {
	align-items: center;
	padding-left: 50px;
	padding-right: 50px;
}

.input-createpassphrase .row-main-item {
	margin: none;
}

.content-createpassphrase span {
	margin-top: 35px;
	color: #180d39;
	font-size: 1.5em;
}

.content-createpassphrase h3 {
	text-align: center;
	margin-bottom: 40px;
	margin-top: 40px;
}

.content-createpassphrase p {
	text-align: center;
	margin:auto;
	width:80%;
	padding-bottom: 20px;
	-ms-text-align-last: center;
	-moz-text-align-last: center;
	text-align-last: center;
}

.content-createpassphrase p:last-child {
	-ms-text-align-last: center;
	-moz-text-align-last: center;
	text-align-last: center;
}

.footer {
	position: fixed;
	background-color: rgb(250,250,250);
	padding: 70px;
	padding-left: 100px;
	padding-right: 100px;
	bottom: 0;
	left: 0;
	right: 0;
}

.footer .row {
	justify-content: center;
}

#btn-not-now {
	margin-right: 20px;
}

#generate-passphrase {
	margin-left: 20px;
}

.btn-round-purple {
	min-height: 50px;
	min-width: 210px;
	width: 210px;
	font-weight: 500;
	outline: none;
	border: none;
	color: white;
	background-color: #7c398a;
	border-radius: 50px;
	padding: 10px;
	padding-right: 15px;
	padding-left: 15px;
	cursor: pointer;
}

.passphrase-generated {
	border: 2px solid rgba(24,13,57,0.1);
	font-size: 1.2em;
	text-align: center;
	border-radius: 4px;
	font-weight: 400;
	color: #687078;
	padding: 15px;
	margin-left: auto;
	margin-right: auto;
	width: 80%;
}

#btn-continue {
	min-height: 50px;
	max-height: 50px;
	padding: 0px;
}

#btn-continue p {
	font-weight: 400;
	color: #180d39;
	margin-top: auto;
	margin-bottom: auto;
	padding-left: 45px;
}

#create-passphrase-input {
	border: 2px solid rgba(24,13,57,0.1);
	font-size: 1.2em;
	outline: none;
	text-align: center;
	border-radius: 4px;
	font-weight: 400;
	color: #687078;
	padding: 15px;
	margin-left: auto;
	margin-right: auto;
	width: 80%;
}

.disabledBtn {
	cursor: not-allowed;
	color: rgba(0,0,0,0.1);
	border: 2px solid rgba(24,13,57,0.1);
}

#back-arrow {
	position: fixed;
	top: 40px;
	left: 140px;
	cursor: pointer;
}

#back-arrow p {
	color: #7c398a;
	font-weight: 400;
	margin-top: auto;
	margin-bottom: auto;
	padding-left: 15px;
	padding-bottom: 5px;
}

#back-arrow img {
	align-self: flex-start;
}

.row-main-item {
	flex-direction: column;
	justify-content: center;
}

.row-custom { 
	margin: 0px;
	display: flex;
	justify-content: center;
}

.col-custom {
	flex-grow: 1;
}

.btn-round-light {
	min-width: 210px;
	max-width: 210px;
	width: 210px;
	outline: none;
}

</style>

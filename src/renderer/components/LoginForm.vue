<template>
	<div class="content-login row-main-item">
		<img id="icon-login" src="~@/assets/icon-login-monaize.svg" height="60" class="col">
		<span class="col">DECENTRALIZED ICO PLATFORM</span>
		<div class="col input-login">
			<div class="row">
				<form id="login" class="row login" method="POST" enctype="multipart/form-data">
					<textarea v-model="passphrase" onblur="this.placeholder = 'Please enter your passphrase'" onfocus="this.placeholder = ''" placeholder="Please enter your passphrase" cols="40" rows="3" id="passphrase" class="col" type="text" name="input-login"></textarea>
					<button @click.prevent="validatePassPhrase()" :class="btnSendStatus" class="btn-send-enabled"><img src="~@/assets/icon-send-login.svg"></button>
				</form>
			</div>
		</div>
		<button id="create-passphrase" class="btn-round-light">Don't have a passphrase?</button>
		<img class="col" id="login-background" src="~@/assets/img-login.svg">
	</div>
</template>

<script>
export default {
	name: 'login-form',
	data() {
		return {
			passphrase: '',
			btnSendStatus: 'btn-send-enabled',
		}
	},
	methods: {
		validatePassPhrase() {
			console.log(this.passphrase)
			if(this.passphrase) {
				this.$store.dispatch("login", passphrase)
				this.$router.push('/wallet')
			}
		}
	}
}
</script>

<style scoped>

#login-background {
	width: 100%;
	position: absolute;
	bottom:0px;
	z-index: -1;
}

.input-login .row {
	align-items: center;
	justify-content: center;
	width: 100%;
}

.btn-send-enabled {
	padding: 10px;
	margin-right: 30px;
	background-color: white;
	border-radius: 100%;
	border: none !important;
	outline: none;
	box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
	height: 100%;
	margin-top: auto;
	margin-bottom: auto;

}

.btn-send-enabled img {
	vertical-align: top;
	opacity: 1;
	transition: opacity 0.5s;
}

#icon-login {
	margin-top: 10px;
	max-height: 70px;
	text-align: center;
}

.content-login {
	align-items: center;
	text-align: center;
	height: 60vh;
}

.input-login .row-main-item {
	margin: none;
}

.content-login span {
	margin-top: 35px;
	color: #180d39;
	font-size: 1.5em;
}

.input-login {
	border: 1px solid rgba(24,13,57,0.1);
	border-radius: 4px;
	width: 600px;
	max-height: 200px;
	background-color: rgb(250,250,250);
	margin-bottom: 35px;
	padding: 15px;
}

.middle {
	vertical-align: middle;
}

.btn-send-enabled {
	padding: 10px;
	margin-right: 30px;
	background-color: white;
	border-radius: 100%;
	border: none !important;
	outline: none;
	box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
	height: 100%;
	margin-top: auto;
	margin-bottom: auto;

}

.btn-send-enabled img {
	vertical-align: top;
	opacity: 1;
	transition: opacity 0.5s;
}

.btn-send-disabled {
	padding: 10px;
	margin-right: 30px;
	background-color: white;
	border-radius: 100%;
	border: none !important;
	outline: none;
	box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
	height: 100%;
	margin-top: auto;
	margin-bottom: auto;
	cursor: not-allowed;
	pointer-events: none;
}

.btn-send-disabled img {
	vertical-align: top;
	opacity: 0.1;
	transition: opacity 0.5s;
}

#passphrase {
	width: 100%;
	text-align: center;
	border: none !important;
	outline: none;
	background-color: transparent;
}

#passphrase::-webkit-input-placeholder {
	text-align: center;
	font-weight: 400;
	font-size: 1.3em;
	color: rgba(0,0,0,0.5);
}

textarea {
	resize: none;
}

.btn-round-light {
	min-height: 50px;
	font-weight: 500;
	outline: none;
	border: 3px solid rgba(24,13,57,0.1);
	background-color: rgb(250,250,250);
	border-radius: 50px;
	padding: 10px;
	padding-right: 15px;
	padding-left: 15px;
}

.row-main-item {
	display: flex;
	flex-direction: column;
	margin-top: 20px;
	margin-bottom: 20px;
}

.col {
	flex-grow: 1;
}

.row {
	margin: 0px;
	display: flex;
	justify-content: space-between;
}

</style>

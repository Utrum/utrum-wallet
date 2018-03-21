export default {
	name: 'login-form',
	data() {
		return {
			passphrase: '',
			btnSendStatus: 'btn-send-enabled',
		}
	},
	created () {
		this.testMode = this.$store.getters.isTestMode
	},
	methods: {
		checkboxTestMode() {
			this.testMode = this.testMode == true ? true : false
			this.$store.dispatch("setTestMode", this.testMode)
		},
		validatePassPhrase() {
			if(this.passphrase) {
				this.$store.dispatch("login", this.passphrase)
				this.$router.push('/wallet')
			}
		},
		createPassphrase() {
			this.$router.push('/createpassphrase');
		}

	}
}
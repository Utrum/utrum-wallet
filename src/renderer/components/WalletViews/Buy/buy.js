import swal from 'sweetalert2';
import index from 'vue';
import Wallet from 'libwallet-mnz'
import sb from 'satoshi-bitcoin'
import Vue from 'vue'

export default {
	name: 'buy',
	components: {
		'select2': require('@/components/Utils/Select2.vue').default,
		'select-awesome': require('@/components/Utils/SelectAwesome.vue').default,
	},
	data() {
		return {
			searchable: false,
			currentBonus: 0,
			blocks: 1,
			fee: 0,
			feeSpeed: 'veryFast',
			fees: [
				{ id: 0, label: 'Very fast', blocks: 1, value: 'veryFast' },
				{ id: 1, label: 'Fast', blocks: 6, value: 'fast' },
				{ id: 2, label: 'Low', blocks: 36, value: 'low' },
			],
			selectedFee: null,
			listData: [
				'BTC',
				'KMD'
			],
			select : 'BTC',
			packageMNZ: 100000000000,
			packageIncrement: 50000000000,
		}
	},
	mounted() {
		this.selectFee = this.fees[0].label;
	},
	methods: {
		numberWithSpaces(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    },
		onChangeFee() {
			console.log(this.selectedFee.blocks);
		},
		hideModal() {
			this.$refs.confirmBuy.hide()
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
		buyMnzModal () {
			let bonus = this.isBonus;
			if (this.select !== 'KMD')
				this.callEstimateFee(this.fees[0].blocks);
			else
				this.fee = 0.0001;
		},
		onChange (value) {
			if (this.select !== 'KMD')
				this.callEstimateFee(value.blocks);
			else
				this.fee = 0.0001;
    },
		methodToRunOnSelect(payload) {
			this.object = payload;
		},
		totalPrice() {
			let config = this.getConfig;
			let price = 0;
			let priceMNZ = config.BTCPrices.MNZ;
			let priceKMD = config.BTCPrices.KMD;
			if (this.select === 'BTC') {
				price = priceMNZ;
			} else if (this.select === 'KMD') {
				price = sb.toSatoshi(priceMNZ/priceKMD);
			}
			return sb.toBitcoin(sb.toBitcoin(Number(this.packageMNZ)) * price);
		},
		valueChange(value) {
			this.select = value
		},
		incrementPackage() {
			if (this.packageMNZ <= this.getMaxBuy - this.packageIncrement) {
				this.packageMNZ += this.packageIncrement;
			}
		},
		decrementPackage() {
			if (this.packageMNZ > this.getMinBuy) {
				this.packageMNZ -= this.packageIncrement;
			}
		},
		buyMnz() {
			this.hideModal();
			var self = this
			this.$http.post('http://localhost:8000', {
				ticker: this.select,
				test: self.$store.getters.isTestMode,
				method: 'blockchain.address.listunspent',
				params: [ this.wallet.address ]
			}).then(response => {
				console.log(response)
				let wallet = new Wallet(self.wallet.privkey, self.wallet.coin, self.$store.getters.isTestMode)
				wallet.ticker = this.select;
				let tx = wallet.prepareTx(response.data, 'RCzjiCPntvpujtn4fmi9Uw4M6ZA1vrtgLJ', sb.toSatoshi(self.getTotalPrice, self.fee))
				self.$http.post('http://localhost:8000', {
					ticker: this.select,
					test: self.$store.getters.isTestMode,
					method: 'blockchain.transaction.broadcast',
					params: [ tx ]
				}).then((response) => {
					self.$swal(`Transaction sent`, response.data, 'success')
				})
			})
		}
	},
	watch: {
    packageMNZ: function (newValue, oldValue) {
			let value = Number(newValue);

			if (value <= this.getMaxBuy - this.packageIncrement) {
				this.packageMNZ = value;
			} else {
				this.packageMNZ = this.getMaxBuy;
			}
			if (value <= 0) {
				this.packageMNZ = 0;
			}
    }
  },
	computed: {
		getPackage: {
			// getter
			get: function () {
				return sb.toBitcoin(this.packageMNZ);
			},
			// setter
			set: function (newValue) {
				let value = sb.toSatoshi(newValue);

				if (value >= this.getMaxBuy) {
					this.packageMNZ = this.getMaxBuy;
				} else if (value <= this.getMinBuy || value <= 0) {
					this.packageMNZ = this.getMinBuy;
				} else {
					this.packageMNZ = value;
				}
			}
		},
		getMinBuy() {
			return this.$store.getters.getConfig.minBuy
		},
		getMaxBuy() {
			return this.$store.getters.getConfig.maxBuy
		},
		getConfig() {
			return this.$store.getters.getConfig;	
		},
		wallet() {
			return this.$store.getters.getWalletByTicker(this.select)
		},
		getBalance() {
			return this.numberWithSpaces(this.$store.getters.getWalletByTicker(this.select).balance.toFixed(8));
		},
		getMnzBalance() {
			return this.numberWithSpaces(this.$store.getters.getWalletByTicker('MNZ').balance);
		},
		getStringTicket() {
			return this.$store.getters.getWalletByTicker(this.select).coin.name;
		},
		getTotalPrice() {
			return this.totalPrice();
		},
		getTotalPriceWithFee() {
			return this.numberWithSpaces((this.getTotalPrice + this.fee).toFixed(8))
		},
		isBonus() {
			let date = new Date().getTime();
			let bonuses = this.$store.getters.getConfig.bonuses;
			
			for (var k in bonuses) {
        if (bonuses.hasOwnProperty(k)) {
					 if (this.select === k) {
						for (var j in bonuses[k]) {
							if (bonuses[k].hasOwnProperty(j)) {
								let dateBonusStart = bonuses[k][j][0];
								let dateBonusEnd = bonuses[k][j][1];

								if (dateBonusStart < date && date < dateBonusEnd) {
									this.currentBonus = j / 100;
								} else {
									this.currentBonus = 0;
								}
							}
						}
					 }
        }
			}
			
			if (this.currentBonus == 0) {
				return false;
			} else {
				return true;
			}
		},
		canBuy() {
			let mnzToBuy = this.packageMNZ;
			let coin = this.select;
			let balance = this.$store.getters.getWalletByTicker(this.select).balance;

			if (mnzToBuy <= 0)
				return true;
			if (this.totalPrice() > balance)
				return true;
			return false;
		},
	}
}
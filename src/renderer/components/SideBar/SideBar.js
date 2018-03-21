import swal from 'sweetalert2';

export default {
	name: 'sidebar',
	data() {
		return {
			balanceState: true,
			buyMnzState: false,
			withdrawalState: false,
		}
	},
	computed: {
		getCanBuy() {
			let config = this.$store.getters.getConfig;
			let date = Date();
			if (!(config.progress <= 1 && config.icoBegin > date && date < config.icoEnd)) {
				return true;
			} else {
				this.$swal(`Monaize ICO`, "The Monaize ICO is now over. We would like to thank our loyal MNZ token holders for their participation.", 'info')
				return false;
			}
		},
	},
	methods: {
		balanceClicked() {
			console.log("test");
			this.balanceState = true;
			this.buyMnzState = false;
			this.withdrawalState = false;
		},
		buyMnzClicked() {
			this.balanceState = false;
			this.buyMnzState = true;
			this.withdrawalState = false;
		},
		withdrawalClicked() {
			this.balanceState = false;
			this.buyMnzState = false;
			this.withdrawalState = true;
		}
	}
}
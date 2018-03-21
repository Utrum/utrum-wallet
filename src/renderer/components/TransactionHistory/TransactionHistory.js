import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';

const sb = require('satoshi-bitcoin')
const moment = require('moment');

export default {
    name: 'transaction-history',
    props: ['fromTokenSale', 'coin'],
    data() {
        return {
            sortBy: "time",
            sortDesc: true,
        }
    },
    components: {
        'explorer': ExplorerLink,
    },
    methods: {
		satoshiToBitcoin(amount) {
			return sb.toBitcoin(amount)
		},
		getColorAmount(amount) {
			if (amount > 0) {
				return "positiveColor"
			} else {
				return "negativeColor"
			}
        },
        dateFormat(value) {
            const blockchainDateUtc = moment.utc(value*1000);
            let dateString = moment(blockchainDateUtc).local().format("hh:mm A DD/MM/YYYY");
            return dateString;  
        },
        getIconFromTicker(value) {
            return require('@/assets/icon-' + value + '.svg');
        },
        getPrice(value) {
            let amountMnz = value.item.amount;
            let amountOrigin = 0;

            let txOrigin = this.$store.getters.getWalletTxs(value.item.origin.ticker).filter(el => value.item.origin.txHash === el.tx_hash.substring(0, 9));
            amountOrigin = txOrigin[0].amount;

            return Math.abs(amountOrigin / amountMnz);
        },
        getTotalPrice(value) {
            let amountOrigin = 0;

            let txOrigin = this.$store.getters.getWalletTxs(value.item.origin.ticker).filter(el => value.item.origin.txHash === el.tx_hash.substring(0, 9));
            amountOrigin = txOrigin[0].amount;

            return Math.abs(sb.toBitcoin(amountOrigin));
        },
        getStatus(value) {
            if (value == 0 || value == -1) {
                return "Pending"
            } else {
                return "Done"
            }
        }
    },
	mounted() {
        this.$store.dispatch('buildTxHistory', this.wallet)
	},
    computed: {
        wallet() {
			return this.$store.getters.getWalletByTicker(this.coin.ticker)
		},
		txHistory() {
            if (this.fromTokenSale) {
                return this.$store.getters.getWalletTxs('MNZ').filter(el => el.fromMNZ).filter(el => el.origin.ticker == this.coin.ticker);
            } else {
			    return this.$store.getters.getWalletTxs(this.coin.ticker)
            }
		},
        fields()  {
            if (this.fromTokenSale) {
                return [
                    {
                        key: 'time',
                        label: 'Date / Hours',
                        sortable: true,
                    },
                    {
                        key: 'origin',
                        label: `Type`,
                        sortable: true
                    },
                    {
                        key: 'amount',
                        label: `Amount (MNZ)`,
                        sortable: true
                    },
                    {
                        key: 'origin.txHash',
                        label: `Price`,
                        sortable: true
                    },
                    {
                        key: 'item',
                        label: `Total`,
                        sortable: true
                    },
                    {
                        key: 'height',
                        label: `Status`,
                        sortable: true
                    },
                ]
            } else {
                return [
                {
                    key: 'height',
                    label: 'Block Height',
                    sortable: true,
                },
                {
                    key: 'amount',
                    label: `Amount (${this.coin.ticker})`,
                    sortable: true
                },
            ]
            }
			
        },
    }
}
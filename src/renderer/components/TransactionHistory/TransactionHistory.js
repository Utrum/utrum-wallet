import ExplorerLink from '@/components/Utils/ExplorerLink/ExplorerLink.vue';

const sb = require('satoshi-bitcoin')

export default {
    name: 'transaction-history',
    props: ['value', 'select'],
    data() {
        return {
            sortBy: "height",
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
    },
	mounted() {
		this.$store.dispatch('buildTxHistory', this.value)
	},
    computed: {
		txHistory() {
			return this.$store.getters.getWalletTxs(this.select)
		},
        fields()  {
			return [
				{
                    key: 'height',
                    label: 'Block Height',
                    sortable: true,
				},
				{
                    key: 'tx_hash',
                    label: 'Tx Hash',
                    sortable: true
				},
				{
                    key: 'amount',
                    label: `Amount (${this.select})`,
                    sortable: true
				}
			]
		},
    }
}
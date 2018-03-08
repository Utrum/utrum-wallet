<template>
    <div>
        <b-table id="txTable" thead-tr-class="theadTrClass" tbody-tr-class="theadClass" tbody-class="cardTable" thead-class="theadClass" hover :sort-desc.sync="sortDesc" :sort-by.sync="sortBy" :fields="fields" :items="txHistory">
                <template slot="origin" slot-scope="row">
                    <span>{{row.value.ticker}}</span>
                </template>
                <template slot="amount" slot-scope="row">
                    <div :class="getColorAmount(row.value)">
                        <span v-if="satoshiToBitcoin(row.value) > 0">+</span>
                        <span v-else>-</span>
                        {{satoshiToBitcoin(Math.abs(row.value))}}
                    </div>
                </template>
        </b-table>
    </div>
</template>

<script>
var sb = require('satoshi-bitcoin')

export default {
    name: 'transaction-history',
    props: ['fromTokenSale', 'coin'],
    data() {
        return {
            sortBy: "height",
            sortDesc: true,
        }
    },
    components: {
        'explorer': require('@/components/Utils/ExplorerLink').default,
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
                        key: 'height',
                        label: 'Block Height',
                        sortable: true,
                    },
                    {
                        key: 'origin',
                        label: `ticker`,
                        sortable: true
                    },
                    {
                        key: 'amount',
                        label: `Amount (MNZ)`,
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
</script>

<style>
.table thead th {
    border: none;
    font-weight: 300;
    color: #180d39;
    outline: none !important;
    cursor: pointer;
    -webkit-user-select: none;  /* Chrome all / Safari all */
	-moz-user-select: none;     /* Firefox all */
	-ms-user-select: none;      /* IE 10+ */
	user-select: none;          /* Likely future */   
}

.theadClass {
    border: none !important;
    text-align: center;
}

.cardTable {
    box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
    border-radius: 4px;
    border: none;
}

</style>

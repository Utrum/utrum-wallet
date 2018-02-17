<template>
    <div>
        <h3 id="title">TRANSACTIONS</h3>
        <b-table id="txTable" thead-tr-class="theadTrClass" tbody-tr-class="theadClass" tbody-class="cardTable" thead-class="theadClass" hover :sort-desc.sync="sortDesc" :sort-by.sync="sortBy" :fields="fields" :items="txHistory">
                <template slot="tx_hash" slot-scope="row">
                    <explorer type="tx" :ticker="value.ticker" :value="row.value"></explorer
                ></template>
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
    props: ['value', 'select'],
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
</script>

<style>
.content h3 {
	font-weight: 300;
    opacity: 0.5;
	color: #180d39;
    text-align: center;
}

.positiveColor {
	color: #7d2b8e;
    
}

.negativeColor {
	color: #95989c;
}

.table thead th {
    border: none;
    font-weight: 300;
    color: #180d39;
    outline: none;
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

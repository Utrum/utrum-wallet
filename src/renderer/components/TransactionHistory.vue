<template>
    <div>
        <b-table v-if="fromTokenSale" id="txTable" thead-tr-class="theadTrClass" tbody-tr-class="theadClass" tbody-class="cardTable" thead-class="theadClass" hover :sort-desc.sync="sortDesc" :sort-by.sync="sortBy" :fields="fields" :items="txHistory">
            <template slot="time" slot-scope="row">
                <span>{{dateFormat(row.value)}}</span>
            </template>
            <template slot="origin" slot-scope="row">
                <img :src="getIconFromTicker(row.value.ticker)" alt="iconTicker">
            </template>
            <template slot="amount" slot-scope="row">
                <div :class="getColorAmount(row.value)" v-if="!fromTokenSale">
                    <span v-if="satoshiToBitcoin(row.value) > 0">+</span>
                    <span v-else>-</span>
                    {{satoshiToBitcoin(Math.abs(row.value))}}
                </div>
                <div v-else>{{satoshiToBitcoin(Math.abs(row.value))}}</div>
            </template>
            <template slot="origin.txHash" slot-scope="row">
                <div id="price">
                    {{getPrice(row)}} {{row.item.origin.ticker}}
                </div>
            </template>
            <template slot="item" slot-scope="row">
                <div id="totalPrice">
                    {{getTotalPrice(row)}} {{row.item.origin.ticker}}
                </div>
            </template>
            <template slot="height" slot-scope="row">
                <span id="status">{{getStatus(row.value)}}</span>
            </template>
        </b-table>

        <b-table v-else id="txTable" thead-tr-class="theadTrClass" tbody-tr-class="theadClass" tbody-class="cardTable" thead-class="theadClass" hover :sort-desc.sync="sortDesc" :sort-by.sync="sortBy" :fields="fields" :items="txHistory">
            <template slot="time" slot-scope="row">
                <span>{{dateFormat(row.value)}}</span>
            </template>
            <template slot="origin" slot-scope="row">
                <img :src="getIconFromTicker(row.value.ticker)" alt="iconTicker">
            </template>
            <template slot="amount" slot-scope="row">
                <div :class="getColorAmount(row.value)" v-if="!fromTokenSale">
                    <span v-if="satoshiToBitcoin(row.value) > 0">+</span>
                    <span v-else>-</span>
                    {{satoshiToBitcoin(Math.abs(row.value))}}
                </div>
                <div v-else>{{satoshiToBitcoin(Math.abs(row.value))}}</div>
            </template>
            <template slot="origin.txHash" slot-scope="row">
                {{getPrice(row)}} {{row.item.origin.ticker}}
            </template>
            <template slot="item" slot-scope="row">
                {{getTotalPrice(row)}} {{row.item.origin.ticker}}
            </template>
        </b-table>
    </div>
</template>

<script>
var sb = require('satoshi-bitcoin')
var moment = require('moment');

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
        dateFormat(value) {
            let dateString = moment.unix(value).format("hh:mm A DD/MM/YYYY");
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

#status {
    font-weight: 600;
}

#price {
    border-left: 1px solid rgba(151, 151, 151, 0.5);
    border-right: 1px solid rgba(151, 151, 151, 0.5);
}

#totalPrice {
    border-right: 1px solid rgba(151, 151, 151, 0.5);
}
</style>

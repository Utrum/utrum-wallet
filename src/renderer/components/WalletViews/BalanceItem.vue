<template>
  <div class="row-main-item">
    <div class="row-title">
      <h2 id="balance-item">{{numberWithSpaces(wallet.balance)}}</h2>
      <h2 id="coin-item">{{wallet.ticker}}</h2>
      <p id="us-dollar" class="col-header"><img src="@/assets/icon-usdollar.svg"/> {{numberWithSpaces(wallet.balance_usd.toFixed(2))}} (USD)</p>
    </div>
    <div class="row-content" :class="getQRCodeClass(wallet.balance_unconfirmed)">
      <div v-if="wallet.balance_unconfirmed != 0">
        <img v-if="wallet.balance_unconfirmed > 0" src="@/assets/icon-in.svg" alt="icon-unconfirmed-balance">
        <img v-else src="@/assets/icon-out.svg" alt="icon-unconfirmed-balance">
        <span :class="getUnconfirmedColor(wallet.balance_unconfirmed)"><span v-if="wallet.balance_unconfirmed > 0">+</span>{{numberWithSpaces(wallet.balance_unconfirmed)}}</span>
      </div>
      <button v-b-modal="wallet.ticker" :id="wallet.ticker" type="button" class="btn qrcode">SEE YOUR QR CODE<img src="@/assets/icon-qrcode-select.svg"></button>
    </div>
    <div class="row-footer">
      <p class="col-header">Your deposit {{wallet.coin.name}} address :</p>
      <div class="card">
        <button
        v-clipboard:copy="wallet.address"
        v-clipboard:success="onCopy"
        type="button" 
        class="btn btn-copy-link btn-smartaddress" 
        :data-clipboard-text="wallet.address">
        <div :id="wallet.ticker" class="btn-inside-qrcode">
          <span v-if="isClipboard" >Copied to the clipboard</span>
          <span v-else>{{wallet.address}}</span>
        </div>
      </button>
    </div>
  </div>
  <hr/>
  <qrcode-modal :wallet="wallet"></qrcode-modal>
</div>
</template>

<script>
var sb = require('satoshi-bitcoin')
var electrum = require('../../lib/electrum')

export default {
  name: 'balance-item',
  components: {
    'qrcode-modal' : require('@/components/Utils/QrcodeModal').default
  },
  props: {
    wallet: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isClipboard: false,
    }
  },
  methods: {
    getUnconfirmedColor(amount) {
      if (amount > 0) {
				return "positiveColor"
			} else {
				return "negativeColor"
			}
    },
    getQRCodeClass(amount) {
      if (amount == 0) {
        return "row-custom"
      }
    },
    numberWithSpaces(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    },
    onCopy() {
      var self = this
      this.isClipboard = true;
      setTimeout(function(){
        self.isClipboard = false;
      }, 1000);
    }
  },
}
</script>

<style scoped>
.row-custom {
  justify-content: flex-end !important;
}

#us-dollar {
  text-align: right;
}

.modal-header {
  text-align: center;
  border-bottom: none !important;
}

.content .btn:focus {
  outline: none;
  box-shadow: none;
}

.row-header {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.row-title {
  margin: 0;
  display: flex;
  justify-content: flex-start;
}

.col-header {
  flex-grow: 1;
  margin: 0px;
}

#balance-item {
  margin: 0;
  margin-right: 5px;
  font-weight: 300;
  color: #180d39;
}

#coin-item{
  margin: 0;
  font-weight: 200;
  color: #180d39;
}

.row-content {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.row-content .btn:hover{
  color: #7c398a;
}

.row-footer {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.row-footer button{
  padding: 0px;
  margin: 0px;
  background-color: black;
  border: white;
  border-radius: 4px;
}

.row-footer button:hover{
  background-color: #7c398a;
} 

.row-footer button:active{
  background-color: #7c398a;
}

.btn-inside-qrcode {
  color: #687078;
  font-weight: 400;
  margin-left: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: white;
  border-radius: 3px;
  border-left-radius: 0px;
  border-top-left-radius: 0px 0px;
  border-bottom-left-radius: 0px 0px;
  width: 425px;
  min-width: 425px;
  text-align: center;
}

.btn-inside-qrcode:hover {
  color: #7c398a;
}

.balance {
  font-size: 16pt;
  font-weight: 300;
  width: 150px;
}

.qrcode img {
  padding-left: 10px;
  padding-right: 0px;
  margin-top: auto;
  margin-bottom: auto;
}

.qrcode {
  background-color: transparent;
  color: #7c398a;
  font-weight: 400;
  text-align: right;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 2px solid #f3f4fc;
  margin: 1em 0;
  padding: 0;
}
</style>

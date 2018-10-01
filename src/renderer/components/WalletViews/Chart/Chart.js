import axios from 'axios'
import LineChart from '@/components/WalletViews/Chart/LineChart'
import vSelect from 'vue-select'
import moment from 'moment'
export default {
  components: {
    LineChart,
    'v-select': vSelect
  },
  data () {
    return {
      loaded: false,
      loading: false,
      prices: [],
      labels: [],
      showError: false,
      showSettings: false,
      errorMessage: 'Please enter a time frame',
      periodStart: '',
      periodEnd: new Date(),
      rawData: '',
      linePng: null,
      url: 'https://api.coingecko.com/api/v3/coins/utrum/market_chart?vs_currency=usd&days=',
      selTime: null,
      selCoin: null,
      coins: [
        {text: 'OOT Price Chart', value: 'oot'}, 
        {text: 'KMD Price Chart', value: 'kmd'}, 
        {text: 'BTC Price Chart', value: 'btc'}
      ],
      timeList: [
        {text: 'Today', value: 1}, 
        {text: 'This Week', value: 7}, 
        {text: 'This Month', value: 30}
      ]
    }
  },
  mounted () {
    this.requestData()
    this.selCoin = this.coins.length > 0 ? this.coins[0]['value'] : null
    this.selTime = this.timeList.length > 0 ? this.timeList[0]['value'] : null
  },
  methods: {
    resetState () {
      this.loaded = false
      this.showError = false
    },
    fixTime (unix) {
      var a = new Date(unix)
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var year = a.getFullYear()
      var month = months[a.getMonth()]
      var date = a.getDate()
      var hour = a.getHours()
      var min = a.getMinutes()
      var sec = a.getSeconds()
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
      return time
    },
    changeCoin (coin) {
      if (coin == "oot") {
        this.url = 'https://api.coingecko.com/api/v3/coins/utrum/market_chart?vs_currency=usd&days='
      } else if (coin == "kmd") {
        this.url = 'https://api.coingecko.com/api/v3/coins/komodo/market_chart?vs_currency=usd&days='
      } else if (coin == "btc") {
        this.url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days='
      }
      this.requestData(1)
    },
    requestData (days) {
      this.resetState()
      this.loading = true
      if (days == null) {
        days = 1
      }
      this.day = (days == 1) ? 'underline !important' : 'none'
      this.week = (days == 7) ? 'underline !important' : 'none'
      this.month = (days == 30) ? 'underline !important' : 'none'
      axios.get(this.url + days)
        .then(response => {
          this.prices = response.data.prices.map(entry => entry[1])
          this.labels = response.data.prices.map(entry => this.fixTime(entry[0]))
          this.loaded = true
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.showError = true
        })
    },
    validateDataRequest () {
      if (this.periodStart !== '') {
        this.requestData()
      }
    },
    setLinePng (payload) {
      this.linePng = payload
    }
  }
}

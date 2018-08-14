import axios from 'axios'
import LineChart from '@/components/WalletViews/Chart/LineChart'

export default {
  components: {
    LineChart,
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
      day: 'none',
      week: 'none',
      month: 'none',
      rawData: '',
      linePng: null
    }
  },

  mounted () {
    this.requestData()
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
    requestData (days) {
      this.resetState()
      this.loading = true
      if (days == null) {
        days = 1
      }
      this.day = (days == 1) ? 'underline !important' : 'none'
      this.week = (days == 7) ? 'underline !important' : 'none'
      this.month = (days == 30) ? 'underline !important' : 'none'
      axios.get(`https://api.coingecko.com/api/v3/coins/utrum/market_chart?vs_currency=usd&days=` + days)
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

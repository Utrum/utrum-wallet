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
      var a = new Date(unix * 1000)
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var year = a.getFullYear()
      var month = months[a.getMonth()]
      var date = a.getDate()
      var hour = a.getHours()
      var min = a.getMinutes()
      var sec = a.getSeconds()
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + min + ':' + sec + sec
      return time
    },
    requestData (ticks) {
      this.resetState()
      this.loading = true
      if (ticks == null) {
        ticks = 24
      }
      this.day = (ticks == 24) ? 'underline !important' : 'none'
      this.week = (ticks == 168) ? 'underline !important' : 'none'
      this.month = (ticks == 720) ? 'underline !important' : 'none'
      axios.get(`https://thingproxy.freeboard.io/fetch/https://min-api.cryptocompare.com/data/histohour?fsym=OOT&tsym=USD&limit=` + ticks)
        .then(response => {
          this.prices = response.data.Data.map(entry => entry.close)
          this.labels = response.data.Data.map(entry => this.fixTime(entry.time))
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

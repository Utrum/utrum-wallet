import axios from 'axios'
import LineChart from '@/components/WalletViews/Chart/LineChart'
import vSelect from 'vue-select'
import moment from 'moment'
export default {
  components: {
    LineChart,
    'v-select': vSelect
  },
  data() {
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
      coins: [{
          text: 'Utrum (OOT)',
          value: 'oot'
        },
        {
          text: 'Komodo (KMD)',
          value: 'kmd'
        },
        {
          text: 'Bitcoin',
          value: 'btc'
        }
      ],
      timeList: [{
          text: 'Today',
          value: 1
        },
        {
          text: 'This Week',
          value: 7
        },
        {
          text: 'This Month',
          value: 30
        }
      ]
    }
  },
  mounted() {
    this.selCoin = this.coins.length > 0 ? this.coins[0] : null
    this.selTime = this.timeList.length > 0 ? this.timeList[0] : null
    this.requestData(this.selTime.value)
  },
  methods: {
    resetState() {
      this.loaded = false
      this.showError = false
    },
    fixTime(unix) {
      var a = new Date(unix)
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var year = a.getFullYear()
      var month = months[a.getMonth()]
      var date = a.getDate()
      var hour = a.getHours()
      var min = a.getMinutes()
      var sec = a.getSeconds()
      let localDt = new Date(`${year}/${a.getMonth()}/${date} ${hour}:${min}:${sec}`)
      let time = `${localDt}`
      return time
    },
    onCoinChange(selected) {
      if (selected) this.changeCoin(selected.value)
    },
    changeCoin(coin) {
      if (coin == "oot") {
        this.url = 'https://api.coingecko.com/api/v3/coins/utrum/market_chart?vs_currency=usd&days='
      } else if (coin == "kmd") {
        this.url = 'https://api.coingecko.com/api/v3/coins/komodo/market_chart?vs_currency=usd&days='
      } else if (coin == "btc") {
        this.url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days='
      }
      this.requestData(this.selTime.value)
    },
    onTimeChange(selected) {
      if (selected) this.requestData(selected.value)
    },
    requestData(days) {
      this.resetState()
      this.loading = true
      if (days == null) {
        days = 1
      }

      axios.get(this.url + days)
        .then(response => {
          this.prices = response.data.prices.map(entry => entry[1])
          let tempLabels = response.data.prices.map(entry => this.fixTime(entry[0]))

          this.labels = []
          let prevDt = null;
          let maxDt = new Date(tempLabels[tempLabels.length - 1])
          var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

          for (let val of tempLabels) {
            let curIdxDt = new Date(val)
            let tempFormat = moment(curIdxDt).format('DD MMM YYYY HH:mm')
            switch (days) {
              case 1:
                {
                  if (!prevDt) {
                    prevDt = curIdxDt
                    val = `${tempFormat};${moment(curIdxDt).format('HH:mm')}`
                  } else if (curIdxDt.getDate() != prevDt.getDate()) {
                    val = `${tempFormat};${curIdxDt.getDate()} ${months[curIdxDt.getMonth()]}`
                    prevDt = curIdxDt
                  } else if (curIdxDt.getHours() != prevDt.getHours()) {
                    val = `${tempFormat};${moment(curIdxDt).format('HH:mm')}`
                    prevDt = curIdxDt
                  } else {
                    val = `${tempFormat};`
                  }
                  break;
                }
              default:
                {
                  if (!prevDt) {
                    prevDt = curIdxDt
                    val = `${tempFormat};${curIdxDt.getDate()} ${months[curIdxDt.getMonth()]}`
                  } else if (curIdxDt.getDate() != prevDt.getDate()) {
                    val = `${tempFormat};${curIdxDt.getDate()} ${months[curIdxDt.getMonth()]}`
                    prevDt = curIdxDt
                  } else {
                    val = `${tempFormat};`
                  }
                  break;
                }
            }
            this.labels.push(val)
          }

          this.loaded = true
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.showError = true
        })
    },
    validateDataRequest() {
      if (this.periodStart !== '') {
        this.requestData(this.selTime.value)
      }
    },
    setLinePng(payload) {
      this.linePng = payload
    }
  }
}
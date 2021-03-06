<script>
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    props: {
      chartData: {
        type: Array | Object,
        required: false
      },
      chartLabels: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        gradient: null,
        options: {
          showScale: true,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: (value, index, values) => {
                  return this.formatNumber(value)
                }
              },
              gridLines: {
                display: true,
                color: '#EEF0F4',
                borderDash: [5, 15]
              }
            }],
            xAxes: [ {
              id:'xAxis1',
              display: false,
              gridLines: {
                display: true,
                color: '#EEF0F4',
                borderDash: [5, 15]
              },
              ticks:{
                callback:function(value){
                  return value.split(";")[0]
                }
              }
            },
            {
              id:'xAxis2',
              type:"category",
               gridLines: {
                display: true,
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                borderDash: [5, 15]
              },
              ticks:{
                autoSkip:false,
                callback:function(value){
                  let tempArrr = value.split(";")
                  if(tempArrr.length >= 2){
                    return tempArrr[1]
                  }
                  else{
                    return value
                  }
                }
              }
            }]
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          tooltips: {
            backgroundColor: '#4F5565',
            titleFontStyle: 'normal',
            titleFontSize: 18,
            bodyFontFamily: "'Proxima Nova', sans-serif",
            cornerRadius: 3,
            bodyFontColor: '#20C4C8',
            bodyFontSize: 14,
            xPadding: 14,
            yPadding: 14,
            displayColors: false,
            mode: 'index',
            intersect: false,
            callbacks: {
              title: tooltipItem => {
                return `🗓 ${tooltipItem[0].xLabel}`
              },
              label: (tooltipItem, data) => {
                let dataset = data.datasets[tooltipItem.datasetIndex]
                let currentValue = dataset.data[tooltipItem.index]
                return `💰 ${currentValue.toLocaleString()} USD`
              }
            }
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      this.gradient = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 450)

      this.gradient.addColorStop(0, 'rgba(7, 156, 216, 1)')
      this.gradient.addColorStop(0.5, 'rgba(7, 156, 216, 0.25)')
      this.gradient.addColorStop(1, 'rgba(7, 156, 216, 0)')

      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: 'downloads',
            borderColor: '#249EBF',
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            pointHoverBorderColor: '#249EBF',
            pointHoverBackgroundColor: '#fff',
            pointHoverRadius: 4,
            pointHitRadius: 10,
            pointHoverBorderWidth: 1,
            borderWidth: 1,
            backgroundColor: this.gradient,
            data: this.chartData,
            xAxisID:'xAxis1'
          }
        ]
      }, this.options)
    },
    methods: {
      formatNumber (num) {
        if (num > 999) {
          let numString = Math.round(num).toString()
          let numberFormatMapping = [[6, 'm'], [3, 'k']]
          for (let [numberOfDigits, replacement] of numberFormatMapping) {
            if (numString.length > numberOfDigits) {
              let decimal = ''
              if (numString[numString.length - numberOfDigits] !== '0') {
                decimal = '.' + numString[numString.length - numberOfDigits]
              }
              numString = numString.substr(0, numString.length - numberOfDigits) + decimal + replacement
              break
            }
          }
          return numString
        } else {
          return num
        }
      }
    }
  }
</script>

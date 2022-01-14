import React from 'react'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, TimeSeriesScale, Title, Tooltip } from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, TimeSeriesScale, Tooltip, Title)

const PriceChart = ({data, days, currency, dark=false}) => {

  const options = {
    maintainAspectRatio: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: days === 1 ? 'hour' : (days <= 21 ? 'day' : (days <= 60 ? 'week' : 'month')) // use a reasonable timeunit
        },
        grid: {
          display: false,
          borderColor: dark ? 'white' : undefined
        },
        ticks: {
          color: dark ? 'white' : undefined,
        }
      },
      y: {
        ticks: {
          // currency format
          callback: function(value) {
              return Number(value).toLocaleString('en-US', {style:'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 8})
          },
          color: dark ? 'white' : undefined
        },
        grid: {
          display: false,
          borderColor: dark ? 'white' : undefined
        }
      }
    },
    elements: {
      point: {
        radius: 0
      }
    },
    interaction: {
      mode: 'index'
    },
    hover: {
      intersect: false
    },
    plugins: {
      tooltip: {
        intersect: false,
        displayColors: false,
        callbacks: {
          title: function(contextArr) {
            let context = contextArr[0]
             // show localized time for one day range, date + time for less than 90 days, for a range greater than 90 days show only the date
            let dateFormat = days === 1 ? 'pp' : (days <= 90 ? 'Pp' : 'PPP')
            let date = format(new Date(context.parsed.x), dateFormat)
            return date
          },
          label: function(context) {
            let label = ''
            let price = context.parsed.y
            if (price !== null) {
                let maximumFractionDigits = 2
                if (price < 1) {
                  maximumFractionDigits = 8
                }
                label += Number(price).toLocaleString('en-US', {style:'currency', currency: currency, maximumFractionDigits: maximumFractionDigits})
            }
            return label
          }
        }
      }
    }
  }

  return (
    <div>
      { data != null &&
        <Line data={{
          datasets: [{
            data: data.prices.map(e => { return {x: e[0], y: e[1]} }), // first element is a timestamp, second element is the price
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
          }],
        }}
        options={options}/>
      }
    </div>
  )
}

export default PriceChart

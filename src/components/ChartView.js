import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import PriceChart from './PriceChart'
import Spinner from './Spinner'
import { AVAILABLE_ASSETS } from '../utils/assetHelper'

const ChartView = () => {

  const { coinId } = useParams()

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const darkMode = useSelector(state => state.settings.darkMode)

  const [data, setData] = useState(null)
  const [days, setDays] = useState(1)
  
  useEffect(() => {
    const fetchMarketChartData = async () => {
      try {
        // fetch coin data from coingecko.com
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${displayCurrency}&days=${days}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        setData(data)
      }
      catch(error) {
        console.error(error)
      }
    }
    fetchMarketChartData()
  }, [days])

  const handleTimePeriodBtnClick = (days) => {
    setDays(days)
  }

  const timePeriodBtnClasses = "btn btn-outline-secondary"
  const timePeriodBtnClassesActive = timePeriodBtnClasses+" "+"active"

  const navigate = useNavigate()

  const handleBuyBtnClick = () => {
    navigate(`/buy/${coinId}`)
  }

  return (
    <div>
      { data != null ?
        <div className="card p-3">
          <h2 className="text-center">{coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price</h2>
          <PriceChart data={data} days={days} currency={displayCurrency} dark={darkMode}/>
          <div className="row w-100 mt-2">
            <div className="btn-group" role="group" aria-label="Select Time Period">
              <button type="button" className={days === 1 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(1)}>24h</button>
              <button type="button" className={days === 7 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(7)}>7d</button>
              <button type="button" className={days === 14 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(14)}>14d</button>
              <button type="button" className={days === 30 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(30)}>30d</button>
              <button type="button" className={days === 90 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(90)}>3m</button>
              <button type="button" className={days === 180 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(180)}>6m</button>
              <button type="button" className={days === 365 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(365)}>1y</button>
            </div>
          </div>
          { AVAILABLE_ASSETS.includes(coinId) &&
            <div class="d-grid col-12 col-md-3 mx-auto mt-5">
              <button type="button" className="btn btn-primary" onClick={handleBuyBtnClick}>Buy</button> 
            </div>
          }
        </div>
        :
        <Spinner/>
      }
    </div>
  )
}

export default ChartView

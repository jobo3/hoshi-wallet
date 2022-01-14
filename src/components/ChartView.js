import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PriceChart from './PriceChart'
import Spinner from './Spinner'

const ChartView = () => {

  const { coinId } = useParams()

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const darkMode = useSelector(state => state.settings.darkMode)
  const marketData = useSelector(state => state.marketData)

  const [data, setData] = useState(null)
  const [coinName, setCoinName] = useState(null)
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

  useEffect(() => {
    if (marketData != null) {
      let element = marketData.find(e => e.id === coinId)
      if (element === undefined) {
        setCoinName(coinId)
      }
      else {
        setCoinName(element.name)
      }
    }
  }, [marketData])

  const handleTimePeriodBtnClick = (days) => {
    setDays(days)
  }

  const timePeriodBtnClasses = "btn btn-outline-secondary"
  const timePeriodBtnClassesActive = timePeriodBtnClasses+" "+"active"

  return (
    <div>
      { data != null && coinName != null ?
        <div className="card p-3">
          <div className="text-center">{marketData.find(e => e.id === coinId).name} Price</div>
          <PriceChart data={data} days={days} currency={displayCurrency} dark={darkMode}/>
          <div className="btn-group w-25 mt-2" role="group" aria-label="Select Time Period">
            <button type="button" className={days === 1 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(1)}>24h</button>
            <button type="button" className={days === 7 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(7)}>7d</button>
            <button type="button" className={days === 14 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(14)}>14d</button>
            <button type="button" className={days === 30 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(30)}>30d</button>
            <button type="button" className={days === 90 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(90)}>3m</button>
            <button type="button" className={days === 180 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(180)}>6m</button>
            <button type="button" className={days === 365 ? timePeriodBtnClassesActive : timePeriodBtnClasses} onClick={() => handleTimePeriodBtnClick(365)}>1y</button>
          </div>
        </div>
        :
        <Spinner/>
      }
    </div>
  )
}

export default ChartView

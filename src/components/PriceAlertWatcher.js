import { isBefore, sub } from 'date-fns'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newPriceAlert } from '../features/pricealerts/priceAlertsSlice'
import { v4 as uuidv4 } from 'uuid'


// price change in percentage, which will trigger an alert
export const MAX_PRICE_CHANGE_24H = 3
export const MAX_PRICE_CHANGE_7D = 20

const PriceAlertWatcher = () => {

  const marketData = useSelector(state => state.marketData)
  const priceAlerts = useSelector(state => state.priceAlerts)

  const dispatch = useDispatch()

  useEffect(() => {
    if (marketData) {
      marketData.forEach(asset => {
        // 24 hours price alerts
        let priceChange24h = asset.price_change_percentage_24h
        if (Math.abs(priceChange24h) > MAX_PRICE_CHANGE_24H) {
          let now = new Date()
          let yesterday = sub(now, {day: 1})
          // check if a price alert for this asset has already been triggered
          let oldAlert = priceAlerts.find(e => {
            return e.asset_id === asset.id && e.days === 1 && isBefore(new Date(e.date), yesterday)
          })
          if (oldAlert === undefined) {
            let alert = {
              id: uuidv4(),
              asset_id: asset.id,
              asset_name: asset.name,
              price_increased: Math.sign(priceChange24h) === 1 ? true : false,
              text: Math.sign(priceChange24h) === 1 ? `Price increased by more than ${MAX_PRICE_CHANGE_24H}% in the last 24 hours!` : `Price fell by more than ${MAX_PRICE_CHANGE_24H}% in the last 24 hours!`,
              date: new Date().toISOString(),
              days: 1, // time period
              hidden: false
            }
            dispatch(newPriceAlert(alert))
          }
        }
        // 7 days price alerts
        let sparklinePrices = asset.sparkline_in_7d.price
        let priceChange7days = (sparklinePrices[sparklinePrices.length-1] - sparklinePrices[0]) / asset.current_price * 100
        console.log("price change 7d: ",priceChange7days)
        if (Math.abs(priceChange7days) > MAX_PRICE_CHANGE_24H) {
          let now = new Date()
          let lastWeek = sub(now, {day: 7})
          // check if a price alert for this asset has already been triggered
          let oldAlert = priceAlerts.find(e => {
            return e.asset_id === asset.id && e.days === 7 && isBefore(new Date(e.date), lastWeek)
          })
          if (oldAlert === undefined) {
            let alert = {
              id: uuidv4(),
              asset_id: asset.id,
              asset_name: asset.name,
              price_increased: Math.sign(priceChange7days) === 1 ? true : false,
              text: Math.sign(priceChange7days) === 1 ? `Price increased by more than ${MAX_PRICE_CHANGE_7D}% in the last 7 days!` : `Price fell by more than ${MAX_PRICE_CHANGE_7D}% in the last 7 days!`,
              date: new Date().toISOString(),
              days: 7, // time period
              hidden: false
            }
            dispatch(newPriceAlert(alert))
          }
        }
      })
    }
  }, [marketData, priceAlerts])

  return <></>
}

export default PriceAlertWatcher
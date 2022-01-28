import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newPriceAlert } from '../features/pricealerts/priceAlertsSlice'
import { checkPriceAlerts } from '../utils/priceAlert'

// price change in percentage, which will trigger an alert
export const MAX_PRICE_CHANGE_24H = 5
export const MAX_PRICE_CHANGE_7D = 15

const PriceAlertWatcher = () => {

  const marketData = useSelector(state => state.marketData)
  const priceAlerts = useSelector(state => state.priceAlerts)

  const dispatch = useDispatch()

  useEffect(() => {
    if (marketData) {
      marketData.forEach(asset => {
       checkPriceAlerts(new Date(), asset, priceAlerts, MAX_PRICE_CHANGE_24H, MAX_PRICE_CHANGE_7D, (alert) => { dispatch(newPriceAlert(alert)) })
      })
    }
  }, [marketData, priceAlerts])

  return <></>
}

export default PriceAlertWatcher

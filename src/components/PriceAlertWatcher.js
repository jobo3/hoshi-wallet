import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newPriceAlert } from '../features/pricealerts/priceAlertsSlice'
import { checkPriceAlerts } from '../utils/priceAlert'


const PriceAlertWatcher = () => {

  const marketData = useSelector(state => state.marketData)
  const priceAlerts = useSelector(state => state.priceAlerts)

  const dispatch = useDispatch()

  useEffect(() => {
    if (marketData) {
      marketData.forEach(asset => {
       checkPriceAlerts(new Date(), asset, priceAlerts, (alert) => { dispatch(newPriceAlert(alert)) })
      })
    }
  }, [marketData, priceAlerts])

  return <></>
}

export default PriceAlertWatcher

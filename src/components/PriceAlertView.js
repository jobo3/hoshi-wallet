import classNames from 'classnames'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hidePriceAlert } from '../features/pricealerts/priceAlertsSlice'

const PriceAlertView = () => {

  const priceAlerts = useSelector(state => state.priceAlerts)
  const dispatch = useDispatch()

  const handleCloseBtnClick = (alertId) => {
    dispatch(hidePriceAlert(alertId))
  }

  const [sortedPriceAlerts, setSortedPriceAlerts] = useState(new Array())

  useEffect(() => {
    setSortedPriceAlerts([...priceAlerts].sort((a,b) => new Date(b.date) - new Date(a.date)))
  }, [priceAlerts])

  return (
    <div className="container">
      { sortedPriceAlerts.findIndex(e => !e.hidden) === -1 ? <div>No Alerts</div> :
        sortedPriceAlerts.map((alert, i) => {
          if (alert.hidden) return
          let alertClasses = classNames({
            'alert': true,
            'alert-success': Math.sign(alert.price_change) === 1,
            'alert-warning': Math.sign(alert.price_change) === -1,
            'alert-dismissible': true
          })
          let text = ' '
          if (alert.days === 1) {
            text = Math.sign(alert.price_change) === 1 ? `${alert.asset_name} increased by ${alert.price_change.toFixed(2)}% in the last 24 hours!` : `${alert.asset_name} fell by ${alert.price_change.toFixed(2)}% in the last 24 hours!`
          }
          else if (alert.days === 7) {
            text = Math.sign(alert.price_change) === 1 ? `${alert.asset_name} increased by ${alert.price_change.toFixed(2)}% in the last 7 days!` : `${alert.asset_name} fell by ${alert.price_change.toFixed(2)}% in the last 7 days!`
          }
          return (
            <div className={alertClasses} role="alert" key={i}>
              <strong>{format(new Date(alert.date), "Pp")}</strong> {text} 
              <button type="button" className="btn-close" aria-label="Close" onClick={() => handleCloseBtnClick(alert.id)}></button>
            </div>
          )
        })
      }
    </div>
  )
}

export default PriceAlertView

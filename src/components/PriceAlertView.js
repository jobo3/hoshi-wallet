import classNames from 'classnames'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hidePriceAlert } from '../features/pricealerts/priceAlertsSlice'
import { MAX_PRICE_CHANGE_24H, MAX_PRICE_CHANGE_7D } from '../utils/priceAlert'

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
          if (alert.hidden) { 
            return <></>
          }
          let alertClasses = classNames({
            'alert': true,
            'alert-success': alert.price_increased,
            'alert-warning': !alert.price_increased,
            'alert-dismissible': true
          })
          let text = ' '
          if (alert.days === 1) {
            text = alert.price_increased ? `${alert.asset_name} increased by more than ${MAX_PRICE_CHANGE_24H}% in the last 24 hours!` : `${alert.asset_name} fell by more than ${MAX_PRICE_CHANGE_24H}% in the last 24 hours!`
          }
          else if (alert.days === 7) {
            text = alert.price_increased ? `${alert.asset_name} increased by more than ${MAX_PRICE_CHANGE_7D}% in the last 7 days!` : `${alert.asset_name} fell by more than ${MAX_PRICE_CHANGE_7D}% in the last 7 days!`
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

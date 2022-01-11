import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

/**
 * @param coin - element from coingecko market data
 */
const MarketCoinCard = ({coin}) => {

  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
  const priceChangeClass = classNames({
    'text-success': coin.price_change_percentage_24h >= 0,
    'text-danger': coin.price_change_percentage_24h < 0,
  })

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex"> 
          <div className="align-self-center me-2">
            <img src={coin.image} alt={coin.name} width="28px" height="28px" className=""/>
          </div>
          <div className="w-100 d-flex flex-wrap">
            <div className="d-flex flex-column flex-wrap me-auto">
              <div className="small">#{coin.market_cap_rank} {coin.name}</div>
              <div className="small">{coin.market_cap.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 0})}</div>
            </div>
            <div className="d-flex flex-column flex-wrap text-end">
              <div className="small">Price: {Number(coin.current_price.toFixed(8)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
              <div className="small">24h: <span className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketCoinCard


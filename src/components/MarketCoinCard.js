import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

/**
 * @param coin - element from coingecko market data
 */
const MarketCoinCard = ({coin}) => {

  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/market/${coin.id}`)
  }

  const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
  const priceChangeClass = classNames({
    'text-success': coin.price_change_percentage_24h >= 0,
    'text-danger': coin.price_change_percentage_24h < 0,
  })

  return (
    <div className="card mb-2" onClick={handleClick}>
      <div className="card-body">
        <div className="d-flex"> 
          <div className="align-self-center me-3">
            <img src={coin.image} alt={coin.name} width="40px" height="40px" className=""/>
          </div>
          <div className="row w-100">
            <div className="col-sm-6 me-auto">
              <div className="small">#{coin.market_cap_rank} {coin.name}</div>
              <div className="small">Market Cap: {coin.market_cap.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 0})}</div>
            </div>
            <div className="col-sm-6 text-sm-end">
              <div className="small">Price: {Number(coin.current_price).toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 8})}</div>
              <div className="small">24h: <span className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketCoinCard

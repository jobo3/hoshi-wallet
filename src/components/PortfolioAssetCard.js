import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

/**
 * @param asset - element from portfolio data
 */
const PortfolioAssetCard = ({asset}) => {

  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  const coin = asset.market_data
  const value = (coin.current_price * asset.quantity).toLocaleString('en-US', {style:'currency', currency: displayCurrency})
  const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
  const priceChangeClass = classNames({
    'text-success': coin.price_change_percentage_24h >= 0,
    'text-danger': coin.price_change_percentage_24h < 0,
  })

  const navigate = useNavigate()

  const handleOnClick = (assetId) => {
    navigate(`/wallet/${assetId}`)
  }

  return (
    <div className="card mb-2" onClick={() => handleOnClick(coin.id)}>
      <div className="card-body">
        <div className="d-flex"> 
          <div className="align-self-center me-3">
            <img src={coin.image} alt={coin.name} width="40px" height="40px" className=""/>
          </div>
          <div className="row w-100">
            <div className="col-12 col-sm-6 me-auto">
              <div className="small">Quantity: {asset.quantity} {coin.symbol.toUpperCase()}</div>
              <div className="small">Price: {coin.current_price.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 8})}</div>
            </div>
            <div className="col-12 col-sm-6 text-sm-end">
              <div className="small">Balance: {value}</div>
              <div className="small">24h: <span className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioAssetCard

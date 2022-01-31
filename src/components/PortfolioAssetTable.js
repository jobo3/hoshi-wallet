import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Sparkline from './Sparkline'
import { Link } from 'react-router-dom'

/**
 * @param assets - portfolio data
 */
const PortfolioAssetTable = ({assets}) => {

  const uiMode = useSelector(state => state.settings.ui)

  return (
  <>
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Asset</th>
          <th scope="col" className="text-end">Balance</th>
          <th scope="col" className="text-end">Price</th>
          <th scope="col" className="text-end">24h Change</th>
          { uiMode > 0 && <th scope="col" className="text-end">7 Days</th> }
          <th scope="col" className="text-end">Action</th>
        </tr>
      </thead>
      <tbody>
        { assets.map((asset) => <PortfolioAssetRow asset={asset} key={asset.id}/>) }
      </tbody>
    </table>
  </>
  )
}

export default PortfolioAssetTable

/**
 * @param asset - element from portfolio data
 */
const PortfolioAssetRow = ({asset}) => {

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const uiMode = useSelector(state => state.settings.ui)

  const coin = asset.market_data
  const value = (coin.current_price * asset.quantity).toLocaleString('en-US', {style:'currency', currency: displayCurrency})
  const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
  const priceChangeClass = classNames({
    'text-end': true,
    'align-middle': true,
    'text-success': coin.price_change_percentage_24h >= 0,
    'text-danger': coin.price_change_percentage_24h < 0,
  })

  return (
    <tr>
      <td className="align-middle">
        <img src={coin.image} alt={coin.name} width="40px" height="40px" className="me-3"/>{coin.name}
      </td>
      <td className="text-end align-middle">
          <div>{asset.quantity} {coin.symbol.toUpperCase()}</div>
          <div className="text-muted">{value}</div>
      </td>
      <td className="text-end align-middle">{coin.current_price.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 8})}</td>
      <td className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</td>
      { uiMode > 0 && <td><Sparkline prices={coin.sparkline_in_7d.price} key={coin.id}/></td> }
      <td className="text-end align-middle"><Link to={`/wallet/${coin.id}`}><div className="btn btn-link text-decoration-none" style={{padding: "0px"}}>Manage</div></Link></td>
    </tr>
  )
}

import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Sparkline from './Sparkline'

/**
 * @param coin - element from coingecko market data
 */
const MarketCoinRow = ({coin}) => {

  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
  const priceChangeClass = classNames({
    'text-end': true,
    'align-middle': true,
    'text-success': coin.price_change_percentage_24h >= 0,
    'text-danger': coin.price_change_percentage_24h < 0,
  })

  return (
    <tr>
      <td className="align-middle">{coin.market_cap_rank}</td>
      <td className="align-middle">
        <img src={coin.image} alt={coin.name} width="20px" height="20px" className="me-3"/>{coin.name}
      </td>
      <td className="text-end align-middle">{Number(coin.current_price.toFixed(8)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</td>
      <td className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</td>
      <td className="text-end align-middle">{coin.market_cap.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 0})}</td>
      <td><Sparkline prices={coin.sparkline_in_7d.price}/></td>
      <td className="text-end align-middle"><div className="btn btn-link text-decoration-none" style={{padding: "0px"}}>View</div></td>
    </tr>
  )
}

export default MarketCoinRow

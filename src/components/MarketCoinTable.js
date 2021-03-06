import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Sparkline from './Sparkline'
import { Link } from 'react-router-dom'
import { AVAILABLE_ASSETS } from '../utils/assetHelper'

const MarketCoinTable = ({data}) => {

  const uiMode = useSelector(state => state.settings.ui)

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Coin</th>
            <th scope="col" className="text-end">Price</th>
            <th scope="col" className="text-end">24h Change</th>
            { uiMode > 0 &&
              <>
                <th scope="col" className="text-end">Market Cap</th>
                <th scope="col" className="text-end">7 Days</th>
                <th scope="col" className="text-end">Charts</th>
              </>
            }
            <th scope="col" className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          { data.map((coin) => <MarketCoinRow coin={coin} key={coin.id}/>) }
        </tbody>
      </table>
    </>
  )
}

export default MarketCoinTable

/**
 * @param coin - element from coingecko market data
 */
 const MarketCoinRow = ({coin}) => {

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const uiMode = useSelector(state => state.settings.ui)

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
      <td className="text-end align-middle">{Number(coin.current_price).toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 8})}</td>
      <td className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</td>
      { uiMode > 0 &&
        <>
          <td className="text-end align-middle">{coin.market_cap.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 0})}</td>
          <td><Sparkline prices={coin.sparkline_in_7d.price} key={coin.id}/></td>
          <td className="text-end align-middle">
            <Link to={`/market/${coin.id}`}><div className="btn btn-link text-decoration-none" style={{padding: "0px"}}>View</div></Link>
          </td>
        </>
      }
      <td className="text-end align-middle">
        { AVAILABLE_ASSETS.includes(coin.id) ? <Link to={`/buy/${coin.id}`}><div className="btn btn-link text-decoration-none" style={{padding: "0px"}}>Buy</div></Link> : '-' }
      </td>
    </tr>
  )
}

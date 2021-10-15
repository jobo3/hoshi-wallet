import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { totalPortfolioValue, totalPortfolioValue24hAgo, totalPortfolioValueChangePercentage24h } from '../utils/calculate'
import Spinner from './Spinner'

const Portfolio = () => {

  // portfolio state from redux
  const portfolio = useSelector((state) => state.portfolio)
  const dispatch = useDispatch()
  // market data from redux
  const marketData = useSelector((state) => state.marketData)

  //const [marketData, setMarketData] = useState(null)
  const [data, setData] = useState(null)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioValue24hAgo, setPortfolioValue24hAgo] = useState(0)
  const [portfolioValueChangePercentage24h, setPortfolioValueChangePercentage24hAgo] = useState(0)

  useEffect(() => {
    if (marketData && portfolio) {
      // combine portfolio data with market data
      const portfolioData = portfolio.map( e => ({ ...e, market_data: marketData.find(el => el.id === e.id)}))
      // sort assets by value - show bigger holdings first
      portfolioData.sort((a, b) => (b.quantity * b.market_data.current_price) - (a.quantity * a.market_data.current_price))
      //console.log(portfolioData)
      // set data
      setData(portfolioData)
      setPortfolioValue(totalPortfolioValue(portfolioData))
      setPortfolioValue24hAgo(totalPortfolioValue24hAgo(portfolioData))
      setPortfolioValueChangePercentage24hAgo(totalPortfolioValueChangePercentage24h(portfolioData))
    }
  }, [portfolio, marketData])

  // redirection
  const history = useHistory()

  const handleOnClick = (e, assetId) => {
    e.preventDefault()
    history.push(`/wallet/${assetId}`)
  }

  // display currency
  const displayCurrency = useSelector((state) => state.settings.display_currency)

  return (
    <>
        {
          data == null ? (
            <Spinner></Spinner>
          )
            :
            ( data.length === 0 ? (<div>Your Portfolio is empty.</div>) :
              <div className="mt-3">
                <div className="card mb-3 mx-auto">
                  <div className="card-body">
                    <h5 className="card-title mb-2">Total Balance</h5>
                    <div className="d-flex flex-wrap">
                      <div className="me-auto fs-2 align-self-center">{portfolioValue.toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
                      <div className="d-flex flex-column">
                        <div className={classNames({
                              'text-success': (portfolioValue - portfolioValue24hAgo) >= 0,
                              'text-danger': (portfolioValue - portfolioValue24hAgo) < 0,
                            })}>{(portfolioValue - portfolioValue24hAgo) >= 0 ? "+" : ""}{(portfolioValue - portfolioValue24hAgo).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
                        <div className={classNames({
                              'text-success': portfolioValueChangePercentage24h >= 0,
                              'text-danger': portfolioValueChangePercentage24h < 0,
                            })}>{portfolioValueChangePercentage24h >= 0 ? '+' : ''}{portfolioValueChangePercentage24h.toFixed(2)+"%"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end small mb-1">
                  Powered by <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">CoinGecko</a>
                </div>
                <div className="d-none d-md-block mx-auto">
                  <div className="card">
                  <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Asset</th>
                        <th scope="col" className="text-end">Balance</th>
                        <th scope="col" className="text-end">Price</th>
                        <th scope="col" className="text-end">24h Change</th>
                        <th scope="col" className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data.map((asset, i) => {
                          try {
                            const coin = asset.market_data
                            const value = (coin.current_price * asset.quantity).toLocaleString('en-US', {style:'currency', currency: displayCurrency})
                            const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
                            const priceChangeClass = classNames({
                              'text-end': true,
                              'align-middle': true,
                              'text-success': coin.price_change_percentage_24h >= 0,
                              'text-danger': coin.price_change_percentage_24h < 0,
                            })
                            return <tr key={i}>
                                      <td className="align-middle">
                                        <img src={coin.image} alt={coin.name} width="40px" height="40px" className="me-3"/>{coin.name}
                                      </td>
                                      <td className="text-end align-middle">
                                          <div>{asset.quantity} {coin.symbol.toUpperCase()}</div>
                                          <div className="text-muted">{value}</div>
                                      </td>
                                      <td className="text-end align-middle">{Number(coin.current_price.toFixed(8)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</td>
                                      <td className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</td>
                                      <td className="text-end align-middle"><div className="btn btn-link text-decoration-none" onClick={(e) => handleOnClick(e, coin.id)} style={{padding: "0px"}}>Manage</div></td>
                                    </tr>
                          }
                          catch(error) {
                            console.error(error)
                            return <></>
                          }
                        })
                      }
                    </tbody>
                  </table>
                  </div>
                  </div>
                </div>
                <div className="d-md-none">
                  {
                    data.map((asset, i) => {
                      try {
                        const coin = asset.market_data
                        const value = (coin.current_price * asset.quantity).toLocaleString('en-US', {style:'currency', currency: displayCurrency})
                        const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
                        const priceChangeClass = classNames({
                          'text-success': coin.price_change_percentage_24h >= 0,
                          'text-danger': coin.price_change_percentage_24h < 0,
                        })
                        return <div key={i} className="card mb-2">
                                <div className="card-body" onClick={(e) => handleOnClick(e, coin.id)}>
                                  <div className="d-flex"> 
                                    <div className="align-self-center me-2">
                                      <img src={coin.image} alt={coin.name} width="40px" height="40px" className=""/>
                                    </div>
                                    <div className="w-100">
                                      <div className="d-flex flex-wrap">
                                        <div className="me-auto">{asset.quantity} {coin.symbol.toUpperCase()}</div>
                                        <div>{Number(coin.current_price.toFixed(8)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
                                      </div>
                                      <div className="d-flex flex-wrap">
                                        <div className="me-auto text-muted">{value}</div>
                                        <div className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                        }
                      catch(error) {
                        console.error(error)
                        return <></>
                      }
                    })
                  }
                </div>
              </div>
            )
        }
    </>
  )
}

export default Portfolio


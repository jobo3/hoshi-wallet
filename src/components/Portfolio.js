import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { totalPortfolioValue, totalPortfolioValue24hAgo, totalPortfolioValueChangePercentage24h } from '../utils/calculate'
import Spinner from './Spinner'
import PortfolioAssetCard from './PortfolioAssetCard'
import PortfolioAssetTable from './PortfolioAssetTable'

const Portfolio = () => {

  // portfolio state from redux
  const portfolio = useSelector((state) => state.portfolio)
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
      let portfolioData = portfolio.map( e => ({ ...e, market_data: marketData.find(el => el.id === e.id)}))
      // exclude coins with no market data (this should never happen)
      portfolioData = portfolioData.filter(e => e.market_data !== undefined)
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

  // display currency
  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  return (
    <>
        {
          data == null ? (
            <Spinner></Spinner>
          )
            :
            ( data.length === 0 ? (<div>Your Portfolio is empty.</div>) :
              <div className="container mt-3">
                <div className="card mb-3 mx-auto">
                  <div className="card-body">
                    <div className="d-flex flex-wrap">
                        <h4 className="card-title mb-2 me-auto">Total Balance</h4>
                        <h5>24h</h5>
                    </div>
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
                  Powered by <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">CoinGecko API</a>
                </div>
                <div className="d-none d-md-block mx-auto">
                  <div className="card">
                    <div className="card-body">
                      <PortfolioAssetTable assets={data}/>
                    </div>
                  </div>
                </div>
                <div className="d-md-none">
                  {
                    data.map((asset) => <PortfolioAssetCard asset={asset} key={asset.id}/>)
                  }
                </div>
              </div>
            )
        }
    </>
  )
}

export default Portfolio

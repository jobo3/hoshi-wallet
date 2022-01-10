import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'
import classNames from 'classnames'
import Sparkline from './Sparkline'


const Market = () => {

  const marketData = useSelector((state) => state.marketData)
  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMarketData, setFilteredMarketData] = useState(null)

  const handleSearch = (event) => {
    let value = event.target.value
    setSearchTerm(value)
  }

  useEffect(() => {
    setFilteredMarketData(marketData.filter(e => e.id.includes(searchTerm.toLowerCase()) || e.name.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [marketData, searchTerm])
  
  return (
    <>
      {
        filteredMarketData == null ? <Spinner/> :
        (
        <div className="container">
          <h1 className="text-center">Market</h1>

          <div className="text-end small mb-1">
            Powered by <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">CoinGecko API</a>
          </div>
          <div className="d-none d-md-block mx-auto">
            <div className="card">
              <div className="card-body">
                <div>
                  <form className="col-12 col-md-4 mb-3 float-end">
                  <input type="search" className="form-control" placeholder="Search coin..." aria-label="Search" onChange={handleSearch}/>
                  </form>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Coin</th>
                      <th scope="col" className="text-end">Price</th>
                      <th scope="col" className="text-end">24h Change</th>
                      <th scope="col" className="text-end">Market Cap</th>
                      <th scope="col" className="text-end">7 Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredMarketData.map((coin, i) => {
                        try {
                          const plus = coin.price_change_percentage_24h >= 0 ? '+' : ''
                          const priceChangeClass = classNames({
                            'text-end': true,
                            'align-middle': true,
                            'text-success': coin.price_change_percentage_24h >= 0,
                            'text-danger': coin.price_change_percentage_24h < 0,
                          })
                          return <tr key={i}>
                                    <td className="align-middle">{coin.market_cap_rank}</td>
                                    <td className="align-middle">
                                      <img src={coin.image} alt={coin.name} width="20px" height="20px" className="me-3"/>{coin.name}
                                    </td>
                                    <td className="text-end align-middle">{Number(coin.current_price.toFixed(8)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</td>
                                    <td className={priceChangeClass}>{plus}{coin.price_change_percentage_24h.toFixed(2)+"%"}</td>
                                    <td className="text-end align-middle">{coin.market_cap.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 0})}</td>
                                    <td><Sparkline prices={coin.sparkline_in_7d.price}/></td>
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
                { filteredMarketData.length < 1 && (<p className="text-muted fs-5 text-center">No matching coin</p>) }
              </div>
            </div>
          </div>

        </div>
        )
      }
    </>
  )
}

export default Market

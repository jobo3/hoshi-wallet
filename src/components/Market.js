import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'
import MarketCoinCard from './MarketCoinCard'
import MarketCoinRow from './MarketCoinRow'


const Market = () => {

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const sparkline = true

  const [marketData, setMarketData] = useState(null)

  useEffect( () => {
    const fetchMarketData = async () => {
      try {
        // fetch the market data of the first 100 coins
        let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${displayCurrency}&sparkline=${sparkline.toString()}`
        // fetch coin data from coingecko.com
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        setMarketData(data)
      }
      catch(error) {
        console.error(error)
      }
    }
    fetchMarketData()
  }, [displayCurrency, sparkline])

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMarketData, setFilteredMarketData] = useState(null)

  const handleSearch = (event) => {
    let value = event.target.value
    setSearchTerm(value)
  }

  useEffect(() => {
      if(marketData) {
        if (searchTerm === "") {
          setFilteredMarketData(marketData)
        }
        else {
          setFilteredMarketData(marketData.filter(e => e.id.includes(searchTerm.toLowerCase()) || e.name.toLowerCase().includes(searchTerm.toLowerCase())))
        }
      }
  }, [marketData, searchTerm])
  
  return (
    <>
      {
        filteredMarketData == null ? <Spinner/> :
        (
        <div className="container">
          <h1 className="text-center mb-4">Market</h1>

          <div className="text-end small mb-2">
            Powered by <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">CoinGecko API</a>
          </div>
          <div className="d-none d-xl-block mx-auto">
            <div className="card">
              <div className="card-body">
                <div>
                  <div className="col-12 col-md-4 mb-3 float-end">
                    <input type="search" className="form-control" placeholder="Search coin..." aria-label="Search" value={searchTerm} onChange={handleSearch}/>
                  </div>
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
                      <th scope="col" className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { filteredMarketData.map((coin) => <MarketCoinRow coin={coin} key={coin.id}/>) }
                  </tbody>
                </table>
                { filteredMarketData.length < 1 && (<p className="text-muted fs-5 text-center">No matching coin</p>) }
              </div>
            </div>
          </div>

          <div className="d-xl-none">
            <div>
              <div className="col-12 mb-3 float-end">
                <input type="search" className="form-control" placeholder="Search coin..." aria-label="Search" value={searchTerm} onChange={handleSearch}/>
              </div>
            </div>
              { filteredMarketData.map((coin) => <MarketCoinCard coin={coin} key={coin.id}/>) }
          </div>

        </div>
        )
      }
    </>
  )
}

export default Market

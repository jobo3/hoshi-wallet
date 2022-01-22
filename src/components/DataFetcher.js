import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updatedMarketData } from '../features/marketdata/marketDataSlice'

/*
  This component is used to fetch data from an API.
  The component should stay mounted in order to update data.
*/
export const DataFetcher = () => {

  const dispatch = useDispatch()
  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const portfolio = useSelector(state => state.portfolio)
  const sparkline = true

  useEffect(() => {

    const fetchMarketData = async () => {
      try {
        let assetIds = portfolio.map(e => e.id)
        // fetch only the market data of coins in the portfolio
        let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${displayCurrency}&sparkline=${sparkline.toString()}`
        if (assetIds.length !== 0) {
          // fetch the market data of the first 100 coins
          url = `https://api.coingecko.com/api/v3/coins/markets?ids=${assetIds}&vs_currency=${displayCurrency}&sparkline=${sparkline.toString()}`
        }
        // fetch coin data from coingecko.com
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        dispatch(updatedMarketData(data))
      }
      catch(error) {
        console.error(error)
      }
    }
    fetchMarketData()
    // fetch data every 30 seconds
    const interval = setInterval(fetchMarketData, 30*1000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, portfolio, displayCurrency, sparkline])

  return (<></>)
}

export default DataFetcher

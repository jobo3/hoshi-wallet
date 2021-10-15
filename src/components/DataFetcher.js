import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updatedMarketData } from '../features/marketdata/marketDataSlice'
import { updatedPortfolio } from '../features/portfolio/portfolioSlice'

/*
  This component is used to fetch data from an API.
  The component should stay mounted in order to update data.
*/
export const DataFetcher = () => {

  const dispatch = useDispatch()
  const displayCurrency = useSelector(state => state.settings.display_currency)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // fetch coin data from coingecko.com
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${displayCurrency}`)
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
  }, [dispatch, displayCurrency])


  useEffect(() => {
    const fetchAssets = async () => {
      try {
      const response = await fetch('/api/assets')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      //console.log(data)
      dispatch(updatedPortfolio(data))
      }
      catch(error) {
        console.error(error)
      }
    }
    fetchAssets()
    // fetch data every 30 seconds
    const interval = setInterval(fetchAssets, 10*1000)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  return (<></>)
}

export default DataFetcher
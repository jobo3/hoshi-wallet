import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import TxList from './TxList'
import Spinner from './Spinner'

const Asset = () => {
  let { assetId } = useParams()

  const asset = useSelector((state) => {
    if (state.portfolio != null) 
      return state.portfolio.find(e => e.id === assetId)
    else
      return null
  })
  const marketData = useSelector((state) => state.marketData)
  const [assetMarketData, setAssetMarketData] = useState(null)

  // display currency
  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  // redirection
  const navigate = useNavigate()
  const handleClickOnReceiveButton = () => {
    navigate(`/wallet/${assetId}/receive`)
  }

  const handleClickOnSendButton = () => {
    navigate(`/wallet/${assetId}/send`)
  }

  useEffect(() => {
    if (marketData && asset) {
      let data = marketData.find(e => e.id === asset.id)
      setAssetMarketData(data)
    }
  }, [marketData, asset])

  return (
    <div>
      {assetMarketData ?
        <div className="container">
          <div className="card">
            <div className="card-body mb-3">
              <div className="d-flex mt-3 mb-3 justify-content-center">
                <div className="d-flex flex-column">
                  <img className="align-self-center" src={assetMarketData.image} alt={asset.id + " logo"} width="90px" height="90px"/>
                  <h2 className="align-self-center mt-2">{asset ? asset.quantity : 0} {assetMarketData.symbol.toUpperCase()}</h2>
                  <div className="text-center">{(assetMarketData.current_price * (asset ? asset.quantity : 0)).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="d-grid col-3 col-lg-2 me-2">
                  <button className="btn btn-primary" style={{height: "2.7rem"}} type="button" onClick={handleClickOnSendButton}>Send</button>
                </div>
                <div className="d-grid col-3 col-lg-2">
                  <button className="btn btn-primary" type="button" style={{height: "2.7rem"}} onClick={handleClickOnReceiveButton}>Receive</button>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-center mt-5">Transaction History</h3>
          <TxList assetId={asset.id} symbol={assetMarketData.symbol.toUpperCase()} price={assetMarketData.current_price}/>
        </div>
        : <Spinner></Spinner>
      }
    </div>
  )
}

export default Asset

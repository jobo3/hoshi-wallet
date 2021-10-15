import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import TxList from './TxList'
import Spinner from './Spinner'

export const Asset = () => {
  let { assetId } = useParams()

  const asset = useSelector((state) => {
    if (state.portfolio != null) 
      return state.portfolio.find(e => e.id === assetId)

    return null
  })
  const marketData = useSelector((state) => state.marketData)
  const [assetMarketData, setAssetMarketData] = useState(null)

  // display currency
  const displayCurrency = useSelector((state) => state.settings.display_currency)

  let quantity = 0
  if (asset) {
    quantity = asset.quantity
  }

// redirection
const history = useHistory()
const handleClickOnReceiveButton = (e, assetId) => {
  e.preventDefault()
  history.push(`/wallet/${assetId}/receive`)
}

const handleClickOnSendButton = (e, assetId) => {
  e.preventDefault()
  history.push(`/wallet/${assetId}/send`)
}

  useEffect(() => {
    if (marketData && asset) {
      let data = marketData.find(e => e.id === asset.id)
      console.log(data)
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
                  <h2 className="align-self-center mt-2">{quantity} {assetMarketData.symbol.toUpperCase()}</h2>
                  <div className="text-center">{(assetMarketData.current_price * quantity).toLocaleString('en-US', {style:'currency', currency: displayCurrency})}</div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="d-grid col-3 col-lg-2 me-2">
                <button className="btn btn-primary" style={{height: "2.7rem"}} type="button" onClick={ e => handleClickOnSendButton(e, assetId) }>Send</button>
                </div>
                <div className="d-grid col-3 col-lg-2">
                  <button className="btn btn-primary" type="button" style={{height: "2.7rem"}} onClick={ e => handleClickOnReceiveButton(e, assetId) }>Receive</button>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-center mt-5">Transaction History</h3>
          <TxList assetId={asset.id} symbol={assetMarketData.symbol.toUpperCase()}/>
        </div>
        : <Spinner></Spinner>
      }
    </div>
  )
}

export default Asset
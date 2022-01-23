import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from './Spinner'

const BuyAmountView = () => {

  const MAX_PURCHASE_AMOUNT = 10000

  const { assetId } = useParams()

  const asset = useSelector((state) => {
    if (state.portfolio != null) 
      return state.portfolio.find(e => e.id === assetId)
    else
      return null
  })
  const assetMarketData = useSelector((state) => {
    let val = state.marketData?.find(e => e.id === assetId)
    if (val === undefined) 
      return null
    else
      return val
  })

  const displayCurrency = useSelector((state) => state.settings.displayCurrency)

  // in displayCurrency units
  const [purchaseValue, setPurchaseValue] = useState(100)
  const [coinsAmount, setCoinsAmount] = useState(0)
  const [buyButtonEnabled, setBuyButtonEnabled] = useState(true)

  useEffect(() => {
    if (assetMarketData != null) {
      setCoinsAmount(purchaseValue / assetMarketData.current_price)
    }
  }, [purchaseValue, assetMarketData])

  const handlePurchaseValueChange = (event) => {
    let value = Number(event.target.value)
    if (value > MAX_PURCHASE_AMOUNT) {
      setPurchaseValue(MAX_PURCHASE_AMOUNT)
    }
    else {
      setPurchaseValue(value)
    }
  }

  const navigate = useNavigate()
  
  const handleClickOnBuyButton = () => {
    navigate(`checkout?value=${purchaseValue}&currency=${displayCurrency}`)
  }

  return (
    <>
      { asset && assetMarketData ?
        <div>
          <div className="card mb-3">
            <div className="card-body text-center">
              <h2>Buy {assetMarketData.name}</h2>
              <p className="fs-1">{purchaseValue.toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 2})}</p>
              <p className="text-muted">~{coinsAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 8}) + ' ' + assetMarketData.symbol.toUpperCase()}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div>
                <label htmlFor="purchaseValueInput" className="form-label">Purchase Value ({displayCurrency.toUpperCase()})</label>
                <input type="number" value={purchaseValue} className="form-control" id="purchaseValueInput" aria-describedby="purchase value input" min="0.00" max="10000.00" step="1" onChange={handlePurchaseValueChange} />
                <button type="button" className="btn btn-primary mt-3" onClick={handleClickOnBuyButton}>Buy</button>
              </div>
            </div>
          </div>
        </div>
        : <Spinner/>
      }
    </>
  )
}


export default BuyAmountView;

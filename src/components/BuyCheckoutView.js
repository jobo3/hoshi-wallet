import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Big from 'big.js'
import AssetHelper from '../utils/assetHelper'
import { newTx } from '../features/portfolio/portfolioSlice'
import HDWallet from '../utils/hdWallet'

const BuyCheckoutView = () => {

  const { assetId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  let purchaseValue = new Big(searchParams.get('value'))
  let displayCurrency = searchParams.get('currency')

  const assetMarketData = useSelector((state) => {
    let val = state.marketData?.find(e => e.id === assetId)
    if (val === undefined) 
      return null
    else
      return val
  })

  const portfolio = useSelector((state) => state.portfolio)
  const settings = useSelector((state) => state.settings)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [years, setYears] = useState(new Array())

  useEffect(() => {
    let date = new Date()
    let year = date.getFullYear()
    let years = []
    for (let i = 0; i < 10; i++) {
      years.push(year+i)
    }
    setYears(years)
  }, [])

  const handleOnSubmit = (event) => {
    event.preventDefault()
    let form = event.target
    if (form.checkValidity()) {  
      try {
        let amount = purchaseValue.div(assetMarketData.current_price)
        let tx = {
          asset_id: assetId,
          address: new HDWallet(settings.mnemonic).getAddress(assetId),
          amount: Number(amount.toFixed(8))
        }
        tx = AssetHelper.createIncomingTransaction(tx)
        console.log(tx)
        dispatch(newTx(tx))
        navigate('/wallet/'+assetId)
      } catch(error) {
        console.error(error)
        //setShowToast(true)
      }
    }
    form.classList.add("was-validated")
  }

  return (
    <>
      { assetMarketData && displayCurrency ?
      <div>
        <div className="card mt-3 mb-3">
          <div className="card-body text-center">
            <p className="fs-1">You pay: {(purchaseValue.toNumber()).toLocaleString('en-US', {style:'currency', currency: displayCurrency, maximumFractionDigits: 2})}</p>
            <p className="fs-1">You get: {(purchaseValue.div(assetMarketData.current_price).toNumber()).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 8}) + ' ' + assetMarketData.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h3>Pay with Credit Card</h3>
            <form className="needs-validation" onSubmit={handleOnSubmit} noValidate>
              <div className="row mt-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="ccName">Name on card</label>
                  <input type="text" className="form-control" id="ccName" required/>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Just use random text ;)
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="ccNumber">Card number</label>
                  <input type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="off" className="form-control" id="ccNumber" required/>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Just use a random number 13-19 digits long ;)
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4 mb-3">
                  <label htmlFor="monthSelect" className="form-label">Month</label>
                  <select className="form-select" id="monthSelect" aria-label="Month select" required>
                    <option value="1">1 - January</option>
                    <option value="2">2 - February</option>
                    <option value="3">3 - March</option>
                    <option value="4">4 - April</option>
                    <option value="5">5 - May</option>
                    <option value="6">6 - June</option>
                    <option value="7">7 - July</option>
                    <option value="8">8 - August</option>
                    <option value="9">9 - September</option>
                    <option value="10">10 - October</option>
                    <option value="11">11 - November</option>
                    <option value="12">12 - December</option>
                  </select>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </div>
                <div className="col-sm-4 mb-3">
                  <label htmlFor="yearSelect" className="form-label">Year</label>
                  <select className="form-select" id="yearSelect" aria-label="Year select" required>
                    { years && years.map( (y,i) => <option value={y} key={i}>{y}</option> ) }
                  </select>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </div>
                <div className="col-sm-4 mb-3">
                  <label htmlFor="ccCVV" className="form-label">CVV</label>
                  <input type="text" className="form-control" id="ccCVV" pattern="[0-9]{3}" required/>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Just use a random number 3 digits long ;)
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Pay</button>
            </form>
          </div>
        </div>
      </div>
      :
      <div></div>
      }
    </>
  )
}

export default BuyCheckoutView

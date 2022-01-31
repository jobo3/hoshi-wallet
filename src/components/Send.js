import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from './Spinner'
import { checkInputValidity, setAddressInputValidity, setFeeInputValidity, setSendAmountInputValidity } from '../utils/validity'
import Big from 'big.js'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import { createOutgoingTransaction, getAmountStep, getTxFee, getTxFeeStep } from '../utils/assetHelper'
import { newTx } from '../features/portfolio/portfolioSlice'

const Send = () => {
  let { assetId } = useParams()
  const marketData = useSelector((state) => state.marketData)
  const [assetMarketData, setAssetMarketData] = useState(null)
  const portfolio = useSelector((state) => state.portfolio)
  const dispatch = useDispatch()
  const asset = useSelector((state) => {
    if (state.portfolio) 
      return state.portfolio.find(e => e.id === assetId)

    return null
  })
  const amountInputRef = useRef(null)
  const [amount, setAmount] = useState(null)

  const addressInputRef = useRef(null)
  const [address, setAddress] = useState(null)

  const [invalidAmountFeedback, setInvalidAmountFeedback] = useState('')

  useEffect(() => {
    if (marketData && asset) {
      let data = marketData.find(e => e.id === asset.id)
      setAssetMarketData(data)
    }
  }, [marketData, asset])

  // tx fee for cypherpunk ui
  const uiMode = useSelector(state => state.settings.ui)
  const [txFee, setTxFee] = useState(null)
  const [invalidFeeFeedback, setInvalidFeeFeedback] = useState('')
  const feeInputRef = useRef(null)

  const handleSend = (e) => {
    e.preventDefault()
    const amountInput = amountInputRef.current
    const addressInput = addressInputRef.current
    const feeInput = feeInputRef.current
    let amountFeedback = setSendAmountInputValidity(amountInput, asset.quantity)
    setInvalidAmountFeedback(amountFeedback)
    let isAmountValid = checkInputValidity(amountInput)
    if (isAmountValid) {
      setAmount(Number.parseFloat(amountInput.value))
    }
    setAddressInputValidity(addressInput, assetId)
    let isAddressValid = checkInputValidity(addressInput)
    if (isAddressValid) {
      setAddress(addressInput.value)
    }

    if (uiMode === 2) { // manual fee
      let feeFeedback = setFeeInputValidity(feeInput, asset.quantity)
      let isFeeValid = checkInputValidity(feeInput)
      if (isFeeValid) {
        setTxFee(Number.parseFloat(feeInput.value))
      }
      else {
        setInvalidFeeFeedback(feeFeedback)
      }

      if (isAddressValid && isAmountValid && isFeeValid) {
        setShowModal(true)
      }
    }
    else {
      // if amount and address are valid continue
      if (isAddressValid && isAmountValid) {
        setShowModal(true)
      }
    }

  } 

  // redirection
  const navigate = useNavigate()

  const sendTx = () => {
    let tx = {
      asset_id: assetId,
      address: address,
      amount: amount,
      fee: txFee
    }
    try {
      let balance = portfolio.find(e => e.id === tx.asset_id).quantity
      let createdTx = createOutgoingTransaction(balance, tx)
      //console.log(createdTx)
      dispatch(newTx(createdTx))
      navigate(-1)
    } catch(error) {
      setShowToast(true)
    }
    setShowModal(false)
  }

  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  if (asset && assetMarketData) {
      return (
        <div>
          <div className="container">
            <h1 className="mb-4 text-center">Send {assetMarketData.name}</h1>
            <div className="card">
              <div className="card-body">
                <div>
                    <form className="needs-validation" onSubmit={handleSend} noValidate>
                      <div className="mb-3">
                        <label htmlFor="addressInput" className="form-label">Address</label>
                        <input type="text" className="form-control" id="addressInput" ref={addressInputRef} />
                        <div className="invalid-feedback">Address is not valid</div>
                      </div>
                      <div>
                        <label htmlFor="amountInput" className="form-label">Amount</label>
                        <input type="number" min="0" step="any" className="form-control" id="amountInput" ref={amountInputRef}/>
                        <div className="invalid-feedback">{invalidAmountFeedback}</div>
                        <div className="text-muted mt-2">Balance: {asset.quantity} {assetMarketData.symbol.toUpperCase()}</div>
                      </div>
                      { uiMode === 2 && // enable manual tx fee for cypherpunk ui
                        <div className="mt-3">
                          <label htmlFor="feeInput" className="form-label">Transaction fee (Optional)</label>
                          <input type="number" min="0" step="any" className="form-control" id="feeInput" ref={feeInputRef} />
                          <div className="invalid-feedback">{invalidFeeFeedback}</div>
                        </div>
                      }
                      <div className="mt-4">
                        <button type="submit" className="btn btn-primary btn-lg">Send</button>
                      </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
          <ConfirmModal title="Confirm Transaction" show={showModal} onClose={() => setShowModal(false)} onConfirm={sendTx}>
            <p className="text-break">Amount: {amount?.toString()}</p>
            <p className="text-break">Address: {address}</p>
            <p className="text-break">Transaction fee: {txFee ? txFee : getTxFee(asset.id)}</p>
          </ConfirmModal>
          <Toast show={showToast} onClose={() => setShowToast(false)} message="Error" color="danger" delay={2000}></Toast>
        </div>
      )
  }
  else {
    return (<Spinner></Spinner>)
  }
}

export default Send

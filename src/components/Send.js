import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'
import { checkInputValidity, setAddressInputValidity, setSendAmountInputValidity } from '../utils/validity'
import Big from 'big.js'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'

const Send = () => {
  let { assetId } = useParams()
  const marketData = useSelector((state) => state.marketData)
  const [assetMarketData, setAssetMarketData] = useState(null)
  const asset = useSelector((state) => {
    if (state.portfolio) 
      return state.portfolio.find(e => e.id === assetId)

    return null
  })
  const amountInputRef = useRef(null)
  const [amount, setAmount] = useState(null)

  const addressInputRef = useRef(null)
  const [address, setAddress] = useState(null)
  

  // TODO: set the smallest unit for the currency
  // TODO: fee control

  useEffect(() => {
    if (marketData && asset) {
      let data = marketData.find(e => e.id === asset.id)
      setAssetMarketData(data)
    }
  }, [marketData, asset])

  const validateAmount = () => {
    const input = amountInputRef.current
    setSendAmountInputValidity(input, asset.quantity)
    checkInputValidity(input)
  }

  const validateAddress = () => {
    const input = addressInputRef.current
    setAddressInputValidity(input, assetId)
    checkInputValidity(input)
  }

  const handleSend = () => {
    const amountInput = amountInputRef.current
    const addressInput = addressInputRef.current
    setSendAmountInputValidity(amountInput, asset.quantity)
    let isAmountValid = checkInputValidity(amountInput)
    if (isAmountValid) {
      setAmount(Big(amountInput.value))
    }
    setAddressInputValidity(addressInput, assetId)
    let isAddressValid = checkInputValidity(addressInput)
    if (isAddressValid) {
      setAddress(addressInput.value)
    }

    // if amount and address are valid continue
    if (isAddressValid && isAmountValid) {
      setShowModal(true)
    }

  } 

  // redirection
  const navigate = useNavigate()

  const sendTx = () => {
    let tx = {
      asset_id: assetId,
      address: address,
      amount: amount,
    }

    fetch('/api/send', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tx)
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      navigate(-1) // go back
    })
    .catch( e => {
      setShowToast(true)
      console.log(e)
    })

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
                    <form>
                      <div className="mb-3">
                        <label htmlFor="addressInput" className="form-label">Address</label>
                        <div className="input-group">
                          <input type="text" className="form-control" id="addressInput" ref={addressInputRef} onChange={validateAddress}/>
                          {/* <button class="btn btn-secondary" type="button" id="pasteAddressBtn">Paste</button> */}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="amountInput" className="form-label">Amount</label>
                        <input type="number" min="0" step="any" className="form-control" id="amountInput" ref={amountInputRef} onChange={validateAmount} />
                        <div className="text-muted mt-2">Balance: {asset.quantity} {assetMarketData.symbol.toUpperCase()}</div>
                      </div>
                      <div>
                        <button type="button" className="btn btn-primary btn-lg" onClick={handleSend}>Send</button>
                      </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
          <ConfirmModal title="Confirm Transaction" show={showModal} onClose={() => setShowModal(false)} onConfirm={sendTx}>
            <p className="text-break">Amount: {amount?.toString()}</p>
            <p className="text-break">Address: {address}</p>
            <p className="text-break">Transaction fee: 0.0003</p>
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
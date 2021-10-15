import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import QRCode from 'qrcode'
import Spinner from './Spinner'
//import { Toast } from 'bootstrap'
import Toast from './Toast'
import copy from 'copy-to-clipboard'
import { checkInputValidity, setAmountInputValidity } from '../utils/validity'
 

const Receive = () => {
  let { assetId } = useParams()
  
  const [qrimage, setQrimage] = useState(null)
  const qrimageRef = useCallback((node) => {
      setQrimage(node)
  }, [])
  const [address, setAddress] = useState(null)
  const marketData = useSelector((state) => state.marketData)
  const [assetMarketData, setAssetMarketData] = useState(null)

  const amountInputRef = useRef(null)
  const [receivingAmount, setReceivingAmount] = useState(null) 
  
  useEffect(() => {
    const getReceivingAddress = async () => {
      try {
        const response = await fetch(`/api/addresses/${assetId}/new`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        setAddress(data.address)
        console.log(data)
      }
      catch(error) {
        console.error(error)
      }
    }
    if (assetId) {
      getReceivingAddress()
    }
  }, [assetId])

  useEffect(() => {
    if (marketData != null) {
      let data = marketData.find(e => e.id === assetId)
      setAssetMarketData(data)
    }
  }, [marketData, assetId])

  useEffect(() => {
    const showQR = () => {
      if (address && qrimage) {
        qrimage.onload = () => {
          // set natural image width and height
          qrimage.width = qrimage.naturalWidth
          qrimage.height = qrimage.naturalHeight
        }
        let uriScheme = encodeURI(`${address.asset_id}:${address.address}`)
        if (receivingAmount) {
          uriScheme += encodeURI(`?amount=${receivingAmount}`)
        }
        QRCode.toDataURL(uriScheme)
        .then(url => {
          qrimage.src = url
        })
        .catch(err => {
          console.error(err)
        })
      }
    }
    showQR()
  }, [address, qrimage, receivingAmount])


  const amountDiv = useRef(null)

  const toggleAmountDiv = () => {
    if (amountDiv && amountDiv.current) {
      amountDiv.current.classList.toggle("d-none")
    }
  }

  const cryptoAddressRef = useRef(null)
  const [showToast, setShowToast] = useState(false)

  const copyAddressToClipboard = () => {
    const cryptoAddressEl = cryptoAddressRef.current
    let text = cryptoAddressEl.innerText

    copy(text, {debug: true})

    setShowToast(true)
  }

  const handleAmountInput = (event) => {
    const input = amountInputRef.current
    setAmountInputValidity(input)
  }

  const validateAndSubmitAmountInput = () => {
    const input = amountInputRef.current
    setAmountInputValidity(input)
    let isValid = checkInputValidity(input)
    if (isValid) {
      setReceivingAmount(Number(input.value))
    }
  }

  return (
    <>
      { address == null || assetMarketData == null ? 
        <Spinner></Spinner>
        :
        <div>
          <h1 className="text-center">Receive {assetMarketData.name}</h1>
          <div>
            <div className="mx-auto mt-5">
              <div className="container" style={{ maxWidth: "700px"}}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-center flex-column">
                      <img ref={qrimageRef} alt="" className="mx-auto"></img>
                      <div id="cryptoAddress" ref={cryptoAddressRef} className="text-center mt-2">{address.address}</div>
                    </div>
                    <hr></hr>
                    <div className="d-flex justify-content-center">
                      <button type="button" className="btn btn-primary me-2" onClick={() => copyAddressToClipboard()}><i className="bi bi-clipboard"></i> Copy</button>
                      <button type="button" className="btn btn-primary" onClick={() => toggleAmountDiv()}><i className="bi bi-currency-dollar"></i> Amount</button>
                    </div>
                    <div ref={amountDiv} className="d-none mt-3">
                        <label htmlFor="amountInput" className="form-label">Amount</label>
                        <div className="input-group">
                          <input type="number" min="0" step="any" className="form-control" id="amountInput" ref={amountInputRef} onChange={handleAmountInput} placeholder="" />
                          <button type="button" className="btn btn-primary" style={{ minWidth: "60px" }} onClick={validateAndSubmitAmountInput}>Set</button>
                        </div>
                    </div>
                  </div>
                </div>
                <Toast show={showToast} onClose={() => setShowToast(false)} message="Copied Address!" delay={2000}></Toast>
              </div>
            </div>
          </div>
        </div> 
      }
    </>
  )
}

export default Receive
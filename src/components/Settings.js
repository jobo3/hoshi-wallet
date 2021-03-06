import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDisplayCurrency, setDarkMode, setUI } from '../features/settings/settingsSlice'
import HDWallet from '../utils/hdWallet'

const Settings = () => {

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const darkMode = useSelector(state => state.settings.darkMode)
  const uiMode = useSelector(state => state.settings.ui)
  const mnemonic = useSelector(state => state.settings.mnemonic)
  const dispatch = useDispatch()

  const handleDarkModeSwitch = (e) => {
    let value = e.target.checked
    dispatch(setDarkMode(value))
  }

  const handleSelectDisplayCurrency = (e) => {
    let value = e.target.value
    dispatch(setDisplayCurrency(value))
  }

  const handleSelectUi = (e) => {
    let value = e.target.value
    dispatch(setUI(Number(value)))
  }

  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    if (mnemonic) {
      setWallet(new HDWallet(mnemonic))
    }
  }, [])

  const downloadXpriv = () => {
    if (wallet) {
      const link = document.createElement("a")
      const blob = new Blob([wallet.exportXpriv()], {type: 'text/plain'})
      link.href = URL.createObjectURL(blob)
      link.download = "xpriv.txt"
      document.body.appendChild(link)
      link.click()
    }
  }

  const downloadXpub = () => {
    if (wallet) {
      const link = document.createElement("a")
      const blob = new Blob([wallet.exportXpub()], {type: 'text/plain'})
      link.href = URL.createObjectURL(blob)
      link.download = "xpub.txt"
      document.body.appendChild(link)
      link.click()
    }
  }

  return (
    <div className="container">
      <h1 className="text-center">Settings</h1>
      <div className="mt-5">
        <div className="card">
          <div className="card-body">
            <h5>Formats</h5>
            <div className="d-flex flex-wrap">
              <label htmlFor="selectCurrency" className="col-form-label me-3">Currency:</label>
              <div className="flex-shrink-1" style={{ minWidth: "120px" }}>
                <select id="selectCurrency" className="form-select" aria-label="Select currency" defaultValue={displayCurrency} onChange={handleSelectDisplayCurrency}>
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="chf">CHF</option>
                  <option value="jpy">JPY</option>
                </select>
              </div>
            </div>
            <hr></hr>
            <h5>UI</h5>
            <div className="d-flex flex-wrap mt-3">
              <label htmlFor="selectUi" className="col-form-label me-3">UI Mode:</label>
              <div className="flex-shrink-1" style={{ minWidth: "120px" }}>
                <select id="selectUI" className="form-select" aria-label="Select currency" defaultValue={uiMode} onChange={handleSelectUi}>
                  <option value="0">Rookie UI</option>
                  <option value="1">Trader UI</option>
                  <option value="2">Cypherpunk UI</option>
                </select>
              </div>
            </div>
            <div className="d-flex mt-3">
              <div className="form-check form-switch">
                <label htmlFor="darkModeSwitch">Dark Mode</label>
                <input className="form-check-input" type="checkbox" id="darkModeSwitch" onChange={handleDarkModeSwitch} checked={darkMode}></input>
              </div>
            </div>
            <hr></hr>
            <h5>Wallet</h5>
            <div className="alert alert-warning d-inline-block mt-3" role="alert">
              <strong>Warning!</strong> Don't share your recovery words with anyone.
            </div>
            <div className="mt-3">
              <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMnemonic" aria-expanded="false" aria-controls="collapseMnemonic">
                  Show Recovery Words
              </button>
              <div className="collapse" id="collapseMnemonic">
                <div className="card mt-3 p-2 code-block">
                  {mnemonic ? mnemonic : ""}
                </div>
              </div>
            </div>
            { uiMode === 2 && //cypherpunk
            <>
              <hr></hr>
              <h5>Advanced</h5>
              <div className="alert alert-warning d-inline-block mt-3" role="alert">
                <strong>Warning!</strong> Only for advanced users.
              </div>
              <div className="mt-3">
                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseXpriv" aria-expanded="false" aria-controls="collapseXpriv">
                  Show Xpriv
                </button>
                <button className="btn btn-link ms-2" type="button" onClick={downloadXpriv}>Download Xpriv</button>
                <div className="collapse" id="collapseXpriv">
                  <div className="card mt-3 p-2 code-block">
                    {wallet ? wallet.exportXpriv() : ""}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseXpub" aria-expanded="false" aria-controls="collapseXpub">
                  Show Xpub
                </button>
                <button className="btn btn-link ms-2" type="button" onClick={downloadXpub}>Download Xpub</button>
                <div className="collapse" id="collapseXpub">
                  <div className="card mt-3 p-2 code-block">
                    {wallet ? wallet.exportXpub() : ""}
                  </div>
                </div>
              </div>
            </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDisplayCurrency, setDarkMode, setUI } from '../features/settings/settingsSlice'

const Settings = () => {

  const displayCurrency = useSelector(state => state.settings.displayCurrency)
  const darkMode = useSelector(state => state.settings.darkMode)
  const uiMode = useSelector(state => state.settings.uiMode)
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
    dispatch(setUI(value))
  }

  return (
    <div className="container">
      <h1 className="text-center">Settings</h1>
      <div className="mt-5">
        <div className="card">
          <div className="card-body">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

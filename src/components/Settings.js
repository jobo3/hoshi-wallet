import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDisplayCurrency, setDarkMode } from '../features/settings/settingsSlice'

const Settings = () => {

  const displayCurrency = useSelector(state => state.settings.display_currency)
  const darkMode = useSelector(state => state.settings.darkMode)
  const dispatch = useDispatch()

  return (
    <div>
      <h1 className="text-center">Settings</h1>
      <div className="mt-5">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap">
              <label htmlFor="selectCurrency" className="col-form-label me-3">Currency:</label>
              <div className="flex-shrink-1" style={{ minWidth: "120px" }}>
                <select id="selectCurrency" className="form-select" aria-label="Select currency" defaultValue={displayCurrency}
                onChange={e => {
                  dispatch(setDisplayCurrency(e.target.value))
                }
                }>
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="chf">CHF</option>
                  <option value="jpy">JPY</option>
                </select>
              </div>
            </div>
            <div className="d-flex mt-3">
                <div className="form-check form-switch">
                  <label htmlFor="darkModeSwitch">Dark Mode</label>
                  <input className="form-check-input" type="checkbox" id="darkModeSwitch" onChange={e => { dispatch(setDarkMode(e.target.checked))}} checked={darkMode}></input>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
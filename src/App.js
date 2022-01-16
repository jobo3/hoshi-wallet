import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './App.scss'
import DataFetcher from './components/DataFetcher'

import { useSelector, useDispatch } from 'react-redux'
import { setDarkMode, setDisplayCurrency, setMnemonic } from './features/settings/settingsSlice'
import classNames from 'classnames'
import WalletSetup from './components/WalletSetup'
import MainView from './components/MainView'
import { useEffect } from 'react'

const App = () => {

  const darkMode = useSelector((state) => state.settings.darkMode)

  const appClasses = classNames({
    'App': true,
    'dark': darkMode,
  })

  const mnemonic = useSelector((state) => state.settings.mnemonic)
  const dispatch = useDispatch()

  useEffect(() => {
    if (mnemonic == null) {
      // use localStorage to check if the mnemonic exists
      // if the mnemonic exists, it is used for the wallet, if it doesn't exist the user is redirected to wallet setup
      dispatch(setMnemonic(localStorage.getItem('mnemonic')))
    }
    console.log(mnemonic)
  }, [mnemonic])

  useEffect(() => {
    // load settings
    let loadedDarkMode = localStorage.getItem('settings_darkmode')
    console.log(loadedDarkMode)
    if (loadedDarkMode != null) {
      let value = loadedDarkMode === "true" ? true : false
      dispatch(setDarkMode(value))
    }
    
    let loadedDisplayCurrency = localStorage.getItem('settings_display_currency')
    if (loadedDisplayCurrency != null)
      dispatch(setDisplayCurrency(loadedDisplayCurrency))

  }, [])

  return (
      <div className={appClasses}>
        { mnemonic == null ? 
          <Routes>
            <Route path="/*" element={<Navigate to="/setup" />} />
            <Route path="/setup/*" element={<WalletSetup/>} />
          </Routes>
          :
          <Routes>
            <Route path="/*" element={<><DataFetcher/><MainView/></>} />
          </Routes>
        }
      </div>
    );
}

export default App

import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

import './App.scss'
import DataFetcher from './components/DataFetcher'

import { useSelector } from 'react-redux'
import classNames from 'classnames'
import WalletSetup from './components/WalletSetup'
import MainView from './components/MainView'
import { useEffect } from 'react'
import PriceAlertWatcher from './components/PriceAlertWatcher'

const App = () => {

  const darkMode = useSelector((state) => state.settings.darkMode)

  const appClasses = classNames({
    'App': true,
    'dark': darkMode,
  })

  const mnemonic = useSelector((state) => state.settings.mnemonic)

  const navigate = useNavigate()

  useEffect(() => {
    console.log(mnemonic)
    if (mnemonic == null) {
      // if the mnemonic exists, it is used for the wallet, if it doesn't exist the user is redirected to wallet setup
      navigate("/setup", {replace: true})
    }
  }, [mnemonic])

  return (
      <div className={appClasses}>
          <Routes>
            <Route path="/*" element={<><DataFetcher/><PriceAlertWatcher/><MainView/></>} />
            <Route path="/setup/*" element={<WalletSetup/>} />
          </Routes>
      </div>
    );
}

export default App

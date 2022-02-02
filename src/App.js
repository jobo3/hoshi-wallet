import {
  Routes,
  Route,
  useNavigate,
  useMatch,
} from 'react-router-dom'

import './App.scss'
import { useSelector } from 'react-redux'
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

  const navigate = useNavigate()
  const match = useMatch('/setup/*')

  useEffect(() => {
    // if there is no mnemonic go to setup
    if (mnemonic == null) {
      // only go to setup if we are not already there
      if (match == null || (match && match.pathnameBase !== "/setup")) {
        navigate("/setup", {replace: true})
      }
    }
  }, [mnemonic, match])

  return (
      <div className={appClasses}>
          <Routes>
            <Route path="/*" element={<MainView/>} />
            { mnemonic == null && <Route path="/setup/*" element={<WalletSetup/>} /> }
          </Routes>
      </div>
    );
}

export default App

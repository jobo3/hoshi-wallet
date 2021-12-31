import {
  Switch,
  Route,
  NavLink,
  Redirect,
  useHistory
} from 'react-router-dom'

import './App.scss'
import Navbar from './components/Navbar'
import Portfolio from './components/Portfolio'
import Sidebar from './components/Sidebar'
import SidebarItem from './components/SidebarItem'
import Asset from './components/Asset'
import DataFetcher from './components/DataFetcher'
import Receive from './components/Receive'
import Send from './components/Send'
import Settings from './components/Settings'

import { useSelector } from 'react-redux'
import classNames from 'classnames'
import WalletSetup from './components/WalletSetup'

const App = () => {

  const darkMode = useSelector((state) => state.settings.darkMode)

  const appClasses = classNames({
    'App': true,
    'dark': darkMode,
  })

  const history = useHistory()
  // use localStorage to check if the mnemonic exists
  // if the mnemonic exists, it is used for the wallet, if it doesn't exist the user is redirected to wallet setup
  const mnemonic = localStorage.getItem('mnemonic')
  console.log(mnemonic)
  if (mnemonic == null) {
    history.replace('/setup')
  }
  else {
    history.replace('/wallet')
  }

  return (
      <div className={appClasses}>
        <Switch>
          <Route path="/setup" component={WalletSetup} />
          <Route>
            <DataFetcher />
            <header>
              <Navbar/>     
            </header>
            <div className="main">
              <Sidebar>
                <SidebarItem>
                  <NavLink to="/wallet" className="nav-link link-light">
                    <i className="bi bi-wallet me-2"></i>
                    Wallet
                  </NavLink>
                </SidebarItem>
                {/* <SidebarItem>
                  <NavLink exact to="/market" className="nav-link link-light">
                  <i className="bi bi-bar-chart me-2"></i>
                    Market
                  </NavLink>
                </SidebarItem> */}
                <SidebarItem>
                  <NavLink exact to="/settings" className="nav-link link-light">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </NavLink>
                </SidebarItem>
              </Sidebar>
              <div id="content" className="container-fluid overflow-auto">
                <div className="content-max-width mx-auto mb-5">
                <Switch>
                  <Route exact path="/wallet">
                    <Portfolio></Portfolio>
                  </Route>
                  <Route exact path="/wallet/:assetId">
                    <Asset></Asset>
                  </Route>
                  <Route exact path="/wallet/:assetId/receive">
                    <Receive></Receive>
                  </Route>
                  <Route exact path="/wallet/:assetId/send">
                    <Send></Send>
                  </Route>
                  <Route exact path="/market">
                    <h2>Market</h2>
                  </Route>
                  <Route exact path="/settings">
                    <Settings></Settings>
                  </Route>
                </Switch>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    );
}

export default App;

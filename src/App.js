import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
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

function App() {

const darkMode = useSelector((state) => state.settings.darkMode)

const appClasses = classNames({
  'App': true,
  'dark': darkMode,
})
    return (
        <div className={appClasses}>
          <DataFetcher />
          <Router>
            <header>
              <Navbar/>     
            </header>
              <div className="main">
                <Sidebar>
                  <SidebarItem>
                    <NavLink  to="/wallet" className="nav-link link-light">
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
                    <Route exact path="/">
                      <Redirect to="/wallet"></Redirect>
                    </Route>
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
            </Router>
        </div>
    );
}

export default App;

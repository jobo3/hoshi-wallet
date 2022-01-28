import React from 'react'
import {
  Routes,
  Route,
  NavLink,
  Navigate
} from 'react-router-dom'
import Navbar from './Navbar'
import Portfolio from './Portfolio'
import Sidebar from './Sidebar'
import SidebarItem from './SidebarItem'
import Asset from './Asset'
import Receive from './Receive'
import Send from './Send'
import Settings from './Settings'
import Market from './Market'
import ChartView from './ChartView'
import BuyAsset from './BuyAsset'
import { useSelector } from 'react-redux'
import PriceAlertView from './PriceAlertView'
import DataFetcher from './DataFetcher'
import PriceAlertWatcher from './PriceAlertWatcher'


const MainView = () => {

  const uiMode = useSelector(state => state.settings.ui)
  const unseenAlert = useSelector(state => state.priceAlerts.find(e => !e.hidden))

  return (
    <>
      <DataFetcher/>
      { uiMode > 0 && <PriceAlertWatcher/> } 
      <header></header>
      <div className="main">
        <Sidebar>
          <SidebarItem>
            <NavLink to="/wallet" className="nav-link link-light">
              <i className="bi bi-wallet me-2"></i>
              Wallet
            </NavLink>
          </SidebarItem>
          <SidebarItem>
            <NavLink to="/market" className="nav-link link-light">
              <i className="bi bi-bar-chart me-2"></i>
              Market
            </NavLink>
          </SidebarItem>
          <SidebarItem>
            <NavLink to="/settings" className="nav-link link-light">
              <i className="bi bi-gear me-2"></i>
              Settings
            </NavLink>
          </SidebarItem>
          { uiMode > 0 && // uiMode trader or cypherpunk
            <SidebarItem>
              <NavLink to="/alerts" className="nav-link link-light">
                <div className="position-relative d-inline-block me-2">
                  <i className="bi bi-bell"></i>
                  { unseenAlert !== undefined && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger p-1"><span className="visually-hidden">unseen alerts</span></span> }
                </div>
                <div className="d-inline-block">Alerts</div>
              </NavLink>
            </SidebarItem>
          }
        </Sidebar>
        <div id="content" className="container-fluid overflow-auto">
          <div className="mx-auto mb-5">
            <Routes>
              <Route path="/" element={<Navigate to="/wallet"/>} />
              <Route path="wallet" element={<Portfolio/>} />
              <Route path="wallet/:assetId" element={<Asset/>} />
              <Route path="wallet/:assetId/receive" element={<Receive/>} />
              <Route path="wallet/:assetId/send" element={<Send/>} />
              <Route path="market" element={<Market/>} />
              <Route path="market/:coinId" element={<ChartView/>} />
              <Route path="settings" element={<Settings/>} />
              <Route path="buy/:assetId/*" element={<BuyAsset/>} /> 
              <Route path="alerts" element={<PriceAlertView/>} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </div>
      </div>
      <Navbar />
    </>
  )
}

export default MainView

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

const MainView = () => {
  return (
    <>
      <header>
        <Navbar />
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
            <NavLink end to="/settings" className="nav-link link-light">
              <i className="bi bi-gear me-2"></i>
              Settings
            </NavLink>
          </SidebarItem>
        </Sidebar>
        <div id="content" className="container-fluid overflow-auto">
          <div className="content-max-width mx-auto mb-5">
            <Routes>
              <Route path="/" element={<Navigate to="wallet"/>}></Route>
              <Route path="wallet" element={<Portfolio/>} />
              <Route path="wallet/:assetId" element={<Asset/>} />
              <Route path="wallet/:assetId/receive" element={<Receive/>} />
              <Route path="wallet/:assetId/send" element={<Send/>} />
              <Route path="market" />
              <Route path="settings" element={<Settings/>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainView
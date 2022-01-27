import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {

  const uiMode = useSelector(state => state.settings.ui)
  const unseenAlert = useSelector(state => state.priceAlerts.find(e => !e.hidden))

  return (
    <div>
      <nav className="navbar fixed-bottom navbar-expand navbar-dark app-navbar">
        <div className="container-fluid">
          <ul className="navbar-nav justify-content-around w-100">
            <li className="nav-item">
              <NavLink to="/wallet" className="nav-link">
                <i className="bi bi-wallet" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/market" className="nav-link">
                <i className="bi bi-bar-chart" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className="nav-link">
                <i className="bi bi-gear" />
              </NavLink>
            </li>
            { uiMode > 0 && // uiMode trader or cypherpunk
              <li className="nav-item">
                <NavLink to="/alerts" className="nav-link link-light">
                  <div className="position-relative">
                    <i className="bi bi-bell" />
                    { unseenAlert !== undefined && <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger p-1"><span class="visually-hidden">unseen alerts</span></span> }
                  </div>
                </NavLink>
              </li>
            }
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

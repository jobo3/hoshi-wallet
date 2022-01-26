import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {

  const uiMode = useSelector(state => state.settings.ui)

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
                  <i className="bi bi-bell me-2" />
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

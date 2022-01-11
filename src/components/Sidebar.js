import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Offcanvas } from 'bootstrap'

const Sidebar = (props) => {

  const location = useLocation()
  const locationRef = useRef(null)

  useEffect(() => {
    let offcanvasEl = document.getElementById(props.id)
    let offcanvas = Offcanvas.getOrCreateInstance(offcanvasEl)
    // if location changed
    if (locationRef.current && location.pathname !== locationRef.current.pathname) {
      offcanvas.hide()
    }
    locationRef.current = location
  }, [location])


  return (
    <>
      {/* mobile offcanvas sidebar*/}
      <div className="offcanvas offcanvas-start d-lg-none sidebar-bg" tabIndex="-1" id={props.id} aria-labelledby="offcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-white" id="offcanvasLabel">Hoshi Wallet</h5>
          <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav nav-pills flex-column">
            {props.children}
          </ul>
        </div>
      </div>
        {/* desktop sidebar - hidden on small screens */}
      <div id="desktopSidebar" className="d-flex flex-column flex-shrink-0 p-3 d-none d-lg-block sidebar-bg">
          <ul className="nav nav-pills flex-column">
            {props.children}
          </ul>
      </div>
    </>
  )
}

Sidebar.defaultProps = {
  id: "mobileSidebar"
}

export default Sidebar

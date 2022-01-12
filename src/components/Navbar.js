import React from 'react'

const Navbar = ({target = '#mobileSidebar'}) => {
  return (
  <div>
    <nav className="navbar navbar-expand-lg navbar-dark navbar-bg">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target={target} aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <a className="navbar-brand" href="/">Hoshi Wallet</a>
        </div>
      </div>
    </nav>
  </div>
  )
}

export default Navbar

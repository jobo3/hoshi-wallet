import React from 'react'

const Sidebar = (props) => {

  return (
    <>
      {/* desktop sidebar - hidden on small screens */}
      <div className="d-flex flex-column flex-shrink-0 p-3 d-none d-lg-block sidebar">
          <div className="text-white">
            <span className="fs-4">Hoshi Wallet</span>
            <hr />
          </div>
          <ul className="nav nav-pills flex-column">
            {props.children}
          </ul>
      </div>
    </>
  )
}

export default Sidebar

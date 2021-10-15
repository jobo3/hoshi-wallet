import React from 'react'

const SidebarItem = (props) => {
  return (
    <>
      <li className="nav-item">
          {props.children}
      </li>
    </>
  )
}

export default SidebarItem

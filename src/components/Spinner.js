import React from "react"

const Spinner = () => {
  
  return(
    <div className="center-rel">
      <div className="spinner-border text-info" role="status" style={{ width: "4rem", height: "4rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
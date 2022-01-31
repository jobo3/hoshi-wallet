import React from 'react'
import { useNavigate } from 'react-router-dom'

const WalletAction = () => {

  const navigate = useNavigate()

  return (
    <div className="container mb-3">
      <h1 className="mt-3">Wallet Setup</h1>
      <p className="fs-5 mt-4">Do you want to create a new wallet or restore a wallet from a backup?</p>
      <div className="d-grid gap-2 d-md-block mt-5">
        <button className="btn btn-lg btn-primary me-md-2" type="button" onClick={() => { navigate('/setup/create') }}>Create New Wallet</button> 
        <button className="btn btn-lg btn-primary" type="button" onClick={() => { navigate('/setup/restore') }}>Restore Wallet</button>
      </div>
    </div>
  )
}

export default WalletAction

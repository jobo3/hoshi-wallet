import React from 'react'
import WalletRestore from './WalletRestore'
import WalletSelectUi from './WalletSelectUi'
import WalletCreate from './WalletCreate'
import { Route, Routes, useNavigate } from 'react-router-dom'

const WalletSetup = () => {

  return (
      <div id="walletSetupContent">
        <Routes>
          <Route path="/" element={<SetupContainer/>} />
          <Route path="create/*" element={<WalletCreate/>} />
          <Route path="restore" element={<WalletRestore/>} />
          <Route path="selectui" element={<WalletSelectUi/>} />
        </Routes>
      </div>
  )
}

const SetupContainer = () => {
  const navigate = useNavigate()

  const restoreWalletBtnClicked = () => {
    navigate('/setup/restore')
  }

  const createWalletBtnClicked = () => {
    navigate('/setup/create')
  }

  return (
    <div id="setupContainer" className='container mx-auto' style={{maxWidth: "700px", height: "100vh"}}>
      <div className='d-flex flex-column justify-content-center h-100'>
        <button className='btn btn-lg btn-primary' type="button" onClick={createWalletBtnClicked}>Create New Wallet</button>
        <button className='btn btn-lg btn-primary mt-3' type="button" onClick={restoreWalletBtnClicked}>Restore Wallet</button>
      </div>
    </div>
  )
}

export default WalletSetup

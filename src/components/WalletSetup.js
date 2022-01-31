import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WalletRestore from './WalletRestore'
import WalletSelectUi from './WalletSelectUi'
import WalletCreate from './WalletCreate'
import WalletAction from './WalletAction'

const WalletSetup = () => {

  return (
      <div id="walletSetupContent">
        <Routes>
          <Route path="/" element={<WalletSelectUi/>} />
          <Route path="create/*" element={<WalletCreate/>} />
          <Route path="restore" element={<WalletRestore/>} />
          <Route path="action" element={<WalletAction/>} />
        </Routes>
      </div>
  )
}

export default WalletSetup

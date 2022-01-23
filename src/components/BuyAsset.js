import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BuyAmountView from './BuyAmountView'
import BuyCheckoutView from './BuyCheckoutView'

const BuyAsset = () => {

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<BuyAmountView/>} />
        <Route path="checkout" element={<BuyCheckoutView/>} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  )
}

export default BuyAsset

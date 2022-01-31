import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUI } from '../features/settings/settingsSlice'

const WalletSelectUi = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="container mb-3">
      <h1 className="mt-3">Welcome!</h1>
      <p className="fs-5 mt-4">Please select your cryptocurrency knowledge level.</p>
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Beginner</h5>
          <p className="card-text">I don't have any or only some experience using cryptocurrencies. I'd like to use a simple user interface with basic functionality.</p>
          <button type="button" className="btn btn-primary" onClick={() => { dispatch(setUI(0)); navigate('/setup/action')} }>Next</button>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Hodler</h5>
          <p className="card-text">I'm an experienced cryptocurrency user. I'd like to use a user interface with price charts and features for traders.</p>
          <button type="button" className="btn btn-primary" onClick={() => { dispatch(setUI(1)); navigate('/setup/action')} }>Next</button>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">Cypherpunk</h5>
          <p className="card-text">I'm a cryptocurrency expert. I'd like to use a user interface with advanced functionality.</p>
          <button type="button" className="btn btn-primary" onClick={() => { dispatch(setUI(2)); navigate('/setup/action')} }>Next</button>
        </div>
      </div>
    </div>
  )
}

export default WalletSelectUi

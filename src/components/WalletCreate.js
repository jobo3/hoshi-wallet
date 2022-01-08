import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import HDWallet from '../utils/hdWallet'
import Spinner from './Spinner'
import _ from 'lodash'
import { setMnemonic } from '../features/settings/settingsSlice'

const WalletCreate = () => {

  const [mnemonicArray, setMnemonicArray] = useState(null)

  useEffect(() => {
    console.log("create wallet")
    const hdWallet = HDWallet.generate()
    const mnemonic = hdWallet.getMnemonic()
    setMnemonicArray(mnemonic.split(' '))
  }, [])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleNextBtnClick = () => {
    navigate('/setup/create/verify')
  }

  const RecoveryWordsView = () => {
    return (
      <div>
        <h1>Recovery Words</h1>
        <div className="alert alert-warning mt-3" role="alert">
          Write down the 12 recovery words shown below and store them in a safe location. 
        </div>
        <div className="mt-3">
          <div className='d-none d-sm-block'>
            <div className="row g-0">
              <div className="col">
                <ul className="list-group rounded-0">
                  { mnemonicArray.map( (item, i) => i < mnemonicArray.length / 2 && <li key={i} className="list-group-item">{i+1} {item}</li> ) }
                </ul>
              </div>
              <div className="col">
                <ul className="list-group rounded-0">
                  { mnemonicArray.map( (item, i) => i >= mnemonicArray.length / 2 && <li key={i} className="list-group-item">{i+1} {item}</li> ) }
                </ul>
              </div>
            </div>
          </div>
          <div className='d-sm-none'>
            <ul className="list-group rounded-0">
              { mnemonicArray.map( (item, i) => <li key={i} className="list-group-item">{i+1} {item}</li> ) }
            </ul>
          </div>
        </div>
        <div className='mt-3 mb-3'>
          <button className='btn btn-primary' onClick={handleNextBtnClick}>Next</button>
        </div>
      </div>
    )
  }



  const VerifyRecoveryWordsView = () => {

    const [wordArrayRandomOrder, setWordArrayRandomOrder] = useState(_.shuffle(mnemonicArray.slice()))
    const [wordArrayCorrectOrder] = useState(mnemonicArray.slice())
    const [position, setPosition] = useState(0)

    const handleWordBtnClick = (word, index) => {
      let array = [...wordArrayRandomOrder]
      console.log(word)
      console.log(array)
      if (array.length > 0) {
        if (wordArrayCorrectOrder[position] === word) {
          console.log("correct")
          setPosition(position + 1)
          array.splice(index, 1)
          setWordArrayRandomOrder(array)
          if (array.length === 0) {
            console.log("finish")
          }
        }
      }
    }

    const handleFinishBtnClick = () => {
      const mnemonic = mnemonicArray.join(' ')
      console.log("finish btn", mnemonic)
      dispatch(setMnemonic(mnemonic))
      try {
        localStorage.setItem('mnemonic', mnemonic)
      }
      catch(err) {
        console.error(err)
      }
      finally {
        navigate('/')
      }
    }

    return (
      <div>
        <h1>Recovery Words Verification</h1>
        <div className="alert alert-info mt-3" role="alert">
          Tap the words in the correct order.
        </div>
        <div className="mt-3">
          <div className="d-flex flex-wrap justify-content-evenly">
            { wordArrayRandomOrder.map( (item, i) => <div key={i} className="m-1"><button type="button" className="btn btn-secondary" onClick={() => handleWordBtnClick(item, i)}>{item}</button></div> ) }
          </div>
        </div>
        
        <div className="card mt-5">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-evenly">
              { wordArrayCorrectOrder.map( (item, i) => {
                const classes = classNames({
                  "m-1": true,
                  "invisible": i >= position
                })
                return <div key={i} className={classes}><button type="button" className="btn btn-secondary">{i+1} - {item}</button></div>
               } ) }
            </div>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <button className="btn btn-primary" disabled={wordArrayRandomOrder.length > 0} onClick={handleFinishBtnClick}>Finish</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      { mnemonicArray == null ? <Spinner></Spinner> :
      <div>
        <div className='container-md'>
          <Routes>
            <Route path="/" element={<RecoveryWordsView/>} />
            <Route path="verify" element={<VerifyRecoveryWordsView/>} />
          </Routes>
        </div>
      </div> }
    </div>
  )
}

export default WalletCreate

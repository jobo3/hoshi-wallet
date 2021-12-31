import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HDWallet from '../utils/hdWallet'
import Spinner from './Spinner'

const WalletCreate = () => {

  const [mnemonicArray, setMnemonicArray] = useState(null)

  useEffect(() => {
    const hdWallet = HDWallet.generate()
    const mnemonic = hdWallet.getMnemonic()
    setMnemonicArray(mnemonic.split(' '))
  }, [])

  const history = useHistory()

  const handleNextBtnClick = () => {
    // @TODO: check if the user has written down the mnemonic correctly 
    const mnemonic = mnemonicArray.join(' ')
    try {
      const localStorage = window.localStorage
      localStorage.setItem('mnemonic', mnemonic)
      history.push('/wallet')
    }
    catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      { mnemonicArray == null ? <Spinner></Spinner> :
      <div>
        <div className='container-md'>
          <div className="alert alert-warning mt-3" role="alert">
            Write down the 12 backup words shown below and store them in a safe location. 
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
                { mnemonicArray.map( (item, i) => i < mnemonicArray.length && <li key={i} className="list-group-item">{i+1} {item}</li> ) }
              </ul>
            </div>
          </div>
          <div className='mt-3 mb-3'>
            <button className='btn btn-primary' onClick={handleNextBtnClick}>Next</button>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default WalletCreate

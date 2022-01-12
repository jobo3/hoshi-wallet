import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as bip39 from 'bip39'
import { useNavigate } from 'react-router-dom'
import { setMnemonic } from '../features/settings/settingsSlice'

const WalletRestore = () => {

  const wordlist = bip39.wordlists.english

  const MAX_MNEMONIC_SIZE = 12

  // start with an empty word list 
  const [mnemonicArray, setMnemonicArray] = useState(Array(MAX_MNEMONIC_SIZE).fill(''))

  const input = useRef(null)

  const addWord = () => {
    const word = input.current.value
    if (wordlist.includes(word)) {
      let copiedArray = mnemonicArray.slice()
      let index = copiedArray.findIndex(e => e === '')
      if (index >= 0) {
        copiedArray[index] = word
      }
      setMnemonicArray(copiedArray)
      input.current.value = ''
    }
  }

  const deleteWord = () => {
    // set last word in list to ''
    let copiedArray = mnemonicArray.slice()
    let index = copiedArray.findIndex(e => e === '')
    // list is empty -> return
    if (index === 0) return
    // list is full -> delete last word
    if (index === -1) {
      copiedArray[copiedArray.length-1] = ''
    }
    else {
      copiedArray[index-1] = ''
    }
    setMnemonicArray(copiedArray)
  }

  const handleKeyDown = (event) => {
    if ( event.keyCode === 13 ) {
      addWord()
    }
  }

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleRestoreWalletBtn = () => {
    const mnemonic = mnemonicArray.join(' ')
    dispatch(setMnemonic(mnemonic))
    // save mnemonic to local storage
    try {
      localStorage.setItem('mnemonic', mnemonic)
      navigate('/')
    }
    catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className='container-md' >
        <h1>Restore Wallet</h1>
        <div className="alert alert-info mt-3" role="alert">
          Write your 12 recovery words in the correct order, then click on "restore wallet"
        </div>
        <div className="input-group pt-3">
          <input className="form-control" list="datalistOptions" id="dataList" ref={input} placeholder="Type to search..." onKeyDown={handleKeyDown}/>
          <button className="btn btn-primary" type="button" onClick={addWord}>Add</button>
          <datalist id="datalistOptions">
            {
              wordlist.map( (item, i) =>
                <option value={item} key={i} />
              )
            }
          </datalist>
        </div>
        <div className="mt-3">
        <div className='d-none d-sm-block'>
            <div className="row g-0">
              <div className="col">
                <ul className="list-group rounded-0">
                  { mnemonicArray.map( (item, i) => i < mnemonicArray.length / 2 && <li key={i} className="list-group-item">{i+1} {item ? item : ''}</li> ) }
                </ul>
              </div>
              <div className="col">
                <ul className="list-group rounded-0">
                  { mnemonicArray.map( (item, i) => i >= mnemonicArray.length / 2 && <li key={i} className="list-group-item">{i+1} {item ? item: ''}</li> ) }
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
        <div className="mt-3 mb-3">
          <button className="btn btn-danger me-2" onClick={deleteWord}>Delete last</button>
          <button className="btn btn-primary" disabled={mnemonicArray.includes('')} onClick={handleRestoreWalletBtn}>Restore wallet</button>
        </div>
      </div>
    </div>
  )
}

export default WalletRestore

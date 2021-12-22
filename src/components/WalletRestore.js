import React, { useRef, useState } from "react"
import * as bip39 from 'bip39'
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setMnemonic } from "../features/settings/settingsSlice"

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

  const dispatch = useDispatch()
  const history = useHistory()

  const handleRestoreWalletBtn = () => {
    const mnemonic = mnemonicArray.join(' ')
    // save mnemonic to local storage
    try {
      const localStorage = window.localStorage
      localStorage.setItem('mnemonic', mnemonic)
      dispatch(setMnemonic(mnemonic))
      history.push('/wallet')
    }
    catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className='container-md' > 
        <div className="alert alert-info mt-3" role="alert">
          Write your 12 backup words in the correct order, then click on "restore wallet"
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
        <div>
        </div>
          <div className="mt-3">
            <div className="row g-0">
              <div className="col">
                <ul className="list-group">
                  {
                    mnemonicArray.map( (item, i) =>
                    i < MAX_MNEMONIC_SIZE / 2 && <li key={i} className="list-group-item">{i+1} {item ? item : ""}</li>
                    )
                  }
                </ul>
              </div>
              <div className="col">
                <ul className="list-group">
                  {
                    mnemonicArray.map( (item, i) => 
                    i >= MAX_MNEMONIC_SIZE / 2 && <li key={i} className="list-group-item">{i+1} {item ? item : ""}</li>
                    )
                  }
                </ul>
              </div>
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

